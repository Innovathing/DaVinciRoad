var express = require('express');
var router = express.Router();
var tumblr = require('tumblr');
var oauth = {
  consumer_key: '45EWPfOgq6rRvQCAGlno5Vr4EXcVlOqpJO7xEUyueD264i8pU9',
  consumer_secret: 'fyGnV64yEa4Itf2ukcppDll2jYgf24cEsh4KS2GRHlYSf4NgOk',
};
var city = ["Toulouse", "Genova", "Cinq Terres", "Firenze", "Roma", "Ancona","Venise", "Montagnes"];
var blog = new tumblr.Blog('magic-micky.tumblr.com', oauth);


router.get('/', function(req, res, next) {
  blog.posts({}, function(error, response) {
    if(error) throw new Error(error);
    console.log(response); 
    var days = [];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() +1;
    var yyyy = today.getFullYear();
    var todays_post = response.posts;
    var last_date=undefined;
    var nbDay=-1;
    var nbPostsForCurrentDay=0;
    todays_post.forEach(function(post,index,array) {
      
      var post_date = post.date.split("-");
      var date = new Date(post_date[0], (post_date[1] -1), post_date[2].split(" ")[0]);
      if(last_date==undefined || date.getTime() != last_date.getTime()) {
        last_date = date;
        nbDay++;
        nbPostsForCurrentDay=0;
        var tmp = {date:last_date, posts:[]};
        days[nbDay]= tmp;
      }
      days[nbDay].posts[nbPostsForCurrentDay] = post;
      nbPostsForCurrentDay++;
    });
    
    var data =[];

    for(var i= nbDay; i>=0; i--) {
      var daily_post = days[i].posts;
      var current_data={quote:[],text:[], images:[], timelapse:[]};
      current_data.date = days[i].date;
      current_data.city = city[nbDay-i];
      if(current_data.city==undefined) current_data.city="undefined";
      var nbImages=0;
      var nbTimelapse=0;
      var nbText=0;
      var nbQuote=0;
      daily_post.forEach(function(post, index,array) {
          if(post.type == "photo" && post.tags.indexOf("featured") > -1) {
            current_data.featured = post.photos[0].original_size;
          }
          else if(post.type== "photo") {
            //TODO : there can be more than one photo
            current_data.images[nbImages]=post.photos;
            nbImages++;
          } else if(post.type == "video") {
            current_data.timelapse[nbTimelapse] = post.video_url;
            nbTimelapse++;
          } else if(post.type =="text") {
            current_data.text[nbText] = post.body;
            nbText++;
          } else if(post.type == "quote") {
            current_data.quote[nbQuote] = {from:post.source, text:post.text};
            nbQuote++;
          };
      });

      data[nbDay-i] = current_data;

    }

    console.log(JSON.stringify(data,null));      
    res.render('index', {days:data});
  });
  
  
  
  
  //res.send("Hello");
});

module.exports = router;
