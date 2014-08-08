var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/Doug');
var PostSchema = new mongoose.Schema({
    name: String,
    text: String,
    title: String,
    photo: String,
    photo_top_check: Boolean,
    date: {type: Date, default:Date.now}
});


module.exports = mongoose.model('Post', PostSchema);