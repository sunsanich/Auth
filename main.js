


const express = require("express");
const hbs = require("hbs");
 
//var flash = require('connect-flash'); 
 
const app = express();
var port = 8080; 

var cookieParser = require('cookie-parser'); 
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


const mysql = require("mysql");
const crypto = require('crypto');
const expressHbs = require("express-handlebars");


var nodemailer = require('nodemailer');
var http = require('http');
var url = require('url');
//console.log("Creating Transport")
//var moment =require('moment');
//const expressip = require('express-ip');

var sessionHandler = require('./js/session_handler'); 
var store = sessionHandler.createStorage(); 


 //var mailer = require("nodemailer"); 
 
 


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(express.json());

app.use(cookieParser());

//var app = module.exports = express();
//////////////////////////////////
///////////////////////////////////

const jsonParser = express.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});
 

app.use(session({

 key: 'session_cookie_name',
    
    store:  store,
    resave: false,
	secret: 'supersecret' ,
	saveUninitialized: true
    
})); 

 



 
//flash message middleware
app.use((req, res, next)=>{
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

 
 app.use((req, res, next) => {
  // get user from cookie, database, etc.
 
 res.locals.username = req.session.username;
 
 next();
  
});


 
 
hbs.registerHelper("getTime", function(){
     
    var myDate = new Date();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var second = myDate.getSeconds();
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return "Текущее время: " + hour + ":" + minute + ":" + second;
});
 
 
 
 
 
app.set("view engine", "hbs");
 
 hbs.registerPartials(__dirname + "/views/partials");

 app.set("view options", {layout: "layouts/layout"});
 
//var flash = require('express-flash-messages')

 
 /////////////////////////////////////////
 


/////////////////////

 
app.get("/home", function(req, res){



console.log(req.session.username)

 res.render('home.hbs', { username: req.session.username });  
//request.flash('test')
// res.render("home.hbs");
	//request.flash('error', 'ThFLASHiion.')
	
	
});



app.get('/register', function (req, res) {
console.log(res.locals.username)
console.log(res.locals.message)
//console.log(req.session.username)
  res.render("register.hbs");
});






app.get('/login', function (req, res) {

  res.render("login.hbs");
});





app.get('/unverifyEmail',loadUser, function (req, res) {
	


res.render('unverifyEmail.hbs');  


});



app.post('/sendVerifyEmail',loadUser, function (req, res) {
	
//////
///////////////piwem registraciu//////
if(req.session.mailV === "VERIFY"){

 req.session.message = {
      type: 'suc',
      intro: 'suc',
      message: 'mail most verify'
    } 
	
res.redirect('/check');
	

	} else {


 var rand = randWDclassic(12);
console.log("rand-" + rand);

 function randWDclassic(n){  // [ 3 ] random words and digits by the wocabulary
  var s ='', abd ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
} //such as "46c17fkfpl"
 

var idMail = req.session.mailV;
var username = req.session.username;
var email ='';

console.log("idMail"+idMail);
console.log("rand-" + rand);
console.log("username" + username);




var s =  'SELECT email FROM accounts WHERE mailV = ? and username= ? LIMIT 1';
var dat = [idMail, username];
 
    const connectionTake = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});


	connectionTake.query(s, dat, function(err, results) {
    if(err) console.log(err)
		
	    if (results.length>0){
    	
		console.log("data email take"+results[0].email);
		email = results[0].email;


		
 var sendVer = `UPDATE accounts SET mailV=? WHERE email=? LIMIT 1`;
 var dat = [rand, email];
 
    const connectionSend = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});

	connectionSend.query(sendVer, dat, function(err, results) {
    if(err) console.log(err)
   	console.log("Данные добавлены-"+rand)
	});
	
	req.session.mailV = rand;
	console.log("req.session.mailV-"+req.session.mailV)
    
	
	///////////////////////
	///////////////////
	////////////////
	
	 	host = req.get('host');
link = "http://" + host + "/api/users/mailverify?id=" + rand;
console.log(" link -"+ link);

const output = `<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>  
  <li>Name: </li>
  <li>Company: </li>
  <li>Email:  </li>
  <li>Phone: </li>
</ul>
Hello <br> Please Click on the link to verify your email.<br>
  <p><a href=`+ link +`><img src="data:image/jpeg;base64,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"
  width="250" 
   height="90" alt="verify"><br>Click here to verify</a></p>
<h3>Message</h3>
<p>${req.body.message}</p>
<h3>Headers</h3>
<ul>  ''
  <li>cookie: ${req.headers.cookie}</li>
  <li>user-agent: ${req.headers["user-agent"]}</li>
  <li>referer: ${req.headers["referer"]}</li>
  <li>IP: ${req.ip}</li>
</ul>
  `;





var transporter = nodemailer.createTransport({
     service: "mail",
     host: 'smtp.mail.ru',
      port: 465,
    
	auth: {
        user: "feodor_murr@mail.ru",
        pass: "MtYxZXpeEEQGVa6tuvvW"
    }
});


//var outMail ="pord0001@meta.ua";
var mailOptions = {
    from: "feodor_murr@mail.ru",
    to: email,
    subject: "Send Email Using Node.js",
    text: "Node.js New world for me",
     html:   output   // html body"Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
}
console.log("Sending mail")

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response)
    }
 });
 
 


	///////////////////
	//////////////////
	/////////////////


    connectionSend.end();
    
 req.session.message = {
      type: 'suc',
      intro: 'suc',
      message: 'Verify mail!!.'
    } 
	
	res.redirect("/home")
 
	  }else{ 
	  
	         req.session.message = {
             type: 'err',
             intro: 'err',
             message: 'bad zapros'
             } 
	  
	  res.redirect("/login")}; /////esli ne nawel MAIL
	
	
		
    });

connectionTake.end();

////////////esli ewe ne verify posle otpreavki 
	
}//////if verify


});








app.use("/contact", function(request, response){
     
	 Visible =true;
    response.render("contact.hbs", {
        title: "Мои контакты",
        emailsVisible: Visible,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
});



/*
app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
*/


//////////////////////

////kondrol dostup


/*



  if (req.session.user_id) {
    User.findById(req.session.user_id, function(user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else {
    res.redirect('/sessions/new');
  }
}

app.get('/documents.:format?', loadUser, function(req, res) {
  // ...
});



*/





//////////////////


function cryptoPas(e){
var pas = crypto.createHmac('sha256',e)
                   .update('I love cupcakes')
                   .digest('hex');
console.log("abcdefg-sha256="+pas);
 return pas
}

/////////////////////////
////////////////////////


app.get('/', function (req, res) {

//var t = cryptoPas("abcdefg")
//console.log("abcdefg-sha256ttt="+t);

res.sendFile(path.join(__dirname, 'index.html'));

 });



app.get('/about', function (req, res) {


res.sendFile(path.join(__dirname, '/public/about.html'));
});




/*
app.get('/register', function (req, res) {
res.sendFile(path.join(__dirname, '/public/register.html'));
});
*/


 var erro = 0;


app.post('/register', urlencodedParser, function (request, response) {
  

	
  
 if(!request.body) return response.sendStatus(400);


/*
request.session.message = {
      type: 'success',
      intro: 'You are now registered!!!! ',
      message: 'Please log in!!!.'
    }
*/
	
  //  response.send(`${request.body.email} - ${request.body.userName}`);
  
 //req.flash('success', 'Rendering index...');
 
	
    var email = request.body.email;
	var username = request.body.usrname;
	var pass = request.body.passwrd;
	var conf = request.body.confirmationPasswrd;



let valid = true;
 
  let err	= 0;
 let  error = 0;
		if ( conf!=pass )
        {
		    //    alert ( "confirmPass and pass dont =" );
                valid = false;
				error = 4;
        }
		
		if ( pass.length <7 )
        {
		     //   alert ( "Pass must >6 simbols" );
                valid = false;
				error = 3;
        } 
		
		if (username.length <6 )
        {
		 //       alert ( "Name must >6 simbols" );
                valid = false;
				error = 2;
        }




//preg_match('/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u', $item)	
//str.search('a') != -1
  
  
//var r = email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
//if (!r){
//	alert('Уверены что email введен верно?')
//	return false
//}
		
email = email.replace( /,/g, "." )
	
var r = email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
var ru = email.match(/^[0-9а-я-\.]+\@[0-9а-я-]{2,}\.[а-я]{2,}$/i);

//alert("t"+r);
//alert("ru"+ru);

if ((!r) && (!ru)){
	
	valid = false;
	error = 1;

	
}

	
         switch (error) {
  case 1:
 
  console.log("Email incorrect");
//request.flash('message', 'Data entered is not valid. Please try again.')
// req.flash('success', 'Registration successfully, go ahead and login.')
 request.session.message = {
      type: 'success',
      intro: error,
      message: 'Email incorrect'
    } 
	

	
	
	//isAuthenticated
   
   response.redirect("/register");
 // request.session.message = "" ;
// response.redirect("api.sypexgeo.net/json")
  //alert ( "Email incorrect" );
    break;
	
	
  case 2:
    console.log("Name must >5 simbols");
	
 request.session.message = {
      type: 'success',
      intro: error,
      message: 'Name must >5 simbols'
    } 

	
  response.redirect("/register");
 // request.session.message = "" ;
  //  alert ( "Name must >5 simbols" );
    break;
	
   case 3:
   console.log("Pass must >6 simbols");
   
   request.session.message = {
      type: 'success',
      intro: error,
      message: 'Pass must >6 simbols'
    } 
   
   
  response.redirect("/register");
//  request.session.message = "" ;
 //  alert ( "Pass must >6 simbols" );
    break;
	 case 4:
  console.log("confirmPass and pass dont =");
   
    request.session.message = {
      type: 'success',
      intro: error,
      message: 'confirmPass and pass dont ='
    } 
  
    
   response.redirect("/register");
  
//  request.session.message = "" ;
  
  //   alert ( "confirmPass and pass dont =" );
    break;
 
// default:
 //   alert( "Нет таких значений" );
}
		 
	



	
	

 
 //////////esli udovletvoriaet forma///////registr
////net owibok togda proveriaem esti li eje mylo ili net
 
 
 
 if (!!valid){
  



//var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

console.log(request.ip+'Your IP is ');

	const s =  'SELECT COUNT(*) AS cnt FROM accounts WHERE email= ? LIMIT 1';
const fil = [email];

const connectio = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});


connectio.query(s, fil, function(err, results) {
    if(err) console.log(err)
		
	
	/////////zapros na sovpadenie mala
if(results[0].cnt > 0){ 
 	
 //////////////esli zan9t email//////////////////
//////////////////////////////////////
 
		   
		  console.log("uje zaniat mail!!"+results);
    request.session.message = {
      type: 'success',
      intro: 'uje zaniat mail!!',
      message: 'uje zaniat mail!!.'
    } 



response.redirect('/register');
  
  

	  
	  }else{ 
		

		
 //////////////esli ne zan9t email//////////////////
//////////////////////////////////////
  console.log(">>>"+results);
 ////
pass = cryptoPas(pass);
//////
 
 
 var rand = randWDclassic(12);
console.log("rand-" + rand);


 function randWDclassic(n){  // [ 3 ] random words and digits by the wocabulary
  var s ='', abd ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
} //such as "46c17fkfpl"
 
 
 ///////////////piwem registraciu//////
 
 
  const user = [email, username, pass, rand];
   const sql = "INSERT INTO accounts(email,username, password, mailV) VALUES(?,?,?,?)";
 
   const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});



	connection.query(sql, user, function(err, results) {
    if(err) console.log(err)
   		console.log("Данные добавлены")
    });
	
	

 connection.end();	

 	host = request.get('host');
link = "http://" + host + "/api/users/mailverify?id=" + rand;
console.log(" link -"+ link);



const output = `<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>  
  <li>Name: </li>
  <li>Company: </li>
  <li>Email:  </li>
  <li>Phone: </li>
</ul>
Hello <br> Please Click on the link to verify your email.<br>
  <p><a href=`+ link +`><img src="data:image/jpeg;base64,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"
  width="250" 
   height="90" alt="verify"><br>Click here to verify!!!</a></p>


<h3>Message</h3>
<p>${request.body.message}</p>
<h3>Headers</h3>
<ul>  ''
  <li>cookie: ${request.headers.cookie}</li>
  <li>user-agent: ${request.headers["user-agent"]}</li>
  <li>referer: ${request.headers["referer"]}</li>
  <li>IP: ${request.ip}</li>
</ul>
  `;
  
  
  

var transporter = nodemailer.createTransport({
     service: "mail",
     host: 'smtp.mail.ru',
      port: 465,
    
	auth: {
        user: "feodor_murr@mail.ru",
        pass: "MtYxZXpeEEQGVa6tuvvW"
    }
});

//var outMail ="pord0001@meta.ua";
var mailOptions = {
    from: "feodor_murr@mail.ru",
    to: email,
    subject: "Send Email Using Node.js",
    text: "Node.js New world for me",
     html:   output   // html body"Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
}
console.log("Sending mail")


transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response)
    }
 });
 
 
 
 

 request.session.message = {
      type: 'success',
      intro: 'successsuccesssuccess',
      message: 'success mail!!.'
    } 



response.redirect('/login');






 
	  }


});

connectio.end(); 






 
	 
  }; ////  if valid
 

////////////






//response.send(request.body);	
//	response.json(request.body); // отправляем пришедший ответ обратно
//response.redirect('/home');
// response.render("home.hbs");

});





app.get('/api/users/mailverify', function (req, res) {
	

let idMail = req.query.id;
 
 
 if (idMail.length==12){

	console.log('mailverifySUCCES='+idMail); 


var sq = `UPDATE accounts SET mailV=? WHERE mailV=? LIMIT 1`;

var dat = ["VERIFY", idMail];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});
connection.query(sq, dat, function(err, results) {
    if(err) console.log(err);
    console.log(results.affectedRows);
        if	(results.affectedRows>0){
	   
	    req.session.message = {
        type: 'succ',
        intro: 'succ',
        message: ' mail has been verified!!.'
        } 
   req.session.mailV = 'VERIFY';
        res.redirect('/home');
	
        }else{ 
                req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'bad email verify link is bad!!.'
                } 
                  res.redirect('/unverifyEmail');  


        	 }
		
});
connection.end(); 

 
 };
 
 
 // res.send("<h1>Информация</h1><p>" + idMail +"</p>");


});

















app.post('/login',  urlencodedParser, function (req, res) { 


console.log(req.body)
var Logg = req.body.usrname;
var Pass = req.body.passwrd;

if (Logg && Pass ){

var passLogin = cryptoPas(Pass);
console.log(passLogin+'-passLogin');


		var s =  'SELECT username, mailV FROM accounts WHERE email= ? and password= ? LIMIT 1';
        var fil = [Logg,passLogin];

const connectLog = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});


var foundUser


connectLog.query(s, fil, function(err, results) {
    if(err) console.log(err)
	
     console.log("result-"+results);


if (results.length>0) {
	 console.log("results-"+results[0].username);
     console.log("mailV"+results[0].mailV);
	   
	 req.session.username = results[0].username;
     req.session.mailV = results[0].mailV;

 console.log("Login succeeded: ", req.session.username);
 // res.send('login successful:'   + req.session.id + '; user: ' + req.session.username); 

  if (results[0].mailV === "VERIFY")
     { 
    // res.redirect('/unverifyEmail');
	res.redirect('/check');
    }else{
	 

	res.redirect('/unverifyEmail'); }

 } else {
  console.log("Login failed: ", req.body.username) 

                req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'bad email or Pass.'
                } 

res.redirect('/login');
 // res.status(401).send('Login error'); 
}
		

		});

 connectLog.end();


} else {
	
	  req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'bad email or  pass'
                } 
				
	res.redirect('/login');			
}

});





app.get('/forgot', function (req, res) {
res.render("forgot.hbs");
});


//////////////
/////////////////////

app.post('/forgot',urlencodedParser, function (req, res) {
console.log('forgot');


var rand = randWDclassic(6);
console.log("rand-" + rand);

 function randWDclassic(n){  // [ 3 ] random words and digits by the wocabulary
  var s ='', abd ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
} //such as "46c17fkfpl"
 
var email = req.body.email


 if (email.length>6){

	 


var sq = `UPDATE accounts SET recPas=? WHERE email=? LIMIT 1`;

var dat = [rand, email];

const connectionSave = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});
connectionSave.query(sq, dat, function(err, results) {
    if(err) console.log(err);
    console.log("UProws"+results.affectedRows);
        if	(results.affectedRows>0){
	   
	   
	   
	   
	   
	   
	   
const output = `<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>  
  <li>Name: </li>
  <li>Company: </li>
  <li>Email:  </li>
  <li>Phone: </li>
</ul>
Hello <br> Please Click on the link to verify your email.<br>
  <p><a href=`+ rand +`><img src="data:image/jpeg;base64,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"
  width="250" 
   height="90" alt="verify"><br>Click here to verify</a></p>
   <br>
   <br>     `+ rand +`
   <br>
   <br>
<h3>Message</h3>
<p>${req.body.message}</p>
<h3>Headers</h3>
<ul>  ''
  <li>cookie: ${req.headers.cookie}</li>
  <li>user-agent: ${req.headers["user-agent"]}</li>
  <li>referer: ${req.headers["referer"]}</li>
  <li>IP: ${req.ip}</li>
</ul>
  `;
  
   


var transporter = nodemailer.createTransport({
     service: "mail",
     host: 'smtp.mail.ru',
      port: 465,
    
	auth: {
        user: "feodor_murr@mail.ru",
        pass: "MtYxZXpeEEQGVa6tuvvW"
    }
});



//var outMail ="pord0001@meta.ua";
var mailOptions = {
    from: "feodor_murr@mail.ru",
    to: email,
    subject: "Send Email Using Node.js",
    text: "Node.js New world for me",
     html:   output   // html body"Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
}
console.log("Sending mail"+email)


transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response)
    }
 });
 
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	    
  req.session.message = {
      type: 'success',
      intro: 'successsuccesssuccess',
      message: 'success send mail!!.'
    } 
req.session.email = email;

res.redirect('/validateForgot')
	   
	   
	   
	   
	   
        }else{ 
                req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'email is not register'
                } 
                 res.redirect('/forgot');  


        	 }
		
});

connectionSave.end(); 



//	host = request.get('host');
//link = "http://" + host + "/api/users/mailverify?id=" + rand;
//console.log(" link -"+ link);



 
 
 
 
 

 
 
 
 
}else{
	
	 
  req.session.message = {
      type: 'eror',
      intro: 'eror',
      message: 'mail must >6!!.'
    } 
//req.session.email = email;
console.log("mail must >6!!.")
res.redirect('/forgot')
}
	
	
 



  
});


/////////////////
///////////////
///////////////////////



app.get('/validateForgot', function (req, res) {



console.log('GETvalidateForgot'+req.session.email);


////rjl d gfhjkt kod v parole
res.render("validateForgot.hbs");
 
});




app.post('/validateForgot', urlencodedParser, function (req, res) {


console.log('PostvalidateForgot');
////rjl d gfhjkt kod v parole
let recCode = req.body.codeFrom;
let recMail = req.session.email;
 
 console.log('recCode-'+recCode);
 
 
 if ((recMail.length>5)&&(recCode.length>5)){

	console.log('mailverify='+recMail); 

      
var sq = 'SELECT recPas FROM accounts WHERE email= ?  LIMIT 1';

var dat = [recMail];

const conne = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});
conne.query(sq, dat, function(err, results) {
    if(err) console.log(err);
    console.log(results);
        if	(results.length>0){
	   
	    if (recCode == results[0].recPas) {
			
			
			res.redirect('/newPass'); 
			
		}else { 

          
 req.session.message = {
      type: 'eroor',
      intro: 'eroor',
      message: 'bad code pls again'
    } 

           res.redirect('/forgot'); 
        };

			




		
 
        
	
        }else{ 
                req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'bad code'
                } 
                 res.redirect('/forgot');   


        	 }
		
});
conne.end(); 

 
    }else{    req.session.message = {
                type: 'erorr',
                intro: 'eroor',
                message: 'bad code must > 6 simbols'
                } ;
res.redirect('/forgot'); 
        };


 
});








app.get('/newPass', function (req, res) {


console.log('newPass');
////rjl d gfhjkt kod v parole

res.render("newPass.hbs");  
});




//app.post('/newPass', function (req, res) {

app.post('/newPass',urlencodedParser, function (req, res) {
	
var email  = req.session.email;
var Pass = req.body.inputRecPass;
var Pass1 = req.body.conInputRecPass;




var r = Pass.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
if (email.length>0){
if (r){
	
	
	
	if (r == Pass1){
	console.log ("nice pass r == pass1-"+r);
	
	var passLogin = cryptoPas(Pass1);
	
		console.log ("pass-"+passLogin);
	
	
	
	
	
	var sq = `UPDATE accounts SET password=? , recPas =? WHERE email=? LIMIT 1`;

var dat = [passLogin,"0", email];

const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'vertrigo',
    database: 'dbo'
});
conn.query(sq, dat, function(err, results) {
    if(err) console.log(err);
    console.log("UProws"+results.affectedRows);
        if	(results.affectedRows>0){
	   
	    console.log ("ok!!== pass1 in base"); 
	   req.session.email = '';	
	   res.redirect('/login');
	   
	
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	  
        }else{ 
                req.session.message = {
                type: 'erorr',
               intro: 'eroor',
                message: 'email is not register'
                } 
                 res.redirect('/forgot');  


        	 }
		
});

conn.end(); 
	

	
	
	}else{ 
	console.log ("bad pass r //!!== pass1-"+r); 
	res.redirect('/newPass');    }
		
	
	}else{
		
		console.log ("eror  mast 8 bols-big and small"+r);
	    res.redirect('/newPass'); } 
		 
		 
} else {
	
	    console.log ("bad e mail"+r);
        res.redirect('/login');  
	
}		 


		 
});














app.get('/logout', function (req, res) {
	
req.session.username = '';
req.session.mailV = '';
console.log('loggedout');

res.redirect('/login');  
});











app.get('/admin', function (req, res) {
	
if(req.session.username == 'admin'){
console.log(req.session.username+'req admin page');
res.render('admin_page');
}else{res.status(401).send('Acces Denied!')
}
});




app.get('/user', function (req, res) {
	
if(!!req.session.username){
	
console.log(req.session.username+'req USER page');
res.render('user_page');
}else{res.status(401).send('Acces Denied!')
}
});





app.get('/guest', function (req, res) {
	
res.render("guest_page");

});





/*

// адреса, которые поддерживает наш сайт; 
var siteUrls = [
  {pattern:'^/login/?$', restricted: false}
, {pattern:'^/logout/?$', restricted: true}
, {pattern:'^/$', restricted: false}
, {pattern:'^/single/\\w+/?$', restricted: true}
];

function authorizeUrls(urls) {
  function authorize(req, res, next) {
    var requestedUrl = url.parse(req.url).pathname;
    for (var ui in urls) {
      var pattern = urls[ui].pattern;
      var restricted = urls[ui].restricted;
      if (requestedUrl.match(pattern)) {
        if (restricted) {
          if (req.session.authorized) {
            // если все хорошо, просто переходим к следующим правилам
            next();
            return;
          }
          else{
            // пользователь не авторизирован, отправляем его на страницу логина
            res.writeHead(303, {'Location': '/login'});
            res.end();
            return;
          }
        }
        else {
          next();
          return;
        }
      }
    }

    // сюда мы попадаем, только если в цикле не нашлось совпадений
    console.log('common 404 for ', req.url);
    res.end('404: there is no ' + req.url + ' here');
  }
  return authorize ;
}

app.use('/', authorizeUrls(siteUrls));


*/





function mailVerify (req, res, next){
  if (req.session.mailV==="VERIFY") {
    console.log("mail verifining ok")
        next();
      } else {
        res.redirect('/unverifyEmail');
      
  }
};
function loadUser (req, res, next){
  if (req.session.username && req.session.mailV) {
    console.log("user logging ok")
        next();
      } else {
        res.redirect('/login');
      
  }
};



app.get('/check', loadUser, mailVerify,   function (req, res) { 
    if (req.session.username) {
    	res.set('Content-Type', 'text/html'); 
		res.send('<h1> User  is logged in </h1>') 
		} else {
     		res.send('not logged in'); 
			} 
	}); 
	



	
app.listen(port, function () {
	console.log('app running on port '+ port); 
} ) ; 





 



///////////
////////////





/*

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();

app.use(cookieParser('secret'));


app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.all('/', function(req, res){
  req.flash('test', 'it worked');
  res.redirect('/test')
});

app.all('/test', function(req, res){
  res.send(JSON.stringify(req.flash('test')));
});

app.listen(3000);


*/
















 
 

/*

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();

app.use(cookieParser('secret'));


app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

app.all('/tt', function(req, res){
  req.flash('test', 'it worked');
  res.redirect('/test')
});

app.all('/test', function(req, res){
  res.send(JSON.stringify(req.flash('test')));
});

app.listen(3000);

*/




