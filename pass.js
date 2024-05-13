var mysql = require('mysql');

var client = mysql.createClient();

client.host = 'localhost';
client.port = '3306';
client.user = 'root';
client.password = 'vertrigo';
client.database = 'test_db';

client.query('SELECT * FROM "test"', function(error, result, fields){

  if (!error){
    // Working with 'result' ...

    // Closing connection
    client.end();
  }

});
