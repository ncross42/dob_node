var mysql = require('promise-mysql');

pool = mysql.createPool({
	host: 'localhost',
	user: 'test',
	password: 'xptmxm',
	database: 'test',
	connectionLimit: 5
});
  
module.exports = pool;

// var connection;
// mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'test'
// }).then(function(conn){
//     connection = conn;
//     return connection.query('select * from tablethatdoesnotexist');
// }).then(function(){
//     var result = connection.query('select * from hobbits');
//     connection.end();
//     return result;
// }).catch(function(error){
//     if (connection && connection.end) connection.end();
//     //logs out the error
//     console.log(error);
// });
// module.exports = connection;
