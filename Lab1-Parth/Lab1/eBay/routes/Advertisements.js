/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');

exports.userAdvertisements=function(request, response)
{
    if(request.session.username) {
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var query = "select * from products where seller_id=" + user_id;
        mysql_handler.execute(function (err, results) {
            if (err) {
                console.log("Error occurred:"+err);
            }
            else
            {
                //response.render('home', {user_id:user_id,user: username, lastloggin: lastloggin, userdata: results, data: "",product:"",message:""});
                if(results)
                {
                    logger.info(request.session.user_id+ ":loading user advertisement");
                    response.send({"statusCode":200,"userAds":results});
                }
                else
                {
                    response.send({"statusCode":401});
                }

            }
        }, query);
    }
    else
    {
        response.render('index',{title:"Session expired, please sign in to continue"});
    }
}