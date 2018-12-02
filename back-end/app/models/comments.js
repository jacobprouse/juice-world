var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var CommentsSchema   = new Schema({
    juiceID: {type:String, required:true},
    text: {type:String, required:true},
    email: {type:String, required:true},
    rating: {type:Number, required:true}
});

module.exports = mongoose.model('comments', CommentsSchema);