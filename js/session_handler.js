var cookieParser = require('cookie-parser');

 
var session = require('express-session');

//var MSSQLStore = require('connect-mssql')(session);
// var app = module.exports = express();
//var session = require('express-session');


var MSSQLStore = require('express-mysql-session')(session);
 var mssql = require('mssql'); 

module.exports = {
	createStorage: function () { 



var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
	
};
 
//var sessionStore = new MySQLStore(options);
  return new MSSQLStore(options);


 }
}
