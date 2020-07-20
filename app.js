
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
var multer = require('multer');

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
    console.log("username: " + sess.username);
    res.render('index.html', { username: sess.username });
})

//logout router
router.get("/signout", function (req, res) {
    req.session.destroy(function () {
        console.log("kill session");
        req.session;
        console.log(req.session);
    });
    res.redirect('/');
})
//signin router
router.get("/signin", function (req, res) {
    var sess = req.session;
    res.render("signin.html", { flag: '', username: sess.username });
})

//signin data
router.post("/signin/confirm", function (req, res) {
    console.log(req.body);
    var userid = req.body.userId;
    var userpw = req.body.userPw;
    mysqlDB.query("SELECT * FROM USER WHERE USER_ID = ?", [userid], function (err, row, fields) {
        if (err) {
            console.log("err:" + err);
        }
        else {
            console.log(row);
            if (row == "") {
                //console.log("err: emtpy set");
                res.send("signin fail:wrong Id#");
            } else {
                var salt = row[0].SALT;
                var pw = row[0].USER_PW;
                var name = row[0].NAME;
                var hashPassword = crypto.createHash("sha512").update(userpw + salt).digest("hex");
                if (hashPassword === pw) {
                    console.log("signin success");
                    sess = req.session;
                    sess.username = name;
                    sess.userid = userid;
                    sess.token = row[0].TOKEN;
                    console.log(name);
                    res.send(name);

                } else {
                    console.log("fail");
                    res.send("signin fail:wrong password$");
                }

            }

        }
    })
})

//find password router
router.get("/findpw", function (req, res) {
    sess = req.session
    res.render("findpw.html",{username:sess.username,info:"undefined"});
})

//Account management
router.get("/management", function (req, res) {
    var sess = req.session;
    if (sess.token == 0) {
        mysqlDB.query("SELECT * FROM USER WHERE USER_ID=?", [sess.userid], function (err, row) {
            if (err) {
                console.log(err);
            } else {
                res.render("account.html", {
                    username: sess.username,
                    userid: row[0].USER_ID,
                    userpw: row[0].USER_PW,
                    userphone: row[0].PHONE,
                    useremail: row[0].EMAIL,
                    useraddress: row[0].ADDRESS,
                    userzipcode: row[0].ZIPCODE
                });
            }
        })
    } else if (sess.token == 1) {
        res.render("admin.html", { username: sess.username });
    }


})
//admin page user info
router.post("/admin/user", function (req, res) {
    mysqlDB.query("SELECT USER_ID,NAME,EMAIL,TOKEN,PHONE FROM USER", function (err, row) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            res.send(data);
        }

    })
})
//admin item search
router.post("/admin/item/search", function (req, res) {
    console.log(req.body);
    var theme = req.body.theme;
    var thing = req.body.search_thing;
    if (theme === "pin") {
        mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND PIN = ?", [thing], function (err, row) {
            if (err) {
                console.log(err);
            } else {
                console.log(row[0]);
                res.send(row[0]);
            }

        })

    }
})
//admin item add
router.post("/admin/item/add", function (req, res) {
    console.log("add");
    console.log(req.body);
    var item = req.body.item;
    var parts_num = req.body.parts_num;
    var price = req.body.price;
    var volume = Number(req.body.volume);
    var mainc = req.body.mainc;
    var subc = req.body.subc;
    var desc = req.body.desc;
    var modelb = req.body.modelb;
    var manufc = req.body.manufc;
    var modeld = req.body.modeld;
    var manufi = req.body.manufi;

    var u_salt = Math.round((new Date().valueOf() * Math.random())) + ""; 
    var hashnum = crypto.createHash("sha256").update(pin + u_salt).digest("hex");
    var pin = "AM"+String(hashnum);
    
    var c_data = {
        MAIN_C: mainc,
        SUB_C: subc,
        BASE_M: modelb,
        DETAIL_M: modeld,
        CAR_M: manufc,
        ITEM_M: manufi,
        ITEM_NUM: pin
    }
    var data = {
        ITEM_NAME: item,
        PARTS_NUM: parts_num,
        PIN:pin,
        PRICE: price,
        VOLUME: volume,
        ITEM_DESC: desc,
        RATE: 3
    }
    mysqlDB.query("INSERT INTO ITEM SET ?", data, function (err2, row2) {
        if (err2) {
            console.log(err2);
        } else {
            mysqlDB.query("INSERT INTO ITEMINFO SET ?", c_data, function (err3, row3) {
                res.send(pin);
            })

        }

    })
    
})
//admin item setting
router.post("/admin/item/setting", function (req, res) {
    console.log(req.body);
    var pin = req.body.pin;
    var data = {
        ITEM_NAME: req.body.item,
        PARTS_NUM: req.body.partsnum,
        PIN:pin,
        PRICE: req.body.price,
        VOLUME: req.body.volume,
        ITEM_DESC: req.body.desc
    }
    var c_data = {
        MAIN_C: req.body.mainc,
        SUB_C: req.body.subc,
        BASE_M: req.body.modelb,
        DETAIL_M: req.body.modeld,
        CAR_M: req.body.manufc,
        ITEM_M: req.body.manufi,
        ITEM_NUM: pin
    }

    mysqlDB.query("UPDATE ITEM SET ? WHERE PIN = ?", [data, pin], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            mysqlDB.query("UPDATE ITEMINFO SET ? WHERE ITEM_NUM = ?", [c_data, pin], function (err2, row2) {
                if (err2) {
                    console.log(err2)
                } else {
                    res.send("success setting");
                }
            })

        }
    })

})
//admin item delete
router.post("/admin/item/delete", function (req, res) {
    console.log(req.body);
    mysqlDB.query("DELETE FROM ITEMINFO WHERE ITEM_NUM = ?", [req.body.pin], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            mysqlDB.query("DELETE FROM ITEM WHERE PIN = ?", [req.body.pin], function (err2, row2) {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send("success delete");
                }
            })

        }
    })

})
//update account info
router.post("/accout/setting", function (req, res) {
    console.log("setting");
    var attr = req.body;
    console.log(attr);

    if (!isNaN(attr.userphone) && !isNaN(attr.userzipcode)) {
        mysqlDB.query("UPDATE USER SET NAME = ?, EMAIL =?, PHONE=?, ADDRESS=?, ZIPCODE=? WHERE USER_ID = ?", [attr.username, attr.useremail, attr.userphone, attr.useraddress, attr.userzipcode, attr.userid], function (err, row) {
            if (err) {
                console.log(err);
            } else {
                sess = req.session;
                sess.username = attr.username;
                res.send("success");
            }
        })
    }

})

router.post("/account/password", function (req, res) {
    var data = req.body;
    //hash salt
    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    //password hashing
    var hashPassword = crypto.createHash("sha512").update(data.pw + u_salt).digest("hex");
    console.log(hashPassword);
    mysqlDB.query("UPDATE USER SET USER_PW = ?, SALT=? WHERE USER_ID = ?", [hashPassword, u_salt, data.id], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            console.log(row);
            res.send("success");
        }
    })
})

//sign up router
router.get("/signup", function (req, res) {
    res.render("signup.html");
})

//signup data
router.post("/signup/confirm", function (req, res) {
    console.log(req.body);
    var data = req.body;
    //sign up data
    var userId = data.userId;
    var userPw = data.userPw;
    var userName = data.userName;
    var userEmail = data.userEmail;
    var userPhone = data.userPhone;
    var userZipcode = data.userZipcode;
    var userAddress = data.userAddress;
    var usertoken = 0;
    //hash salt
    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    //password hashing
    var hashPassword = crypto.createHash("sha512").update(userPw + u_salt).digest("hex");
    var userInfo = { USER_ID: userId, USER_PW: hashPassword, EMAIL: userEmail, SALT: u_salt, NAME: userName, PHONE: userPhone, ZIPCODE: userZipcode, ADDRESS: userAddress, TOKEN: usertoken };
    console.log(userInfo);
    //insert sign up data into db
    mysqlDB.query("INSERT INTO USER SET ?", userInfo, function (err, row, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("sign up success");
            res.send(req.body.userName);
        }

    })

})
//signup check overlap id
router.post("/signup/overlap", function (req, res) {
    console.log(req.body.userId);
    var checkId = req.body.userId;
    mysqlDB.query("SELECT USER_ID FROM USER WHERE USER_ID = ?", [checkId], function (err, row, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(row[0]);
            if (row[0] == null) {
                res.send("ok");
            } else {
                res.send("fail");
            }


        }

    })
    //send true false

})
//sign up check Effectiveness
router.post("/signup/effectiveness", function (req, res) {
    var attr = req.body;
    console.log(attr)
    var id = attr.id;
    var pw = attr.pw;
    var c_p = attr.c_p;
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var koreancheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (false === reg.test(pw)) {
        //error all
        res.send("errortype1");
    } else if (/(\w)\1\1\1/.test(pw)) {
        //length error
        res.send("errortype2");

    } else if (pw.search(id) > -1) {
        //pw have id error
        res.send("errortype3");

    } else if (pw.search(/\s/) != -1) {
        //blank error
        res.send("errortype4");

    } else if (koreancheck.test(pw)) {
        //korean error
        res.send("errortype5");

    } else if (c_p === pw) {
        //success
        res.send("errortype0");
    } else {
        res.send("errortype6");
    }

})


//search item
router.post("/search", function (req, res) {
    var item = req.body.search_thing;//parts_num
    var category = req.body.category;
    var brand = req.body.brands;
    var model = req.body.model;
    var version = req.body.version;
    console.log(req.body);
  
    var sess = req.session;
    var category_main = "";
    var category_sub = "";
    if(item){
     //search for parts_number
     mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND PARTS_NUM = ?", [item], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            
            res.render("shop.html", { username: sess.username, info: data });
        }
    })
    }else{
        //no parts_number
        if(category !="Choose..."){
            category = category.split('&');
            category_main = category[0];
            category_sub = category[1];
            //accessory search
            if(category_main === "accessories"){
                mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ?", [category_main,category_sub], function (err, row) {
                    if (err) {
                        console.log(err);
                    } else {
                        var data = JSON.stringify(row);                        
                        res.render("shop.html", { username: sess.username, info: data });
                    }
                })
            }else{
                //search brands model version
                sess.carmanufacturer = brand;
                //only car
                if(model === "ecption02"){
                   
                    mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ?", [category_main,category_sub,brand], function (err, row) {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.stringify(row);
                            console.log(row);
                            
                            res.render("shop.html", { username: sess.username, info: data });
                        }
                    })
                }else if(version ==="ecption03"){
                    //brand and model
                    mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ? AND BASE_M = ?", [category_main,category_sub,brand,model], function (err, row) {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.stringify(row);
                            console.log(row);
                            
                            res.render("shop.html", { username: sess.username, info: data });
                        }
                    })
                }else{
                    mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ? AND BASE_M = ? AND DETAIL_M = ?", [category_main,category_sub,brand,model,version], function (err, row) {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.stringify(row);
                            console.log(row);
                           
                            res.render("shop.html", { username: sess.username, info: data });
                        }
                    })
                }
               
            }    
        }else{
             //search brands model version
             sess.carmanufacturer = brand;
             //only car
             if(model === "ecption02"){
                console.log("ecption02");
                 mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ?", [brand], function (err, row) {
                     if (err) {
                         console.log(err);
                     } else {
                         var data = JSON.stringify(row);
                         console.log(row);
                         
                         res.render("shop.html", { username: sess.username, info: data });
                     }
                 })
             }else if(version ==="ecption03"){
                 //brand and model
                 mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ? AND BASE_M = ?", [brand,model], function (err, row) {
                     if (err) {
                         console.log(err);
                     } else {
                         var data = JSON.stringify(row);
                         console.log(row);
                         
                         res.render("shop.html", { username: sess.username, info: data });
                     }
                 })
             }else{
                 mysqlDB.query("SELECT ITEM_NAME,PIN,PARTS_NUM,VOLUME,PRICE,RATE,MAIN_C,SUB_C,CAR_M FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ? AND BASE_M = ? AND DETAIL_M = ?", [brand,model,version], function (err, row) {
                     if (err) {
                         console.log(err);
                     } else {
                         var data = JSON.stringify(row);
                         console.log(row);
                        
                         res.render("shop.html", { username: sess.username, info: data });
                     }
                 })
             }
         
        } 
    }

})


//search item method get
router.get("/shop/item", function (req, res) {
    console.log("get");
    sess = req.session;
    var main = req.query.main;
    var sub = req.query.sub;
    if (main != "etc") {
        if (sess.carmanufacturer) {
            mysqlDB.query("SELECT ITEM_NAME,PIN,VOLUME,PRICE,RATE,MAIN_C FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ?", [main, sub, sess.carmanufacturer], function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    var data = JSON.stringify(row)
                    res.render("shop.html", { username: sess.username, info: data });
                }
            })
        } else {
            mysqlDB.query("SELECT ITEM_NAME,PIN,VOLUME,PRICE,RATE,MAIN_C FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ?", [main, sub], function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    var data = JSON.stringify(row)
                    res.render("shop.html", { username: sess.username, info: data });
                }
            })
        }
    } else {
        if (sess.carmanufacturer) {
            mysqlDB.query("SELECT ITEM_NAME,PIN,VOLUME,PRICE,RATE,MAIN_C FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND CAR_M = ?", [main,sess.carmanufacturer], function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    var data = JSON.stringify(row)
                    res.render("shop.html", { username: sess.username, info: data });
                }
            })
        } else {
            mysqlDB.query("SELECT ITEM_NAME,PIN,VOLUME,PRICE,RATE,MAIN_C FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ?", [main], function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    var data = JSON.stringify(row)
                    res.render("shop.html", { username: sess.username, info: data });
                }
            })
        }
    }

})

router.get("/item/info", function (req, res) {
    console.log("get");
    sess = req.session;
    var pin = req.query.pin;
    console.log(pin);
    mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND PIN = ?",[pin],function(err,row){
        if(err){
            console.log(err);
        }else{
            var data = JSON.stringify(row);
            data = data.replace(/\\r/gi, '').replace(/\\n/gi, ' ').replace(/\\t/gi, ' ').replace(/\\f/gi, ' ');
            res.render("item.html", { username: sess.username, info:data});
        }
    })
})

//insert item into cart
router.post("/item/cart",(req,res)=>{
    var name = req.body.item_name;
    var price = req.body.item_price;
    var pin = req.body.item_pin;
    var parts_num = req.body.item_parts_num;
    var volume = req.body.item_volume;
    var user = req.session.userid;
    var data;
    if(price===""){
        data = {
            ID: user,
            ITEM: name,
            PRICE: "no data",
            PIN: pin,
            PARTS_NUM:parts_num,
            VOLUME:volume
        }
    }else{
        price =  parseFloat(price) * parseFloat(volume);//new input
        data = {
            ID: user,
            ITEM: name,
            PRICE: price,
            PIN: pin,
            PARTS_NUM:parts_num,
            VOLUME:volume
        }
    }
    
    if(!user){
        res.send("GO SIGNIN");
    }else{
        mysqlDB.query("SELECT * FROM CART WHERE PIN = ?",[pin],(err,row)=>{
            if(err){
                console.log(err);
            }else{
                //first item input
                if(row[0] == null){
                    mysqlDB.query("INSERT INTO CART SET ?",data,(err2,row2)=>{
                        if(err2){
                            console.log(err2);
                            
                        }else{
                            res.send(name);
                        }
                    })
                }else{
                    volume = parseInt(row[0].VOLUME)+parseInt(volume);
                    price = parseFloat(price) + parseFloat(row[0].PRICE);//new + before
                    mysqlDB.query("UPDATE CART SET VOLUME = ?, PRICE = ? WHERE PIN = ?",[volume,price,pin],(err3,row3)=>{
                        if(err3){
                            console.log(err3);
                            
                        }else{
                            res.send(name);
                        }
                    })
                }
            }
        })
        
    }
   
})

//delete item in the cart
router.post("/cart/delete",(req,res)=>{
    console.log(req.body);
    mysqlDB.query("DELETE FROM CART WHERE PIN = ?",[req.body.PIN],(err,row)=>{
        if(err){
            console.log(err);
        }else{
            res.send("success");
        }
    })
    
})

//shopping mall router
router.get("/shop", function (req, res) {
    console.log("get shop");
    sess = req.session;
    sess.carmanufacturer=null;
    res.render("shop.html", { username: sess.username, info: JSON.stringify('undefined')});
})

//item router
router.get("/item", function (req, res) {
    sess = req.session;
    res.render("item.html", { username: sess.username ,info: JSON.stringify('undefined')});
})

//cart router
router.get("/cart", function (req, res) {
    sess = req.session;
    if (!sess.username) {
        res.render("signin.html", { flag: 'no', username: sess.username });
    } else {
        mysqlDB.query("SELECT ITEM, VOLUME, PRICE, PARTS_NUM, PIN FROM CART WHERE ID = ?",[sess.userid],(err,row)=>{
            if(err){
                console.log(err);
            }else{
                var data = JSON.stringify(row);
                res.render("cart.html", { username: sess.username,data:data });
            }
        })
        
    }

})


//express run
http.createServer(app).listen(app.get('port'), function () {
    console.log("익스프레스로 웹 서버를 실행함 : " + app.get('port'));
})



