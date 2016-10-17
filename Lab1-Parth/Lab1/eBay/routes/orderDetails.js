var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var moment= require('moment');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');

exports.addOrderEntry=function (request,response)
{
    var user_id=request.session.user_id;
    var total=request.param("total");
    var date = moment().format('YYYY-MM-DD');
    var addOrderQuery="insert into ebaydb.order(user_id,total,order_date) values("+user_id+","+total+",'"+date+"');";
    mysql_handler.execute(function (err,results)
    {
        if(err)
            throw err;
        else
        {
            if(results)
            {
                logger.info(request.session.user_id+ ":Creating new order for "+request.session.username);
                response.send({"statusCode":200,"order_id":results.insertId});
                response.end();
            }
            else
            {
                response.send({"statusCode":401});
                response.end();
            }
        }
    },addOrderQuery);
}

exports.addOrderDetails=function(request,response)
{
    var order_id=request.param("order_id");
    var cartData=request.param("cartData");
    var flag=true;
    for(var i=0;i<cartData.length;i++)
    {
        var product_id=cartData[i].product_id;
        var product_name=cartData[i].product_name;
        var qty=cartData[i].quantity;
        var price=cartData[i].price;

        var query="insert into ebaydb.order_detail" +
            "(order_id,product_id,product_name,quantity,price) values(" +
           order_id+ ","+product_id+",'"+product_name+"',"+qty+","+price+")";
        mysql_handler.execute(function (err,results)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(results)
                {
                    //response.send({"statusCode":200});
                    //response.end();
                    console.log(results);
                }
                else
                {
                    //response.send({"statusCode":401});
                    //response.end();
                    console.log("failed");
                    flag=false;
                }
            }
        },query);
    }
    if(flag)
         response.send({"statusCode":200});
    else
        response.send({"statusCode":401});
}

exports.updateSellers=function (request,response)
{
    var cartData=request.param("cartData");
    var flag=true;
    for(var i=0;i<cartData.length;i++)
    {
        var query="update products set quantity=quantity-"+cartData[i].quantity+" where product_id="+cartData[i].product_id+";";
        logger.info(request.session.user_id+ ":Updating seller quantities for product"+cartData[i].product_id);
        mysql_handler.execute(function (err,result)
        {
            if(err)
            {
                throw err;
            }
            else
            {
                if(result)
                {

                    console.log(result);
                }
                else
                {
                    flag=false;
                }
            }
        },query);
    }
    if(flag)
        response.send({"statusCode":200});
    else
        response.send({"statusCode":401});

}

exports.emptyCart=function (request,response)
{
    var user_id=request.session.user_id;
    var query="delete from cart where user_id="+user_id+";";
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            throw err;
        }
        else
        {
            if(result)
            {
                logger.info(request.session.user_id+ ":Cart emptied for user "+request.session.username);
                response.send({"statusCode":200});
            }
            else
            {
                response.send({"statusCode":401});
            }
        }
    },query);
}

exports.loadOrders=function (request,response)
{
    var user_id=request.session.user_id;
    var query="select order_id,order_date from ebaydb.order where user_id="+user_id+" order by order_date desc;";

    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            if(result)
            {
                response.send({"statusCode":200,"orders":result});

            }
            else
            {
                response.send({"statusCode":401});
            }
        }
    },query);
}


exports.loadOrderDetails=function (request,response)
{
    var orders=request.param("orders");
    var flag=true;
    var orderList= [];

    var temp=0;
    logger.info(request.session.user_id+ ":"+request.session.username+" clicked on view orders, loading orders");
    for(var i=0;i<orders.length;i++)
    {

        var order_id=orders[i].order_id;
        var order_date=orders[i].order_date;
        var query="select od.order_id,od.product_name,od.price,od.quantity,o.order_date from ebaydb.order_detail od,ebaydb.order o where od.order_id="+order_id+" and o.order_id=od.order_id;";
        mysql_handler.execute(function (err,results)
        {
            temp++;
            if(err)
                console.log("Error occurred:"+err);
            else
            {
                if(results)
                {
                    console.log(results);
                    //results.order_date=order_date;
                    for(var i=0;i<results.length;i++)
                    {
                        results[i].order_date=new Date(results[i].order_date).toDateString();

                        console.log(results[i].order_date);
                    }
                    orderList.push(results);
                }
            }
        },query);

    }
    setTimeout(function ()
    {
        if(temp==orders.length)
        {
            response.send({"statusCode":200,"orderDetails":orderList});
        }
    },300);

}

exports.addToCart=function(request,response)
{
    var user_id = request.session.user_id;
    var username = request.session.username;
    var lastloggin = request.session.lastloggin;
    var product_id=request.param("product_id");
    var product_name=request.param("product_name");
    var qty=request.param("quantity");
    var price=request.param("price");
    var seller_id=request.param("seller_id");
    var query = "insert into " +
        "cart(product_id,user_id,product_name,quantity,price,seller_id) " +
        "values("+product_id+","+user_id+",'"+product_name+"',"+qty+","+price+","+seller_id+");"
    mysql_handler.execute(function (err, results) {
        if (err)
        {
            console.log("Error occurred:"+err);
        }
        else if(results)
        {
            console.log(results);
            logger.info(request.session.user_id+ ":"+username+" added "+qty+" "+product_name+" into cart");
            response.send({'statusCode' : 200});

        }
        else
        {
            response.send({'statusCode' : 401});
        }
    }, query);
}

exports.loadCart=function (request,response)
{
    var query="select c.cart_id,c.user_id,c.product_id,c.quantity,c.price,c.product_name,p.quantity as prodQuantity,u.username from ebaydb.cart c,ebaydb.products p,ebaydb.users u where c.product_id=p.product_id and p.seller_id=u.userid and c.user_id="+request.session.user_id;
    mysql_handler.execute(function (err, results) {
        if (err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":loading user cart");
            response.send({'statusCode' : 200,'cartData':results});


        }
    }, query);
}

exports.removeFromCart=function(request,response)
{
    var cart_id=request.param("cart_id");
    var query="delete from cart where cart_id="+cart_id+";";
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
                logger.info(request.session.user_id+ ":"+request.session.username +" removed product with cart id: "+cart_id);
                response.send({"statusCode":200});

        }
    },query);
}

exports.updateCartItem=function(request,response)
{
    var cart_id=request.param("cart_id");
    var quantity=request.param("quantity")
    var query="update cart set quantity ="+quantity+" where cart_id="+cart_id+";";
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":"+request.session.username +" updated product quantity="+quantity+", cart id="+cart_id);
            response.send({"statusCode":200});

        }
    },query);
}

exports.bidForProduct=function (request,response)
{
    var bidAmount= request.param("bidAmount");
    var product_id=request.param("product_id");
    var user_id=request.session.user_id;
    var query1="select bid_id from bidProduct where product_id="+product_id;
    biddingLogger.info("User ID:"+user_id+"||Bidding for product:"+product_id+"||BidAmount:"+bidAmount);
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            var query2="insert into bid_detail(bid_id,bid_amount,bidder_id,bid_time) values("+result[0].bid_id+","+bidAmount+","+user_id+","+Date.now()/1000+")";
            mysql_handler.execute(function (err,result1)
            {
                if(err)
                {
                    console.log("Error occurred:"+err);
                }
                else
                {
                    logger.info(request.session.user_id+ ":"+request.session.name+" bidded "+bidAmount+" for product="+product_id);
                    response.send({"statusCode":200});
                    updatePrice(bidAmount,product_id);
                    biddingLogger.info("User ID:"+user_id+"||Current Price for Product:"+product_id+" updated to:"+bidAmount);
                }
            },query2);

        }
    },query1);


}

function updatePrice(bidAmount,product_id)
{
    var query="update products set price ="+bidAmount+" where product_id="+product_id+";";
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info("Current price for product="+product_id+" changed to "+bidAmount);
            console.log("Price Updated");

        }
    },query);
}