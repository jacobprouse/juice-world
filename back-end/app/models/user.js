var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');
let validator = require('validator');

var UserSchema   = new Schema({
    //email and password are required, and email must be unique, i.e. cannot belong to more than 1 account
    email: {type:String, required: true, index: { unique: true },validate: (value) => {return validator.isEmail(value)} },
    //doesnt have to be unique
    password:{type:String, required: true},
    //role of user i.e. admin, normal, etc..
    role:{type:String, default: 'customer'},
    //if the account is active/deactivated
    active:{type: Boolean, default: false},
    //if the account has been verified
    verified:{type: Boolean, default: false}
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', UserSchema);