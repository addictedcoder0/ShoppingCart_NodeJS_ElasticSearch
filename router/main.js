var router = require('express').Router();

router.get('/',function(req,res){
  // var name = 'rudra';
  // res.json('my name is  '+name);
res.render('main/home');  // no need to put 'home.ejs'  and remember the folder name must be 'views'

});

router.get('/about',function(req,res){
  res.render('main/about');
});

module.exports = router;
