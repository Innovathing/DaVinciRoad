var express = require('express');
var router = express.Router();
var tumblr = require('tumblr');
var oauth = {
  consumer_key: '45EWPfOgq6rRvQCAGlno5Vr4EXcVlOqpJO7xEUyueD264i8pU9',
  consumer_secret: 'fyGnV64yEa4Itf2ukcppDll2jYgf24cEsh4KS2GRHlYSf4NgOk',
};

var blog = new tumblr.Blog('equipe.tumblr.com', oauth);

router.get('/', function(req, res, next) {
  blog.text({limit: 2}, function(error, response) {
    if(error) throw new Error(error);
    console.log(response.posts);
  });
  
  res.send("Hello");
});

module.exports = router;
