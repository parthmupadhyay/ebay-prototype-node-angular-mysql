/**
 * Created by Parth on 26-09-2016.
 */
var ejs = require("ejs");

exports.add=function (request,response)
{
    var number1=request.param('num1');
    var number2=request.param('num2');
    console.log("in add method:"+number1);
    var data=Number(number1)+Number(number2);
    var json_response;
    if(isNaN(data))
    {
        json_response={"statusCode" : 401,"data":null};
        response.send(json_response);
    }
    else
    {
        json_response={"statusCode" : 200,"data":data};
        response.send(json_response);
    }
}

exports.multiply=function (request,response)
{
    var number1=request.param('num1');
    var number2=request.param('num2');
    var data=number1*number2;
    var json_response;
    if(isNaN(data))
    {
        json_response={"statusCode" : 401,"data":null};
        response.send(json_response);
    }
    else
    {
        json_response={"statusCode" : 200,"data":data};
        response.send(json_response);
    }
}

exports.subtract=function (request,response)
{
    var number1=request.param('num1');
    var number2=request.param('num2');
    var data=number1-number2;
    var json_response;
    if(isNaN(data))
    {
        json_response={"statusCode" : 401,"data":null};
        response.send(json_response);
    }
    else
    {
        json_response={"statusCode" : 200,"data":data};
        response.send(json_response);
    }
}

exports.divide=function (request,response)
{
    var number1=request.param('num1');
    var number2=request.param('num2');
    var data=number1/number2;
    console.log(data);
    var json_response;
    if(isNaN(data))
    {
        json_response={"statusCode" : 401,"data":null};
        response.send(json_response);
    }
    else if(data==Infinity)
    {
        json_response={"statusCode" : 402};
        response.send(json_response);
    }
    else
    {
        json_response={"statusCode" : 200,"data":data};
        response.send(json_response);
    }
}