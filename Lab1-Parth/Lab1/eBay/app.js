var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var routes = require('./routes/index');
var users = require('./routes/users');
var signIn=require('./routes/signin');
var signUp=require('./routes/signup');
var advertise=require('./routes/addAdvertisement');
var userAd=require('./routes/Advertisements');
var product=require('./routes/product');
var order=require('./routes/orderDetails');
var profile=require('./routes/profile');
var bidding=require('./routes/bidding');
var app = express();


//configure the sessions with our application
app.use(session({

  cookieName: 'session',
  secret: 'ebay_secret',
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/signIn',signIn.signIn)
app.get('/signOut',signUp.signOut);
app.get('/loadProducts',signIn.loadProducts);
app.post('/checkUserName',signUp.checkUserName);
app.post('/checkEmail',signUp.checkEmail);
app.post('/registerUser',signUp.registerUser);
app.post('/addAdvertise',advertise.addAdvertise);
app.get('/userAdvertisements',userAd.userAdvertisements);
app.get('/productDetails',product.productDetails);
app.post('/addToCart',order.addToCart);
app.get('/loadCart',order.loadCart);
app.post('/addOrderEntry',order.addOrderEntry);
app.post('/addOrderDetails',order.addOrderDetails);
app.post('/emptyCart',order.emptyCart);
app.post('/updateSellers',order.updateSellers);
app.get('/loadOrders',order.loadOrders);
app.post('/loadOrderDetails',order.loadOrderDetails);
app.get('/profile',profile.profile);
app.post('/removeFromCart',order.removeFromCart);
app.post('/updateCartItem',order.updateCartItem);
app.post('/bidForProduct',order.bidForProduct);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;