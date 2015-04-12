var express = require('express');
var router = express.Router();
var tumblr = require('tumblr');
var config = require('../config.json');
var url = require('url');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var city = config.cities;
var blog = new tumblr.Blog(config.tumblrUrl, config.tumblrOAuthKeys);

router.get('/', function(req, res, next) {
  var postToPostDate = [];
  var days = [];
  var nbPosts = 0;
  var posts = [];
  retrievePosts(0,50, posts, res);

});

function retrievePosts(from, limit, posts, res) {
  console.log("Calling api " + from + " to " + limit);
    blog.posts({limit:limit, offset:from }, function(error, response) {
    if(error) throw new Error(error);

      response.posts.forEach(function(post, index, array) {
        posts.push(post);
      });
      if(response.total_posts > (from + limit)) {
        retrievePosts(from+limit, limit, posts,res);
      } else {
        var returned = parseTumblrResult(posts);
        var days = returned[0];
        var postToPostDate = returned[1];
        var data = formatData(days, postToPostDate);
        res.render('index', {days:data});
      }



  });
}


function parseTumblrResult(tumblrResult) {
  // var today = new Date();
  // var dd = today.getDate();
  // var mm = today.getMonth() +1;
  // var yyyy = today.getFullYear();
  var res =[];
  var postToPostDate = [];

  var todays_post = tumblrResult;
  
  var current = { date: undefined, nbPosts:0};

  var nbDay=res.length;
  
  todays_post.forEach(function(post,index,array) {
    
    var post_date_splitted = post.date.split("-");
    var date = new Date(post_date_splitted[0], (post_date_splitted[1] -1), post_date_splitted[2].split(" ")[0]);
    if(current.date==undefined || date.getTime() != current.date.getTime()) {
      current.date = date;
      nbDay++;
      current.nbPosts = 0;
      res[nbDay]= {date:current.date, posts:[]};
    }

    var repost = isRepost(post.tags, nbDay+1);
    if(repost>-1) {
      if(postToPostDate[repost] == undefined) {
        postToPostDate[repost] = {posts:[]};
      }
      var maxPostForDay = postToPostDate[repost].posts.length;
      postToPostDate[repost].posts[maxPostForDay] =  post;
    } else {
      res[nbDay].posts[current.nbPosts] = post;
      current.nbPosts++;
    }
  });

  return [res, postToPostDate];

}


function formatData(days, postToPostDate) {
  var data =[];
  var nbDay = days.length-1;

  //Let's go through each day parsed... in reverse
  for(var i= 0; i<nbDay; i++) {
    var nbTimelapse=0, nbPosts=0;
    var daily_post = days[nbDay-i].posts;
    var current_data={posts:[], timelapse:[]};
    current_data.date = days[nbDay-i].date;
    current_data.city = city[i];
    if(current_data.city==undefined) current_data.city="undefined";
    
    //If there are any post to post date, add them to daily_post
    if(postToPostDate[i] != undefined) {
      postToPostDate[i].posts.forEach(function(post, index, array) {
        daily_post[daily_post.length] = post;
      });
    }
    daily_post.forEach(function(post, index,array) {
        if(post.type== "photo" && post.tags.indexOf("featured") > -1) {
          current_data.featured = post.photos[0].original_size;
        }
        else if(post.type== "photo") {
          current_data.posts[nbPosts] = {type:"photo", data:{ caption:sanitizeHtml(post.caption, {allowedTags:[]}), photos:post.photos}, id: post.id};
          nbPosts++;
        } else if(post.type == "video" && post.tags.indexOf("timelapse") > -1) {
          var d = {video: post.video_url, preview:post.thumbnail_url};
          current_data.timelapse[nbTimelapse] = d;
          nbTimelapse++;
        } else if(post.type == "video") {
          var d={caption: sanitizeHtml(post.caption,{allowedTags:[]}), video:post.video_url, preview:post.thumbnail_url};
          current_data.posts[nbPosts] = {type:"video", data: d};
          nbPosts++;
        } else if(post.type =="text") {
          current_data.posts[nbPosts] = {type:"text", data: {title: post.title, body:sanitizeHtml(post.body)}};
          nbPosts++;
        } else if(post.type == "quote") {
          current_data.posts[nbPosts] = {type:"quote", data:{from:post.source, text:post.text}};
          nbPosts++;
        } else if(post.type=="link") {
          current_data.posts[nbPosts] = {type:"link", data:getDlLink(post.url)};
          nbPosts++;
        };

    });
  console.log(JSON.stringify(current_data));


      data[i] = current_data;

  }
  return data;
}


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
