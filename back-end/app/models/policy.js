var mongoose   = require('mongoose');

var Schema       = mongoose.Schema;

var PolicySchema   = new Schema({
    privacy_content: {type:String, required:true}
});

module.exports = mongoose.model('policy', PolicySchema);