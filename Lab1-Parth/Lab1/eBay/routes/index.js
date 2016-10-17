var express = require('express');
var router = express.Router();
var url  = require('url');
/* GET home page. */
router.get('/', function(req, res, next)
{
  if(req.session.username)
  {
    res.render('product', {  });
  }
  else
  res.render('index', { title: '' });

});

router.get('/addAdvertisement', function(req, res, next) {
  res.render('addAdvertisement');
});

router.get('/product', function(req, res, next) {
  res.render('product', {  });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', {  });
});

router.get('/orderHistory', function(req, res, next) {
  res.render('order-history', { title: 'Express' });
});

router.get('/advertisements', function(req, res, next) {
  res.render('advertisements', {  });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', {  });
});

router.get('/processingPayment', function(req, res, next) {
  res.render('processingPayment', {  });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', {  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {  });
});

router.get('/user-details', function(req, res, next) {
  res.render('user-details', {  });
});

module.exports = router;

