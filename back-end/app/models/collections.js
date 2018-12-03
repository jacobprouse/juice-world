var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var CollectionsSchema   = new Schema({
    juices: [
        {juiceID:String,
        juiceName:String,
        quantity:Number}
    ],
    name: {type:String, required:true},
    email: {type:String, required:true},
    description: {type:String, required:true},
    visibility: {type:String, required:true, default: 'Private'}
});

module.exports = mongoose.model('collections', CollectionsSchema);