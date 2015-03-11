var express = require('express');
var router = express.Router();
var tumblr = require('tumblr');
var oauth = {
  consumer_key: '45EWPfOgq6rRvQCAGlno5Vr4EXcVlOqpJO7xEUyueD264i8pU9',
  consumer_secret: 'fyGnV64yEa4Itf2ukcppDll2jYgf24cEsh4KS2GRHlYSf4NgOk',
};

var blog = new tumblr.Blog('equipe.tumblr.com', oauth);


router.get('/', function(req, res, next) {
  blog.text({}, function(error, response) {
    if(error) throw new Error(error);
    
    var days = [];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() +1;
    var yyyy = today.getFullYear();
    var todays_post = response.posts;
    var last_date=undefined;
    var nbDay=0;
    var nbPostsForCurrentDay=0;
    todays_post.forEach(function(post,index,array) {
      
      var post_date = post.date.split("-");
      var date = new Date(post_date[0], (post_date[1] -1), post_date[2].split(" ")[0]);
      if(date != last_date || last_date == undefined) {
        last_date = date;
        nbDay++;
        nbPostsForCurrentDay=0;
        var tmp = {date:last_date, posts:[]};
        days[nbDay]= tmp;
      }
      days[nbDay].posts[nbPostsForCurrentDay] = post;
      nbPostsForCurrentDay++;
    });
    
    console.log(days);
  
  });
  
  
  
  
  res.send("Hello");
});

module.exports = router;
