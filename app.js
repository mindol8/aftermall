
var http = require('http')
var express = require('express')
var path = require('path')
var static = require('serve-static')
var bodyParser = require('body-parser')
var cors = require('cors') // 다른 서버로 접근하기위해서 사용
var hostname = '0.0.0.0';
const { constant } = require('async')
var session = require('express-session');
var mysql = require('mysql');


var app = express();

app.use(session({
    secret: '@#@$sessKEY#@$#$',
    resave: false,
    saveUninitialized: true
   }));

app.set('port', process.env.PORT || 8880); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(cors());
app.use('node_modules', express.static(path.join(__dirname, '/node_modules')))
app.set('views', __dirname + '/views');
app.set('views engin', 'ejs');
app.engine('html', require('ejs').renderFile);

var router = express.Router();

var connection = mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    user:'autoin',
    password:'autoin1020#',
    database:'autoinmall'
});

module.exports = connection;

	
//main page router
app.use('/', router);

app.use(function (req, res, next) { 
    var sess = req.session;
    sess.username = "default";
    res.render('index.html',{sess:sess});
})

//signin router
router.get("/signin",function(req,res){
    res.render("signin.html");
})

//signin data
router.post("/signin/confirm",function(req,res){
    console.log(req.body);    
    res.send(req.body.userId);
})

//sign up router
router.get("/signup",function(req,res){
    res.render("signup.html");
})

//signup data
router.post("/signup/confirm",function(req,res){
    console.log(req.body);
    
    res.send(req.body.userName);
})
//signup check overlap id
router.post("/signup/overlap",function(req,res){
    console.log(req.body.userId);  
  
    //send true false
    res.send("success");
})


//shopping mall router
router.get("/shop",function(req,res){
    res.render("shop.html");
})

//item router
router.get("/item",function(req,res){
    res.render("item.html");
})

//cart router
router.get("/cart",function(req,res){
    res.render("cart.html");
})


//express run
http.createServer(app).listen(app.get('port'), function () {
    console.log("익스프레스로 웹 서버를 실행함 : " + app.get('port'));
}) 



