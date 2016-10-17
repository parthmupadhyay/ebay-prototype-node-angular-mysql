/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var bcrypt=require('bcrypt-nodejs');
var logger=require('../routes/usertracking');


var lastloggin;
exports.signIn=function(request,response)
{
    var username= request.param("username");
    var password= request.param("password");
    var query= "select password,lastloggin,userid from users where username='"+username+"'";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else if(results[0])
        {
            console.log(results[0].password);
            if(bcrypt.compareSync(password, results[0].password))
            {
                request.session.username = username;
                request.session.user_id= results[0].userid;
                request.session.lastloggin=results[0].lastloggin;
                lastloggin=results[0].lastloggin;
                ejs.renderFile('./views/product.ejs',function(err,result){
                    if(!err)
                    {
                        logger.info(request.session.user_id+ ":Sign in successful by :"+username);
                        response.end(result);
                    }
                    else
                    {

                        response.end('An error occurred');
                        console.log(err);
                    }
                });
            }
            else
            {
                logger.info("failed signin attempt for user :"+username);
                response.render("index",{title:"Invalid username/password"});
            }

        }
        else
        {
            logger.info("failed signin attempt for user :"+username);
            response.render("index",{title:"Invalid username/password"});
        }
    },query);
}

exports.loadProducts=function(request,response)
{
    if(request.session.user_id)
    {
        console.log(request.session.user_id);
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var query = "select * from products where seller_id<>" + user_id +" and quantity>0 order by product_id desc";
        mysql_handler.execute(function (err, results) {
            if (err) {
                console.log("Error occurred:"+err);
            }
            else
            {
               // response.render('home', {user_id:user_id,user: username, lastloggin: lastloggin, data: results, userdata: "",product:"",message:""});
                logger.info("redirecting user to products page");
                response.send({"statusCode":200,"products":results});
            }
        }, query);
    }
    else
    {
        response.send({"statusCode":401});
    }

}
