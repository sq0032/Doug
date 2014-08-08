/* GET home page. */
//var fs = require('fs');
//var User = require('../models/user.js');
var Post = require('../models/Post.js');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.post = function(req, res){  
    console.log(req.method);

    if(req.method=='POST'){
        var name    = req.body['name'];
        var title   = req.body['title'];
        var text    = req.body['text'];
        var photo   = req.body['photo_path'];
        
        var post = new Post({
                name    : name,
                title   : title,
                text    : text,
                photo   : photo,
        });
        
        post.save(function(err, post){
            if(err) throw err;
            res.send(post);
        });
    }else if(req.method=='GET'){
        var query = Post.find(function(err, posts){
            if(err) throw err;
            res.send(posts);
        });
    }else if(req.method=='DELETE'){
        var id = req.params.id;
        Post.findById(id, function(err, post){
            if(err) throw err;
            post.remove();
            res.end();
        });
    }
    
    
    //res.end();
    /*var post = new Post({text:'test text'});
    post.save();
    res.end('saved');*/
//    console.log(req.user);
};

exports.photo = function(req, res){
    console.log('photo uploaded');
    console.log(req.files);
    console.log(req.body);
    
    res.end();
}