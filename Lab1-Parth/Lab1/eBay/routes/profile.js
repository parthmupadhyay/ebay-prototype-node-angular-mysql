/**
 * Created by Parth on 06-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');

exports.profile=function (request,response)
{
    var username=request.param("id");
    if(username==undefined)
    {
        username=request.session.username;
        logger.info(request.session.user_id+ ":Loading user profile");
    }
    else
    {
        logger.info(request.session.user_id+ ":loading profile of user:"+username);
    }
    var query="select * from ebaydb.users where username='"+username+"';";
    mysql_handler.execute(function (err,results)
    {
        if(err)
            console.log("Error occurred:"+err);
        else
        {
            response.render('profile',{result:results});
        }

    },query);

}

