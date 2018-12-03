var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var CommentsSchema   = new Schema({
    juiceID: {type:String, required:true},
    juiceName: {type:String, required:true},
    text: {type:String, required:true},
    email: {type:String, required:true},
    rating: {type:Number, required:true},
    hidden: {type: String, required:true, default:'false'}
});

module.exports = mongoose.model('comments', CommentsSchema);