var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var CollectionsSchema   = new Schema({
    juices: {
        juiceID:String,
        quantity:Number
    },
    email: {type:String, required:true},
    description: {type:String, required:true},
    visibility: {type:String, required:true}
});

module.exports = mongoose.model('collections', CollectionsSchema);