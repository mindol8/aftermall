
var http = require('http');
var express = require('express');
var path = require('path');
var static = require('serve-static');
var bodyParser = require('body-parser');
var cors = require('cors'); // 다른 서버로 접근하기위해서 사용
var hostname = '0.0.0.0';
const { constant } = require('async');
var session = require('express-session');
var mysqlDB = require("./DB/db");
var crypto = require('crypto');


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



	
//main page router
app.use('/', router);

app.use(function (req, res, next) { 
    sess = req.session;
    console.log(sess.username);
    res.render('index.html',{username:sess.username});
})

//logout router
router.get("/signout",function (req, res) {
    req.session.destroy(function () {
        req.session;
    });
    res.redirect('/');
})
//signin router
router.get("/signin",function(req,res){
    res.render("signin.html",{flag:''});
})

//signin data
router.post("/signin/confirm",function(req,res){
    console.log(req.body);    
    var userid = req.body.userId;
    var userpw = req.body.userPw;
    mysqlDB.query("SELECT * FROM USER WHERE USER_ID = ?",[userid],function(err, row,fields){
        if(err){
            console.log(err);
        }
        else{
            var salt = row[0].SALT;
            var pw = row[0].USER_PW;
            var name = row[0].NAME;
            var hashPassword = crypto.createHash("sha512").update(userpw + salt).digest("hex");
            if(hashPassword === pw){
                console.log("signin success");
                sess = req.session;
                sess.username = name;
                res.send(name);
            
            }else{
                console.log("fail");
            }
        }
    })
})

//sign up router
router.get("/signup",function(req,res){
    res.render("signup.html");
})

//find password router
router.get("/findpw",function(req,res){
    res.render("findpw.html");
})


//signup data
router.post("/signup/confirm",function(req,res){
    console.log(req.body);
    var data = req.body;
    //sign up data
    var userId = data.userId;
    var userPw = data.userPw;
    var userName = data.userName;
    var userEmail = data.userEmail;
    var userPhone = data.userPhone;
    //hash salt
    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    //password hashing
    var hashPassword = crypto.createHash("sha512").update(userPw + u_salt).digest("hex");
    var userInfo = {USER_ID:userId, USER_PW: hashPassword, EMAIL:userEmail, SALT: u_salt, NAME: userName, PHONE: userPhone};
    console.log(userInfo);
    //insert sign up data into db
    mysqlDB.query("INSERT INTO USER SET ?",userInfo,function(err, row,fields){
        if(err){
            console.log(err);
        }
        else{
            console.log("sign up success");
            res.send(req.body.userName);
        }

    })
    
})
//signup check overlap id
router.post("/signup/overlap",function(req,res){
    console.log(req.body.userId); 
    var checkId = req.body.userId; 
    mysqlDB.query("SELECT USER_ID FROM USER WHERE USER_ID = ?",[checkId],function(err, row, fields){
        if(err){
            console.log(err);
        }
        else{
            console.log(row[0]);            
            if(row[0] == null){
                res.send("ok");
            }else{
                res.send("fail");
            }
          
            
        }

    })
    //send true false
    
})

//search item
router.post("/search",function(req,res){
    var theme = req.body.theme;
    var item = req.bodyd.search_thing;
})

//shopping mall router
router.get("/shop",function(req,res){
    sess = req.session;
    res.render("shop.html",{username:sess.username});
})

//item router
router.get("/item",function(req,res){
    sess = req.session;
    res.render("item.html",{username:sess.username});
})

//cart router
router.get("/cart",function(req,res){
    sess = req.session;
    if(!sess.username){
        res.render("signin.html",{flag:'no'});
    }else{
        res.render("cart.html",{username:sess.username});
    }
    
})


//express run
http.createServer(app).listen(app.get('port'), function () {
    console.log("익스프레스로 웹 서버를 실행함 : " + app.get('port'));
}) 



