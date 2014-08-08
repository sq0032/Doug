var app = app || {};

app.Post = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot:'/post'
})

app.Posts = Backbone.Collection.extend({
    model   : app.Post,
    url : '/post'
})

app.PostView = Backbone.View.extend({
    tagName: 'div',
    className: 'post',
    events: {
        'click button'  : 'deletePost',
    },
    initialize: function(){
        this.post = this.model;
        this.post.id = this.post.get('_id');
        this.render();
    },
    render: function(){
        var name    = this.post.get('name');
        var text    = this.post.get('text');
        var id      = this.post.get('id');
        var date    = this.post.get('date');
        var title   = this.post.get('title');
        var photo   = this.post.get('photo');
        
        var html    =
            "<h4>"+title+"</h4>\
            <p>"+text+"<p>\
            <div class='clear'>\
            <div style='float:right'>written by <strong>"+name+"</strong> at <strong>"+date+"</strong></div>\
            <div class='clear'>";
        
        var buttonHtml  = "<button style='float:right'>Delete</button>";
        var photoHtml   = "<div class='clear'></div><img src='uploads/"+photo+"' width='500' height='300'>";
        this.$el.html(html);
        if(typeof(photo)!='undefined'){
            this.$el.prepend(photoHtml);
        }
        this.$el.prepend(buttonHtml);
    },
    deletePost: function(){
        this.post.destroy();
        this.remove();
    }
})

app.TimeLineView = Backbone.View.extend({
    el: '#timeline',
    initialize: function(){
        //this.render();
        
        this.listenTo(app.posts, 'reset', this.render);
        this.listenTo(app.posts, 'add', this.renderPost);
        app.posts.fetch({reset:true});
    },
    render: function(){
        var that = this;
        app.posts.each(function(post){
            that.renderPost(post);
        });
    },
    renderPost: function(post){
        var postView = new app.PostView({model:post});
        this.$el.append(postView.el);
    }
})



app.SubmitView = Backbone.View.extend({
    el: '#postModal',
    events: {
        "click .btn-primary": "submitPost",
    },
    initialize: function(){
        //this.render();
        
        //Image upload setting
        var that = this;
        this.photo = null;
    
        $('#fileupload').fileupload({
            //url: '/photo_upload',
            autoUpload: false,
            dataType: 'multipart/form-data',
            singleFileUploads:true
        }).on('fileuploadadd', function(e, data){
            that.photo = data;
            that.photo.url = '/photo_upload';
            that.$('#files').html(data.files[0].name);
//            that.photo.submit();
//            console.log(data);
        });
    },
    render: function(){
        //this.$el.html(' ');
    },
    submitPost: function(){
        var name        = this.$('#InputName').val();
        var title       = this.$('#InputTitle').val();
        var text        = this.$('textarea').val();
        var photo_path  = this.photo.files[0].name; 
        //var photo   = this.$('#InputFile').files;
        //alert(photo);
        
        var post    = new app.Post({
            name        : name,
            title       : title,
            text        : text,
            photo_path  : photo_path,
        });
        
        //Ask server to save the post into database
        var that = this;
        post.save(null,{
            success: function(post, response){
                that.photo.submit();
                
                app.posts.add(post);
                that.$('input').val('');
                that.$('textarea').val('');
                that.$el.modal('hide');
            },
            error: function(model, response){
                alert(response);
            }
        });
    },
})

app.AppView = Backbone.View.extend({
    el: '#app',
    initialize: function(){
    
    },
    render: function(){
    
    }
})


app.posts = new app.Posts();