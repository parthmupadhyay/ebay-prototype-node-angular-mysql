var ejs= require('ejs');
var mysql = require('mysql');


/*
//Without Connection pooling
function getConnection(){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'ebaydb',
        port	 : 3306
    });
    return connection;
}*/


//self implemented connection pool
var pool = [];
var count = 0;
var queue = [];
var queueasMap = new Map();
var poolSize = 200;
var queueSize = 100;
function createConnectionPool() {

    for (var i = 0; i < poolSize; i++) {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'ebaydb'
        });
        pool.push(connection);

    }
}

function getConnection(callback) {

    console.log("connection is requested");

    if (isConnectionFree()) {

        console.log("connection is free");
        callback(pool.pop());

    } else {

        console.log("connection is not free");
        if (isQueueFree()) {

            console.log('in the queue');
            queue.push(count);
            queueasMap.set(count, false);
            var temp = count;
            count++;


        } else {

            console.log('connection is refused');
            return null;
        }
    }
}


function releaseConnection(connection) {

    pool.push(connection);
    console.log('connection is released');
    queueasMap.set(queue.pop(), true);
    queue.shift();

}

function isConnectionFree() {

    if (pool.length <= 0)
        return false;
    else
        return true;

}

function isQueueFree() {

    if (queue.length >= qSize)
        return false;
    else
        return true;
}


exports.execute=function(callback,sqlQuery)
{
    console.log("\nSQL Query::"+sqlQuery);

    getConnection(function (err,connection)
    {
        if(err)
        {
            throw err;
        }
        else
        {
            connection.query(sqlQuery, function(error, result) {
                if(error){
                    console.log("ERROR: " + error.message);
                }
                else
                {	// return err or result
                    console.log("DB Results:"+result);
                    callback(err, result);
                }
            });
            connection.release();
        }
    });

}

createConnectionPool();
