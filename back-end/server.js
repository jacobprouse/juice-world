//server.js
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path       = require('path');
var validator = require('validator');//to protect against html/js injection
var sanitize = require('mongo-sanitize');//to protect againts mongoDB injection
var jwt = require('jsonwebtoken');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var port = 8081;        // set our port

// making database
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/bears', { useNewUrlParser: true });

var Juice = require('./app/models/juice');
var User = require('./app/models/user');

var nev = require('email-verification')(mongoose);

/*
    code for email verification from url :https://www.npmjs.com/package/email-verification
*/
    
//email verification
nev.configure({
    verificationURL: 'https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'tempusers',
 
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'juicesalesman@gmail.com',
            pass: 'juice123sales'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <juicesalesman@gmail.com>',
        subject: 'Please confirm account',
        html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
                'paste the following link into your browser:</p><p>${URL}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    shouldSendConfirmation: true,
    hashingFunction: myHasher,
    passwordFieldName: 'password',
}, function(err, options){
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

//generate temp model
nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

/*
    end copied code for email verifiying
*/
    
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'Hello World' });
});

// more routes for our API will happen here

// on routes that end in /email-verification/:URL for email verification
// ----------------------------------------------------
router.route('/email-verification/:URL')
    //code for email verification from url :https://www.npmjs.com/package/email-verification
    //get verification page
    .get(function(req, res) {
        var url = req.params.URL;
        
        nev.confirmTempUser(url, function(err, user) {
            if(err){console.log(err);}
            if (user) {
                nev.sendConfirmationEmail(user.email, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending confirmation email FAILED');
                    }
                    //send the verification page
                    res.sendFile(path.join(__dirname + '/public/verified.html'));
                    //used for confirmation testing
                    // res.json({
                    //     msg: 'CONFIRMED!',
                    //     info: info
                    // });
                    user.active=true;
                    user.verified=true;
                });
            } else {
                return res.status(404).send('ERROR: confirming temp user FAILED');
            }
        });
    });
    //end copied code

// on routes that end in /user   (just for dev testing)
// ----------------------------------------------------
//return all users for testing
router.route('/user')
    .get(function(req, res) {
        User.find(function(err, user) {
            if (err){
                res.send(err);}
            res.json(user);
        });
    });

// on routes that end in /createAccount (just for dev testing)
// ----------------------------------------------------
// router.route('/createAccounteasy')
//     .post(function(req, res) {
//         var email = req.body.email;
//         var password = req.body.password;
//         if(!email || !password){
//             res.send("Input email and pass");
//         }
//         var newUser = new User();
//         newUser.email= email;
//         newUser.password= password;
//         newUser.save(function(err) {
//             if (err){
//                 res.send(err);
//             }
//             res.json({ message: 'User created!' });
//         });
//     });
//easy route

// on routes that end in /createAccount
// ----------------------------------------------------
router.route('/createAccount')

    // create a user (accessed at https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/createAccount)
    // code modified from url: https://github.com/whitef0x0/node-email-verification/blob/master/examples/express/server.js
    .post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var newUser = new User({
            email: email,
            password: password
        });
        

        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }
        
            // new user created
            if (newTempUser) {
                var URL = newTempUser[nev.options.URLFieldName];
                
                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

                // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });
    });
    //end copied code
// on routes that end in /resend, for resending the verif email (for dev testing)
// ----------------------------------------------------
 router.route('/resend')
    //code modified from url: https://github.com/whitef0x0/node-email-verification/blob/master/examples/express/server.js
    .post(function(req, res) {
        var email = req.body.email;
        
        nev.resendVerificationEmail(email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }
            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    });
    //end copied code
    
// on routes that end in /authenticate (for logging in)
// ----------------------------------------------------
router.route('/authenticate')

    // create a bear (accessed at POST c9 public url)
    .post(function(req, res) {
        var user1 = new User();
        user1.email = req.body.email;
        let expass = checkHash(req.body.password);
        User.find({email:user1.email}).exec(function(err, user){
            if(err){res.send(err);}
            
            if(user.password == expass){
                //is good
                jwt.sign({user:user}, 'secret', { expiresIn: '1h' }, (err, token)=>{
                    if(err){res.send(err)};
                    res.json({
                        token: token
                    });
                    //client saves token in local storage
                });
            }
        });
    });

// on routes that end in /juice
// ----------------------------------------------------
router.route('/juice')

    // create a juice (https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice)
    .post(verifyToken, function(req, res) {
        jwt.verify(req.token, 'secret', (err, authData) =>{
            if(err){
                res.sendStatus(403);
                
            }else{
                var juice = new Juice();// create a new instance of the Bear model
                req.body.name = validator.escape(req.body.name);//escape html characters
                req.body.name = validator.trim(req.body.name);//trim whitespace
                var cleanName = sanitize(req.body.name);//sanitize for noSQL commands
                juice.name = cleanName // set the bears name (comes from the request)
                juice.price = req.body.price;
                juice.tax = req.body.tax;
                juice.quantity = req.body.quantity;
                juice.sold = req.body.sold;
                
                // save the bear and check for errors
                juice.save(function(err) {
                    if (err){
                        res.send(err);
                    }
                    res.json({ 
                        message: 'Juice created!' ,
                        authData
                    });
                });
            }
        });
    })
    
    // get all the juices (https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/juice)
    .get(function(req, res) {
        Juice.find(function(err, juice) {
            if (err){
                res.send(err);}

            res.json(juice);
        });
    });
    
// on routes that end in /juice/top_juices
// ----------------------------------------------------
router.route('/juice/top_juices')    

    .get(function(req, res) {
        //query to find top 10 products
        let query = {sold:-1};
        Juice.find().sort(query).limit(10).exec(function(err, juice) {
            if (err) throw err;
            res.send(juice);
        });
    });

// on routes that end in /juice/:juice_id
// ----------------------------------------------------
router.route('/juice/:juice_id')

    // get the juice with that id 
    .get(function(req, res) {
        Juice.findById(req.params.bear_id, function(err, juice) {
            if (err){
                res.send(err);}
            res.json(juice);
        });
    })
    
    // update the juice with this id 
    .put(function(req, res) {
        Juice.findById(req.body.bear_id, function(err, juice){
            if(err){ 
                res.send(err);
            }
            juice.sold = req.body.sold;
            res.json(juice);
        })
    })
    
    // delete the juice with this id
    .delete(function(req, res) {
        console.log(req.body.juice_id)
        Juice.remove({
            _id: req.body.juice_id
        }, function(err, juice) {
            if (err){
                res.send(err);}

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// FUNCTIONS
// =============================================================================
//hashing functions
var myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
        if(err){console.log(err);}
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){console.log(err);}
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};
var checkHash = function(password){
        bcrypt.genSalt(8, function(err, salt) {
        if(err){console.log(err);}
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){console.log(err);}
            return hash;
        });
    });
};

//verify token
//Format of token
//Authorization: Bearer <access_token>
function verifyToken(req, res, next){
    // get auth header value
    let bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader != 'undefined'){
        //split at the space (Bearer' 'token)
        let bearer = bearerHeader.split(' ');
        //get token from array
        let bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //call middlewear
        next();
    }else{
        //forbidden
        res.json("You fudged up on verifyToken function");
    }
    
}


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);