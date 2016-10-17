/**
 * Created by Parth on 30-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var moment= require('moment');
var bcrypt= require('bcrypt-nodejs');

exports.checkUserName=function(request,response)
{
    var username= request.param("username");
    var query= "select 1 as result from users where username='"+username+"'";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results);
            if(results[0])
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    },query);
}

exports.checkEmail=function(request,response)
{
    var email= request.param("email");
    var query= "select 1 as result from users where email='"+email+"'";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results);
            if(results[0])
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        }
    },query);
}


exports.registerUser=function(request,response)
{
    var form1=JSON.parse(request.param("formdata"));
    var username=request.param("username");
    var firstName=form1.firstName;
    var lastName=form1.lastName
    var password= bcrypt.hashSync(form1.password);
    var contactNo=request.param("contactNo");
    var address=request.param("address");
    var birthdate=request.param("birthdate");
    var email= form1.email;
    var date = moment().format('YYYY-MM-DD H:mm:ss');
    var query= "insert into users(username,firstname,lastname,password,contactno,address,birthdate,email,lastloggin) values('" +
        ""+username+"','"
        +firstName+"','"
        +lastName+"','"
        +password+"','"
        +contactNo+"','"
        +address+"','"
        +birthdate+"','"
        +email+"','"
        +date+"');";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            console.log(results);
            if(results)
            {

                response.render('index', { title: "Account succesfully created, please sign in to continue" });
            }
            else
            {
                response.send({'statusCode' : 401});
            }
        }
    },query);
}

exports.signOut=function(request,response)
{
    var query= "update ebaydb.users set lastloggin='"+moment().format('YYYY-MM-DD H:mm:ss')+"' where userid="+request.session.user_id+";";
    mysql_handler.execute(function (err,results)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
           request.session.reset();
           response.render('index',{title:"Successfully signed out"});
        }
    },query);
}

