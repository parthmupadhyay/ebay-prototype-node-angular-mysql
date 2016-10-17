/**
 * Created by Parth on 11-10-2016.
 */
var mysql=require('./mysql-handler');
var moment=require('moment');
var logger= require('../routes/biddingTracking');

setInterval(function (request,response)
{
    var query="select * from bidProduct where isBidEnded=0";
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            if(results)
            {
                for(var i=0;i<results.length;i++)
                {
                    if((Date.now()/1000)>results[i].bidEndTime)
                    {
                        console.log("Bid ended for Product:"+results[i].product_id);
                        closeBid(results[i].bid_id);
                        addOrderToAccount(results[i].bid_id,results[i].product_id);

                    }
                    else
                    {
                        console.log("Bid still under progress for: "+results[i].product_id);
                    }
                }
            }
        }
    },query);
},500000);

function closeBid(bid_id)
{
    var query="update bidProduct set isBidEnded=1 where bid_id="+bid_id;
    mysql.execute(function (err,results)
    {
           if(err)
           {
               console.log("Error occurred:"+err);
           }
           else
           {logger.info(request.session.user_id+ ":Bid ended for "+bid_id);
               console.log("isBidEnded updated");
           }
    },query);
}

function updateQuantity(product_id)
{
    var query="update products set quantity=0 where product_id="+product_id;
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info(request.session.user_id+ ":Updating seller quantities for product"+product_id);
            console.log("quantity updated");
        }
    },query);
}

function addOrderToAccount(bid_id,product_id)
{
    var query="select * from ebaydb.bid_detail where bid_id="+bid_id+" having max(bid_amount)";
    mysql.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results[0]);

            if(results[0])
            {
                var date = moment().format('YYYY-MM-DD');
                var addOrderQuery = "insert into ebaydb.order(user_id,total,order_date) values(" + results[0].bidder_id
                    + "," + results[0].bid_amount + ",'" + date + "');";
                mysql.execute(function (err, results2) {
                    if (err)
                        console.log("Error occurred:"+err);
                    else
                    {
                        if (results2)
                        {
                            addOrderDetails(results2.insertId,product_id);
                        }
                    }
                }, addOrderQuery);
            }
        }
    },query);
}

function addOrderDetails(order_id,product_id)
{
    var query="select b.bid_id,p.product_id,p.product_name,p.price from ebaydb.bidproduct b ,ebaydb.products p where b.product_id="+product_id+" and b.product_id=p.product_id;";
    mysql.execute(function (err,results)
    {
        if(err)
            console.log("Error occurred:"+err);
        else
        {
            var query2="insert into ebaydb.order_detail" +
                "(order_id,product_id,product_name,quantity,price) values(" +
                order_id+ ","+product_id+",'"+results[0].product_name+"',"+1+","+results[0].price+")";
            mysql.execute(function (err,results2)
            {
                if(err)
                    console.log("Error occurred:"+err);
                else
                {
                    updateQuantity(product_id);
                }
            },query2);
        }
    },query);
}