/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var userAdd=require('./Advertisements');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');


exports.addAdvertise=function(request,response)
{
    var user_id= request.session.user_id;
    var productName= request.param("productName");
    var description= request.param("description");
    var price= request.param("price");
    var bidding =request.param("bidding");
    if(bidding=="on")
    {
        bidding=true;
    }
    else
        bidding=false;

    console.log("bidding:"+bidding);
    var quantity=request.param("quantity");
    var query= "insert into products(product_name,seller_id,description,quantity,price,isBidProduct) values('"
        +productName+"',"+user_id+",'"+description+"',"+quantity+","+price+","+bidding+")";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":added new advertise for selling");
            logger.info(request.session.user_id+":productname="+productName+" ,Quantity="+quantity+", Price="+price);
            console.log("Inserted product");
            console.log(results);
            if(bidding)
            {
                biddingLogger.info("User_id:"+request.session.user_id+"|| added new product for bidding");
                biddingLogger.info(request.session.user_id+":productname="+productName+" ,Quantity="+quantity+", Price="+price);
                console.log("Current timestamp:"+ Date.now()/1000);
                console.log("After 4 days : "+(Date.now()/1000+(96*60*60)));
                var query2="insert into bidproduct(product_id,bidStartTime,bidEndTime,highestBid,isBidEnded) values("+results.insertId

                    + ","+(Date.now()/1000)+","+(Date.now()/1000+(96*60*60))+","+price+",0)";
                mysql_handler.execute(function (err, results) {
                    if (err)
                    {
                        console.log("Error occurred:"+err);
                    }
                    else
                    {

                        console.log(results);
                    }
                }, query2);
            }
            //render back to your advertisements later
            response.render('advertisements');
        }
    },query);
}