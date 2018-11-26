var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var JuiceSchema   = new Schema({
    name: {type:String},
    price: {type:Number},
    tax: {type:Number, default:0},
    quantity:{type:Number, default:0}
});

module.exports = mongoose.model('juice', JuiceSchema);