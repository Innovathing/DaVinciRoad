var express = require('express');
var router = express.Router();
var tumblr = require('tumblr');
var config = require('../config.json');
var url = require('url');
var path = require('path');

var city = config.cities;
var blog = new tumblr.Blog(config.tumblrUrl, config.tumblrOAuthKeys);

router.get('/', function(req, res, next) {
  blog.posts({}, function(error, response) {
    if(error) throw new Error(error);
    
    var postToPostDate = [];
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
        nbPostsForCurrentDay = 0;
        var tmp = {date:last_date, posts:[]};
        days[nbDay]= tmp;
      }
      var repost = isRepost(post.tags, nbDay+1);
      if(repost>-1) {
        if(postToPostDate[repost] == undefined) {
          postToPostDate[repost] = {posts:[]};
        }
        var maxPostForDay = postToPostDate[repost].posts.length;
        postToPostDate[repost].posts[maxPostForDay] =  post;
      } else {
        days[nbDay].posts[nbPostsForCurrentDay] = post;
        nbPostsForCurrentDay++;
      }
    });
    
    var data =[];
    for(var i= nbDay; i>=0; i--) {
      var nbTimelapse=0, nbPosts=0;
      var daily_post = days[i].posts;
      var current_data={posts:[], timelapse:[]};
      current_data.date = days[i].date;
      current_data.city = city[nbDay-i];
      if(current_data.city==undefined) current_data.city="undefined";
      
      //If there are any post to post date, add them to daily_post
      if(postToPostDate[nbDay-i] != undefined) {
        postToPostDate[nbDay-i].posts.forEach(function(post, index, array) {
          daily_post[daily_post.length] = post;
        });
      }
      daily_post.forEach(function(post, index,array) {
          if(post.type== "photo" && post.tags.indexOf("featured") > -1) {
            current_data.featured = post.photos[0].original_size;
          }
          else if(post.type== "photo") {
            current_data.posts[nbPosts] = {type:"photo", data: post.photos, id: post.id};
            nbPosts++;
          } else if(post.type == "video" && post.tags.indexOf("timelapse") > -1) {
            var d = {video: post.video_url, preview:post.thumbnail_url};
            current_data.timelapse[nbTimelapse] = d;
            nbTimelapse++;
          } else if(post.type == "video") {
            var d = {video: post.video_url, preview:post.thumbnail_url}
            current_data.posts[nbPosts] = {type:"video", data: d};
            nbPosts++;
          } else if(post.type =="text") {
            current_data.posts[nbPosts] = {type:"text", data: post.body};
            nbPosts++;
          } else if(post.type == "quote") {
            current_data.posts[nbPosts] = {type:"quote", data:{from:post.source, text:post.text}};
            nbPosts++;
          } else if(post.type=="link") {
            current_data.posts[nbPosts] = {type:"link", data:getDlLink(post.url)};
            nbPosts++;
          };

      });

      data[nbDay-i] = current_data;

    }

    console.log(JSON.stringify(data,null));      

    res.render('index', {days:data});
  });
});

function isRepost(array,tagMax) {
  for(var i = 0; i < array.length;i++) {
    for(var j=0;j <= tagMax;j++) {
      if(array[i] == "day"+j || array[i] == "day " +j) {
        return j;
      }
    }
  }
  return -1;
}

function getDlLink(link) {
  var u = url.parse(link);
  var id = path.basename(path.resolve(u.pathname,'..'));
  return 'https://docs.google.com/uc?authuser=0&id=' + id + '&export=download';
}

module.exports = router;
