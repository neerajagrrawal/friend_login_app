const mysql = require('mysql') ;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'neeraj@1234',
  database : 'www'
}) ;

module.exports = connection ;
