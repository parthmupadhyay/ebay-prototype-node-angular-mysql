/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');

exports.productDetails=function (request,response)
{
    if(request.session.username) {
        var product_id = request.param("productID");
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var user_id = request.session.user_id;
        var query = "SELECT p.product_id,p.product_name,p.quantity,p.description,p.price,p.seller_id,p.isBidProduct,u.username,u.address " +
            "FROM ebaydb.products p,ebaydb.users u where p.seller_id=u.userid and product_id=" + product_id;
        mysql_handler.execute(function (err, results) {
            if (err) {
                console.log("Error occurred:"+err);
            }
            else {
                console.log(results);
                //response.render('home', {user_id:user_id,user:username , lastloggin: lastloggin, userdata: "", data: "",product:results,message:""});
                logger.info("User click on product :"+results[0].product_name);
                logger.info("Loading product details of "+results[0].product_name);
                response.render('productDetail', {productDetail: results});

            }
        }, query);
    }
    else
    {
        response.render('index',{title:"Sign in to continue"});
    }
}