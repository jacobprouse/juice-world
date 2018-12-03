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
var myHasher2 = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
        if(err){console.log(err);}
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){console.log(err);}
            return hash
        });
    });
};


mongoose.connect('mongodb://localhost:27017/bears', { useNewUrlParser: true });

var Juice = require('./app/models/juice');
var User = require('./app/models/user');
var Comments = require('./app/models/comments');
var Collections = require('./app/models/collections');

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
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
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
        
        nev.confirmTempUser(url, function(err, user1) {
            if(err){console.log(err);}
            if (user1) {
                nev.sendConfirmationEmail(user1.email, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending confirmation email FAILED');
                    }
                    //send the verification page
                    res.sendFile(path.join(__dirname + '/public/verified.html'));
                });
            } else {
                return res.status(404).send('ERROR: confirming temp user FAILED');
            }
            User.find({email:user1.email}).exec(function(err, user){
                user[0].verified=true;
                user[0].role = 'store-manager'
                user[0].save(function(err){
                });
            });
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

// on routes that end in /createAccount
// ----------------------------------------------------
router.route('/createAccount')

    // create a user (accessed at https://se3316-jprouse2-lab5-jprouse2.c9users.io:8081/api/createAccount)
    // code modified from url: https://github.com/whitef0x0/node-email-verification/blob/master/examples/express/server.js
    .post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var button = req.body.buttonType;
        console.log(button)
        
        if(!validator.isEmail(email)){
            res.send("Input valid email");
        }
        else if(typeof password == 'undefined' || password==''){
            res.send("Wrong password")
        }
        else{
            var newUser = new User({
                email: email,
                password: password
            });
            if(button == 'register'){
                nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
                    if (err) {
                        res.status(404).send('ERROR: creating temp user FAILED');
                    }
        
                    // user already exists in persistent collection
                    if (existingPersistentUser) {
                        res.send('You have already signed up and confirmed your account. Did you forget your password?');
                    }
                
                    // new user created
                    if (newTempUser) {
                        var URL = newTempUser[nev.options.URLFieldName];
                        
                        nev.sendVerificationEmail(email, URL, function(err, info) {
                            if (err) {
                                return res.status(404).send('ERROR: sending verification email FAILED');
                            }
                            res.send('An email has been sent to you. Please check it to verify your account.')
                        });
        
                        // user already exists in temporary collection!
                    } else {
                        res.send('You have already signed up. Please check your email to verify your account.');
                    }
                });
            }else{
                nev.resendVerificationEmail(email, function(err, userFound) {
                    if (err) {
                        return res.status(404).send('ERROR: resending verification email FAILED');
                    }
                    if (userFound) {
                        res.send('An email has been sent to you, yet again. Please check it to verify your account.');
                    } else {
                        res.send('Your verification code has expired. Please sign up again.');
                    }
                });
            }
        }
    })
    //end copied code
    .put(function(req, res){
        let useremail= req.body.email;
        User.find({email:useremail}).exec(function(err, user){
            if(err){
                res.send(err);
            }
            user[0].verified = true;
            user[0].active=true;
            user[0].role = 'admin';
            user[0].save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json('saved');
            });
            

        });
    })
    
// on routes that end in /authenticate (for logging in)
// ----------------------------------------------------
router.route('/authenticate')

    // login a user, send a token
    .post(function(req, res) {
        let email = req.body.email;
        let pass = req.body.password;
        if(!validator.isEmail(email)){
            res.send("Input email");
        }
        else if(typeof req.body.password == 'undefined' || req.body.password==''){
            res.send("Input password")
        }
        else{
        var user1 = new User();
        //get the email
        user1.email = req.body.email;
        //get pass
        
        //make query
        let query = {email:user1.email};
        //execute query
        User.find(query, function(err, user){
            if(err){res.send("Wrong email or password");}
            if(typeof user[0] == 'undefined'){
                "Wrong email or password"
            }
            if(user[0].active == false){
                res.send('User is not active, see Store Manager')
            }
            if(user[0].verified == false){
                res.send("You aren't verified, check your email")
            }
            //compare passwords with hash
            bcrypt.compare(pass, user[0].password, function(err, result) {
                if(err){
                    res.send("Wrong email or password");
                }
                console.log('in')
                if(result==true){
                    //is true
                    jwt.sign({role:user[0].role, email:user[0].email}, 'secret', { expiresIn: '1h'}, (err, token)=>{
                        if(err){
                            res.send("Wrong email or password");
                        }
                        //send token
                        console.log('sending')
                        res.json({
                            token: token
                        });
                        //client saves token in local storage
                    });
                }
                else{
                    res.send("Wrong email or password")
                }
            });
        })
        }
    })
    
// on routes that end in /comments/:juice_id
// ----------------------------------------------------
router.route('/comments/:juice_id')
    
    //post a comment for a specific juice_id
    .post(function(req, res){
        let comment = new Comments()
        if(typeof req.body._id == 'undefined' || typeof req.body.text == 'undefined' ||
        typeof req.body.email == 'undefined' || typeof req.body.rating == 'undefined'){
            res.send('Fill out the fields')
        }
        comment.juiceID =  req.body._id;
        comment.text = req.body.text;
        comment.email = req.body.email;
        comment.rating = req.body.rating;
        // save the bear and check for errors
        comment.save(function(err) {
            if (err){
                res.send(err);
            }
        });
    })
    
    //get all comments for a specific juice
    .get(function(req, res){
        let query = {juiceID:req.params.juice_id};
        Comments.find(query, function(err, comments) {
            if (err){
                res.send(err);}
            res.json(comments);
        });
    });
        
// on routes that end in /comments/:user_email
// ----------------------------------------------------
router.route('/comments/:user_id')
    
    //get all comments by specific user
    .get(function(req, res){
        let query = {email:req.body.email}
        Comments.find(query, function(err, comments) {
            if (err){
                res.send(err);}
            res.json(comments);
        });
    })
    
    //change visibility of comment
    .put(function(req, res){
        //implement
    });

//easy grab all comments (for dev testing)
// ----------------------------------------------------
router.route('/comments')
    
    //get all comments
    .get(function(req, res){
        Comments.find(function(err, comments) {
            if (err){
                res.send(err);}
            res.json(comments);
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
                // if(authData.user.role!='store-manager'){
                //     res.send("the senate will decide youre fate");
                // }
                var juice = new Juice();// create a new instance of the Bear model
                req.body.name = validator.escape(req.body.name);//escape html characters
                req.body.name = validator.trim(req.body.name);//trim whitespace
                var cleanName = sanitize(req.body.name);//sanitize for noSQL commands
                juice.name = cleanName // set the bears name (comes from the request)
                juice.price = req.body.price;
                juice.tax = req.body.tax;
                juice.quantity = req.body.quantity;
                juice.sold = req.body.sold;
                juice.description = req.body.description;
                
                // save the bear and check for errors
                juice.save(function(err) {
                    if (err){
                        res.send(err);
                    }
                    res.json({ 
                        message: 'Juice created! I AM THE SENATE',
                        juice
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
    
// on routes that end in /juice/buy
// ----------------------------------------------------
router.route('/juice/buy')    

    .put(function(req, res) {
        Juice.findById(req.body._id, function(err, juice){
            if(err){ 
                res.send(err);
            }
            console.log(req.body)
            juice.quantity = req.body.newQuantity;
            juice.sold = juice.sold + req.body.cart;
            juice.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json({ message: ' updated!' });
            });
        })
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
        Juice.findById(req.body.juice_id, function(err, juice){
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

// on routes that end in /collections
// ----------------------------------------------------
router.route('/collections')

    // get the collection of user
    .get(function(req, res) {
        Collections.find(req.body.email, function(err, col) {
            if (err){
                res.send(err);}
            res.json(col);
        });
    })
    
    // post a new collection for user
    .post(verifyToken,function(req, res) {
        jwt.verify(req.token, 'secret', (err, authData) =>{
            if(err){
                res.sendStatus(403);
            }else{
                // save the bear and check for errors
                let col = new Collections();
                col.name = req.body.name;
                col.email = req.body.email;
                col.description = req.body.description;
                if(typeof req.body.visibility == 'undefined'){
                    col.visibility = 'Private';
                }
                else{
                    col.visibility = req.body.visibility;
                }
                col.save(function(err) {
                    if (err){
                        res.send(err);
                    }
                    res.json({
                        msg:col._id
                    });
                });
            }
        });
    })
    
    // update the collection of this user
    .put(function(req, res) {
        Collections.findById(req.body.coll_id,function(err, col){
            if(err){ 
                res.send(err);
            }
            //add juice to coll
            if(req.body.method=='add'){
                console.log('hi')
                col.juices.push({
                    juiceID:req.body.prod_id,
                    juiceName:req.body.juiceName,
                    quantity:1
                });
                console.log(col.juices)
            }
            //increase quant of juice
            else if(req.body.method == 'add-minus'){
                console.log('asdasd')
                col.juices.forEach(element =>{
                   if(element._id == req.body.prod_id){
                       element.quantity = req.body.wanted
                   }
                });
            }
            //else is update collection
            else{
                if(req.body.name!=''){
                    col.name = req.body.name;
                }
                if(req.body.description!=''){
                    col.description = req.body.description;

                }
                col.visibility = req.body.visibility;
            }
            col.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json(col)
            });
        })
    })
    
// on routes that end in /collections
// ----------------------------------------------------
router.route('/collections/all')

    // get all collections
    .get(function(req, res) {
        let query = {visibility:'Public'}
        Collections.find(query,function(err, collections) {
            if (err){
                res.send(err);}
            res.json(collections);
        });
    })
    
    // on routes that end in /collections/:_id
// ----------------------------------------------------
router.route('/collections/:_id')

    // get the collection by id
    .get(function(req, res) {
        Collections.findById(req.params._id, function(err, col) {
            if (err){
                res.send(err);}
            res.json(col);
        });
    })
    
    //delete the collection by id
    .delete(function(req, res) {
        console.log(req.params._id)
        Collections.deleteOne({_id: req.params._id}, function(err, juice) {
            if (err){
                res.send(err);}

            res.json({ message: 'Successfully deleted' });
            console.log('hes gone')
        });
    });

// on routes that end in /collections/juice/:_id
// ----------------------------------------------------
router.route('/collections/juice')
    //delete the collection by id
    .put(function(req, res) {
        console.log(req.body)
        Collections.findById(req.body.coll_id, function(err, coll) {
            if (err){
                res.send(err);}
            
            console.log(coll.juices)
            for(let i =0; i<coll.juices.length;i++){
                if(coll.juices[i].juiceID == req.body.juice_id){
                    coll.juices.splice(i, 1);
                    break;
                }
            }
            console.log(coll.juices)
            coll.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json(coll)
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// FUNCTIONS
// =============================================================================
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
function checkHash(password){
    bcrypt.genSalt(8, function(err, salt) {
        if(err){console.log(err);}
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){console.log(err);}
            return hash;
        });
    });
}


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);