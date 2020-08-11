
var http = require('http');
var express = require('express');
var path = require('path');
var static = require('serve-static');
var bodyParser = require('body-parser');
var cors = require('cors'); // 다른 서버로 접근하기위해서 사용
var fs = require('fs');
var hostname = '0.0.0.0';
const { constant, reject } = require('async');
var session = require('express-session');
var mysqlDB = require("./DB/db");
var nodemailer = require("./mail/mail");
var crypto = require('crypto');
var multer = require('multer');
const { resolve } = require('path');

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
//item img route
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/stylesheet/img/item');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
});
//item brands img route
const upload_item_brand = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/stylesheet/img/item_brands');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
});

//car brands img route
const upload_car_brand = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/stylesheet/img/car_brands');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
});

//shop img route
const shop_img = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/stylesheet/img/mall');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
});

//main page router
app.use('/', router);

app.use(function (req, res, next) {
    mysqlDB.query("SELECT ID FROM CATEGORY_LIST", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            var category = JSON.stringify(row);
            sess = req.session;
            sess.category = category;
            // console.log("username: " + sess.username);
            mysqlDB.query("SELECT NAME,IMG FROM ITEM_BRAND", (err2, row2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    var data = JSON.stringify(row2);
                    mysqlDB.query("SELECT NAME,IMG FROM CAR_BRAND", (err3, row3) => {
                        if (err3) {
                            console.log(err3);
                        } else {
                            var car = JSON.stringify(row3);
                            mysqlDB.query("SELECT THEME,TOP1,TOP2,TOP3,ITEM_NAME,IMG1,PIN FROM ITEM JOIN RANKING ON PIN = TOP1 OR PIN = TOP2 OR PIN = TOP3 JOIN ITEMINFO ON PIN = ITEM_NUM ORDER BY THEME",(err4,row4)=>{
                                if(err4){
                                    console.log(err4);
                                }else{
                                    var ranking = JSON.stringify(row4);
                                    res.render('index.html', { username: sess.username, category: sess.category, itembrand: data, carbrand: car,ranking:ranking});
                                }
                            })
                            
                        }
                    })

                }
            })

        }
    })

})

//logout router
router.get("/signout", function (req, res) {
    req.session.destroy(function () {
        //  console.log("kill session");
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
                if (row[0].LOCK_ACC == 1) {
                    var salt = row[0].SALT;
                    var pw = row[0].USER_PW;
                    var name = row[0].NAME;
                    var hashPassword = crypto.createHash("sha512").update(userpw + salt).digest("hex");
                    if (hashPassword === pw) {
                        //   console.log("signin success");
                        sess = req.session;
                        sess.username = name;
                        sess.userid = userid;
                        sess.email = row[0].EMAIL;
                        sess.token = row[0].TOKEN;
                        console.log(name);
                        res.send(name);

                    } else {
                        // console.log("fail");
                        res.send("signin fail:wrong password$");
                    }
                } else {
                    res.send("signin fail:check Email first@");
                }


            }

        }
    })
})

//find password router
router.get("/findpw", function (req, res) {
    sess = req.session
    res.render("findpw.html", { username: sess.username, info: "undefined" });
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

//admin car brand
router.get("/admin/carbrand", (req, res) => {
    mysqlDB.query("SELECT * FROM CAR_BRAND", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            res.render("car_brand.html", { data: data });
        }
    })
})

//admin car brand delete
router.post("/admin/carbrand/delete", (req, res) => {
    mysqlDB.query("DELETE FROM CAR_BRAND WHERE NAME = ?", [req.body.name], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //delete car brand img
            fs.unlink("./public/stylesheet/img/car_brands/" + req.body.img, (err2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send("success");
                }
            })

        }
    })
})
//admin car brand add
router.post("/admin/carbrand/add", upload_car_brand.single("brandimg"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if(req.file){
        var data = {
            NAME: req.body.name,
            IMG: req.file.filename,
        }
    }else{
        var data = {
            NAME: req.body.name,
            
        }
    }
  
    mysqlDB.query("INSERT INTO CAR_BRAND SET ?", [data], (err, row) => {
        if (err) {
            console.log(err);
            res.send('fail');
        } else {
            res.send("success");
        }
    })

})

////admin car brand setting
router.post("/admin/carbrand/change", upload_car_brand.single("img"), (req, res) => {
    //  console.log(req.file);
    if (req.file != null) {
        mysqlDB.query("UPDATE CAR_BRAND SET IMG = ? WHERE NAME = ?", [req.file.filename, req.body.name], (err, row) => {
            if (err) {
                console.log(err);
                res.send("update error");
            } else {
                res.send(req.file.filename);
            }
        })
    } else {
        res.send("no chage");
    }


})
//admin item brand setting
router.post("/admin/itembrand/change", upload_item_brand.single("img"), (req, res) => {
    //console.log(req.body);
    //console.log(req.file);
    if (req.file != null) {
        mysqlDB.query("UPDATE ITEM_BRAND SET CITY = ?, COUNTRY = ?, IMG = ? WHERE NAME = ?", [req.body.city, req.body.country, req.file.filename, req.body.name], (err, row) => {
            if (err) {
                console.log(err);
                res.send("update error");
            } else {
                res.send(req.file.filename);
            }
        })
    } else {
        mysqlDB.query("UPDATE ITEM_BRAND SET CITY = ?, COUNTRY = ? WHERE NAME = ?", [req.body.city, req.body.country, req.body.name], (err, row) => {
            if (err) {
                console.log(err);
                res.send("update error");
            } else {
                res.send("update success without img");
            }
        })
    }

})
//admin item brand 
router.get("/admin/itembrand", (req, res) => {
    mysqlDB.query("SELECT * FROM ITEM_BRAND", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            res.render("item_brand.html", { data: data });
        }
    })

})
//admin item brand add
router.post("/admin/itembrand/add", upload_item_brand.single("brandimg"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if(req.file){
        var data = {
            NAME: req.body.name,
            IMG: req.file.filename,
            COUNTRY: req.body.country,
            CITY: req.body.city,
           
        }
    }else{
        var data = {
            NAME: req.body.name,
           
            COUNTRY: req.body.country,
            CITY: req.body.city,
           
        }
    }
 
    mysqlDB.query("INSERT INTO ITEM_BRAND SET ?", [data], (err, row) => {
        if (err) {
            console.log(err);
            res.send("fail");
        } else {
            res.send("success");
        }
    })

})
//admin item brand delete
router.post("/admin/itembrand/delete", (req, res) => {
    mysqlDB.query("DELETE FROM ITEM_BRAND WHERE NAME = ?", [req.body.name], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //delete item brand img
            fs.unlink("./public/stylesheet/img/item_brands/" + req.body.img, (err2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send("success");
                }
            })

        }
    })
})

//admin page user info
router.get("/admin/user", function (req, res) {
    mysqlDB.query("SELECT USER_ID,NAME,EMAIL,TOKEN,PHONE FROM USER", function (err, row) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            res.render("user.html", { data: data });
        }

    })
})

//admin page user info
router.post("/admin/user/delete", function (req, res) {
    console.log(req.body.id);
    mysqlDB.query("DELETE FROM USER WHERE USER_ID = ?", [req.body.id], function (err, row) {
        if (err) {
            console.log(err);
            res.send("err");
        } else {

            res.send("success");
        }

    })
})


//admin page user info
router.post("/admin/user/change", function (req, res) {
    console.log(req.body);
    mysqlDB.query("UPDATE USER SET NAME = ?, EMAIL = ?, PHONE = ? WHERE USER_ID=?", [req.body.name, req.body.email, req.body.phone, req.body.id], function (err, row) {
        if (err) {
            console.log(err);
            res.send("err");
        } else {
            res.send("success");
        }

    })
})


//admin item page
router.get("/admin/item", (req, res) => {
    var sess = req.session;
    mysqlDB.query("SELECT DISTINCT NAME FROM CAR_BRAND", (err2, row2) => {
        if(err2){
            console.log(err2);
        }else{
            mysqlDB.query("SELECT DISTINCT NAME FROM ITEM_BRAND", (err3, row3) => {
                if(err3){
                    console.log(err3);
                }else{
                    var data2 = JSON.stringify(row2);
                    data2 = data2.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                    var data3 = JSON.stringify(row3);
                    data3 = data3.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                    res.render("item_info.html", { category: sess.category,carbrand:data2,itembrand:data3 });
                }   
            }
            )
        }

})
})
//admin item search
router.post("/admin/item/search", (req, res) => {

    mysqlDB.query("SELECT * FROM ITEMINFO,ITEM WHERE PIN = ITEM_NUM AND PIN = ?", [req.body.pin], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            res.send(row);
        }
    })
})
//admin download file delete
router.post('/admin/file/delete', (req, res) => {
    mysqlDB.query('SELECT FILE_LIST FROM ITEMINFO WHERE ITEM_NUM = ?', [req.body.pin], (err, row) => {
        if (err) {
            res.send(err);
        } else {
            var list = row[0].FILE_LIST.split(';');
            //console.log(list);
            //console.log(req.body.filename);
            var new_list = "";
            for (var i = 0; i < list.length; i++) {
                if (list[i] === req.body.filename) {
                    fs.unlink("./public/stylesheet/img/item/" + list[i], (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {

                        }
                    })
                    list.splice(i, 1);
                    // console.log("list slice "+list);
                    // console.log(list[i]);
                    i = i - 1;
                } else if (list[i] != "") {
                    new_list = new_list + list[i] + ";";
                }
            }
            //console.log(new_list);
            mysqlDB.query('UPDATE ITEMINFO SET FILE_LIST = ? WHERE ITEM_NUM = ?', [new_list, req.body.pin], (err2, row2) => {
                if (err2) {
                    console.log(err2);
                    res.send(err2);
                } else {
                    res.send("success");
                }
            })

        }
    })
})
//admin img file delete
router.post('/admin/img/delete', (req, res) => {
    console.log(req.body);
    switch (req.body.img) {
        case "IMG1":
            mysqlDB.query("UPDATE ITEMINFO SET IMG1 = 'no_img.png' WHERE ITEM_NUM = ?", [ req.body.pin], (err, row) => {
                if (err) {
                    res.send("err");
                    console.log(err);
                } else {
                    fs.unlink("./public/stylesheet/img/item/" + req.body.name, (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            res.send("success");
                        }
                    })
                }
            })
            break;

        case "IMG2":
            mysqlDB.query("UPDATE ITEMINFO SET IMG2 = 'no_img.png' WHERE ITEM_NUM = ?", [req.body.pin], (err, row) => {
                if (err) {
                    res.send("err");
                    console.log(err);
                } else {
                    fs.unlink("./public/stylesheet/img/item/" + req.body.name, (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            res.send("success");
                        }
                    })
                }
            })
            break;

        case "IMG3":
            mysqlDB.query("UPDATE ITEMINFO SET IMG3 = 'no_img.png' WHERE ITEM_NUM = ?", [req.body.pin], (err, row) => {
                if (err) {
                    res.send("err");
                    console.log(err);
                } else {
                    fs.unlink("./public/stylesheet/img/item/" + req.body.name, (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            res.send("success");
                        }
                    })
                }
            })
            break;

        case "IMG4":
            mysqlDB.query("UPDATE ITEMINFO SET IMG4 = 'no_img.png' WHERE ITEM_NUM = ?", [req.body.pin], (err, row) => {
                if (err) {
                    res.send("err");
                    console.log(err);
                } else {
                    fs.unlink("./public/stylesheet/img/item/" + req.body.name, (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            res.send("success");
                        }
                    })
                }
            })
            break;

        case "IMG5":
            mysqlDB.query("UPDATE ITEMINFO SET IMG5 = 'no_img.png' WHERE ITEM_NUM = ?", [ req.body.pin], (err, row) => {
                if (err) {
                    res.send("err");
                    console.log(err);
                } else {
                    fs.unlink("./public/stylesheet/img/item/" + req.body.name, (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            res.send("success");
                        }
                    })
                }
            })
            break;
    }

})
//admin item delete
router.post("/admin/item/delete", (req, res) => {
    console.log(req.body);
    var img_list = ["", "", "", "", ""];
    //delete item img    
    mysqlDB.query("SELECT IMG1,IMG2,IMG3,IMG4,IMG5,FILE_LIST FROM ITEMINFO WHERE ITEM_NUM = ?", [req.body.pin], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            console.log(row);
            img_list[0] = row[0].IMG1;
            img_list[1] = row[0].IMG2;
            img_list[2] = row[0].IMG3;
            img_list[3] = row[0].IMG4;
            img_list[4] = row[0].IMG5;
            console.log(img_list);
            if(row[0].FILE_LIST){
                var file_list = row[0].FILE_LIST.split(";");
                for (var j = 0; j < file_list.length; j++) {
                    fs.unlink("./public/stylesheet/img/item/" + file_list[i], (del_file_err) => {
                        if (del_file_err) {
                            console.log(err);
                        } else {
                            console.log("success");
                        }
                    })
                }
            }          
           
            mysqlDB.query("DELETE FROM ITEMINFO WHERE ITEM_NUM = ?", [req.body.pin], function (err2, row2) {
                if (err2) {
                    console.log(err2);
                } else {
                    mysqlDB.query("DELETE FROM ITEM WHERE PIN = ?", [req.body.pin], function (err3, row3) {
                        if (err3) {
                            console.log(err3);
                        } else {
                            for (var i = 0; i < 5; i++) {
                                if (img_list[i] != "no_img.png") {
                                    fs.unlink("./public/stylesheet/img/item/" + img_list[i], (del_err) => {
                                        if (del_err) {
                                            console.log(err);
                                        } else {
                                            console.log("success");
                                        }
                                    })
                                }
                            }
                            res.send("success");
                        }
                    })
                }
            })

        }
    })

})
//admin ranking
router.get("/admin/ranking",(req,res)=>{
    mysqlDB.query("SELECT * FROM RANKING",(err,row)=>{
        if(err){
            console.log(err);
        }else{
            var data = JSON.stringify(row);
            res.render("ranking.html",{data:data});
        }
    })
    
})
//ranking setting
router.post("/admin/ranking/setting",(req,res)=>{
    var data = {
        TOP1: req.body.top1,
        TOP2: req.body.top2,
        TOP3: req.body.top3
    }
    mysqlDB.query("UPDATE RANKING SET ? WHERE THEME = ?",[data,req.body.theme],(err,row)=>{
        if(err){
            console.log(err);
        }else{
            res.send("success");
        }
    })
})
//ranking delete
router.post("/admin/ranking/delete",(req,res)=>{
    mysqlDB.query("DELETE FROM RANKING WHERE THEME = ?",[req.body.theme],(err,row)=>{
        if(err){
            console.log(err);
        }else{
            res.send("success");
        }
    })
})
//ranking add
router.post("/admin/ranking/add",(req,res)=>{
   // console.log(req.body);
   var data={
       THEME: req.body.theme,
       TOP1: req.body.top1,
       TOP2: req.body.top2,
       TOP3: req.body.top3,
   }
    mysqlDB.query("INSERT INTO RANKING SET ?",[data],(err,row)=>{
        if(err){
            console.log(err);
        }else{
            res.send("success");
        }
    })
    
})
//admin category
router.get("/admin/category", (req, res) => {
    mysqlDB.query("SELECT * FROM CATEGORY_LIST ORDER BY MAIN", function (err, row) {
        if (err) {
            console.log(err);
        } else {

            var data = JSON.stringify(row);
            data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');

            res.render("category.html", { data: data });
        }

    })
})

//category delete sub
router.post("/admin/category/delete/sub", (req, res) => {
    mysqlDB.query("DELETE FROM CATEGORY_LIST WHERE ID = ?", [req.body.MAIN + "_" + req.body.SUB], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }

    })
})
//category delete main
router.post("/admin/category/delete/main", (req, res) => {
    console.log(req.body);
    mysqlDB.query("DELETE FROM CATEGORY_LIST WHERE MAIN = ?", [req.body.MAIN], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }

    })
})

//category add
router.post("/admin/category/add", (req, res) => {

    mysqlDB.query("INSERT INTO CATEGORY_LIST SET MAIN = ?, SUB = ?, ID = ?", [req.body.MAIN, req.body.SUB, req.body.MAIN + "_" + req.body.SUB], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }

    })
})


//admin item 
router.get("/admin/add", (req, res) => {
    mysqlDB.query("SELECT DISTINCT MAIN FROM CATEGORY_LIST", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            mysqlDB.query("SELECT DISTINCT NAME FROM CAR_BRAND", (err2, row2) => {
                if(err2){
                    console.log(err2);
                }else{
                    mysqlDB.query("SELECT DISTINCT NAME FROM ITEM_BRAND", (err3, row3) => {
                        if(err3){
                            console.log(err3);
                        }else{
                            var data = JSON.stringify(row);
                            data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                            var data2 = JSON.stringify(row2);
                            data2 = data2.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                            var data3 = JSON.stringify(row3);
                            data3 = data3.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                            res.render("item_add.html", { category: data,carbrand:data2,itembrand:data3 });
                        }
                    })
                }
            })
           
        }
    })

})

//item add show sub category
router.post("/item/add/category", (req, res) => {
    var main = req.body.main;
    mysqlDB.query("SELECT DISTINCT SUB FROM CATEGORY_LIST WHERE MAIN = ?", [main], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.stringify(row));
            var data = JSON.stringify(row);
            data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
            res.send(data);
        }
    })
})

//admin item add
router.post("/admin/item/add", upload.fields([{ name: 'item_img', maxCount: 5 }, { name: "file", maxCount: 5 }]), function (req, res) {
    // console.log("add");
    //console.log(req.body);

    //console.log(req.files);
    var item = req.body.item_name;
    var parts_num = req.body.parts_num;
    var price = req.body.item_price;
    var volume = Number(req.body.item_volume);
    //console.log("Number tesst: "+ volume);
    var mainc = req.body.category_main;
    var subc = req.body.category_sub;
    var desc = req.body.item_desc;
    var modelb = req.body.item_model;
    var manufc = req.body.car_brand;
    var itembrand = req.body.item_brand;
    var modeld = req.body.item_version;
    var manufi = req.body.item_manuf;
    var img = ["no_img.png", "no_img.png", "no_img.png", "no_img.png", "no_img.png"];
    if (req.files['item_img']) {
        for (var i = 0; i < req.files['item_img'].length; i++) {
            img[i] = req.files['item_img'][i].filename;
        }
    }


    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashnum = crypto.createHash("sha256").update(item + u_salt).digest("hex");
    var pin = "AM" + String(hashnum);
    if (req.files['file']) {
        var file_list = "";
        for (var j = 0; j < req.files['file'].length; j++) {
            file_list = file_list + req.files['file'][j].filename + ';';
        }
    }

    var c_data = {
        IMG1: img[0],
        IMG2: img[1],
        IMG3: img[2],
        IMG4: img[3],
        IMG5: img[4],
        FILE_LIST: file_list,
        MAIN_C: mainc,
        SUB_C: subc,
        BASE_M: modelb,
        DETAIL_M: modeld,
        CAR_M: manufc,
        ITEM_M: manufi,
        ITEM_NUM: pin,
        BRAND_I: itembrand
    }
    var data = {
        ITEM_NAME: item,
        PARTS_NUM: parts_num,
        PIN: pin,
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
                if (err3) {
                    console.log("err3: " + err3);
                } else {
                    res.send(pin);
                }

            })

        }

    })

})
//file download
router.get("/download", (req, res) => {
    var filename = req.query.file;
    var pin = req.query.pin;
    res.download("./public/stylesheet/img/item/" + filename);
})

//admin item setting
router.post("/admin/item/setting", upload.fields([{name:"img", maxCount:5},{name:"file",maxCount:5}]), function (req, res) {
    console.log(req.body);
    console.log(req.files);
    var filelist=req.body.filelist; 
    var img = ["no_img.png", "no_img.png", "no_img.png", "no_img.png", "no_img.png"];
    var imglist = req.body.imglist.split(";");
    var imgnamelist = req.body.imgnamelist.split(";"); 
    for(var i=0;i<imglist.length;i++){
        if(imglist[i] === "img1"){
            img[0] = imgnamelist[i];
        }else if(imglist[i] === "img2"){
            img[1] = imgnamelist[i];
        }else if(imglist[i] === "img3"){
            img[2] = imgnamelist[i];
        }else if(imglist[i] === "img4"){
            img[3] = imgnamelist[i];
        }else if(imglist[i] === "img5"){
            img[4] = imgnamelist[i];
        }
    }
    if(req.files.img){          
        for(var l=0;l<req.files.img.length;l++){
            for(var k=0;k<5;k++){
                if(img[k]==="no_img.png"){
                    img[k] = req.files.img[l].filename;
                    break;
                }
           }
           
       }
    }
    console.log(img);
    if(req.files.file){ 
             
        for(var j=0;j<req.files.file.length;j++){
            filelist = filelist+req.files.file[j].filename+";";
        }
    }
    console.log(filelist);
    var data = {
        ITEM_NAME: req.body.name,
        PARTS_NUM: req.body.parts_num,
        PRICE: req.body.price,
        VOLUME: Number(req.body.volume),
        ITEM_DESC: req.body.item_desc
    }
    var c_data = {
        IMG1: img[0],
        IMG2: img[1],
        IMG3: img[2],
        IMG4: img[3],
        IMG5: img[4],
        FILE_LIST:filelist,
        BRAND_I: req.body.item_brand,
        MAIN_C: req.body.category_main,
        SUB_C: req.body.category_sub,
        BASE_M: req.body.item_model,
        DETAIL_M: req.body.item_version,
        CAR_M: req.body.car_brand,
        ITEM_M: req.body.item_manuf,
        
    }


    mysqlDB.query("UPDATE ITEM SET ? WHERE PIN = ?", [data, req.body.pin], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            mysqlDB.query("UPDATE ITEMINFO SET ? WHERE ITEM_NUM = ?", [c_data, req.body.pin], function (err2, row2) {
                if (err2) {
                    console.log(err2)
                } else {
                    res.send("success setting");
                }
            })

        }
    })

})


//update account info
router.post("/accout/setting", function (req, res) {
    // console.log("setting");
    var attr = req.body;
    // console.log(attr);

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

//reset email
router.post("/reset/password", (req, res) => {
    var sess = req.session;
    console.log(req.body);
  
    mysqlDB.query("SELECT EMAIL,SALT FROM USER WHERE USER_ID = ?",[req.body.id],(err,row)=>{
        if(err){
            res.send("Please check your ID");
        }else{
            if(!row[0]){
                res.send("Please check your ID");
            }else{
                if(row[0].EMAIL === req.body.to){
                    var ranNum = Math.floor(Math.random()*((1024*1024)+1)).toString(); //0~1024*1024
                    console.log(ranNum);
                    mysqlDB.query("UPDATE USER SET USER_PW = ? WHERE USER_ID = ?",[crypto.createHash("sha512").update(ranNum + row[0].SALT).digest("hex"),req.body.id],(err2,row2)=>{
                        if(err2){
                            res.send("Reset Password error");
                        }else{
                            var data = {
                                fromEmail: req.body.from,
                                toEmail: req.body.to,
                                subject: "Email Verification-AutoinMall",
                                html:  
                                "<p>Your password has been set to <strong>"+ranNum+"</strong></p>" +
                                "<a href='https://autoinmall.com' target = '_blank'>Go to Autoinmall</a>" +
                                "<p>Thank you</p>" +
                                "<p>Autoinmall</p>"
                            };
                            nodemailer.sendmail(data, () => {
                                res.send("");
                            });
                        }
                    })
                   
                }else{
                    res.send("Please check your E-mail");
                }
            }
            
          
        }
    })
})
//send check email before signup
async function checkEmail(param) {
    var data = {
        fromEmail: "service@autoinmall.com",
        toEmail: param.EMAIL,
        subject: "Email Verification-AutoinMall",
        html: "<p>Hello " + param.NAME + "</p>" +
            "<p>Thank you for sign up to AutoinMall!</p>" +
            "<p>Please use the verification URL below to confirm your email address</p>" +
            "<a href='https://autoinmall.com/signup/checkaccount?email=" + param.EMAIL + "&id=" + param.ID + "' target = '_blank'>Welcome and enjoy AutoinMall</a>" +
            "<p>Thank you</p>" +
            "<p>Autoinmall</p>"

    };
    await nodemailer.sendmail(data);
}

//after email check
router.get("/signup/checkaccount", (req, res) => {
    var email = req.query.email;
    var id = req.query.id;
    console.log(email + "   " + id);
    mysqlDB.query("UPDATE USER SET LOCK_ACC = 1 WHERE USER_ID = ? AND EMAIL = ?", [id, email], async function (err, row) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("sign up success");
            //insert signup email
            await res.redirect("/");
        }

    })

})

//signup data
router.post("/signup/confirm", function (req, res) {
    //console.log(req.body);
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

    var userInfo = { USER_ID: userId, USER_PW: hashPassword, EMAIL: userEmail, SALT: u_salt, NAME: userName, PHONE: userPhone, ZIPCODE: userZipcode, ADDRESS: userAddress, TOKEN: usertoken, LOCK_ACC: 0 };

    mysqlDB.query("INSERT INTO USER SET ?", userInfo, function (err, row, fields) {
        if (err) {
            console.log(err);

        }
        else {
            // console.log("sign up success");
            var data = {
                EMAIL: userEmail,
                NAME: userName,
                ID: userId
            }
            checkEmail(data);
            res.send("success");
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
//select model 
router.post("/select/model", (req, res) => {
    var brand = req.body.brand;
    mysqlDB.query("SELECT DISTINCT BASE_M FROM ITEMINFO WHERE CAR_M = ?", [brand], function (err, row) {
        if (err) {
            console.log(err);
        } else {

            res.send(row);
        }
    })
})
//select version
router.post("/select/version", (req, res) => {
    var brand = req.body.brand;
    var model = req.body.model;
    mysqlDB.query("SELECT DISTINCT DETAIL_M FROM ITEMINFO WHERE CAR_M = ? AND BASE_M = ?", [brand, model], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            res.send(row);
        }
    })
})

//show brand
router.get("/brand", (req, res) => {
    var sess = req.session;
    mysqlDB.query("SELECT NAME,IMG FROM CAR_BRAND", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            res.render("brand.html", { username: sess.username, carbrand: data });
        }
    })

})
//search item
router.get("/search", function (req, res) {
    var sess = req.session;
    var category = String(req.query.category).split("_");
    var main = category[0];
    var sub = category[1];
    var brand = req.query.brands;
    sess.carmanufacturer = brand;
    var model = req.query.model;
    var version = req.query.version;
    var parts_num = req.query.parts_num;
    var itembrand = req.query.itembrand;
    mysqlDB.query("SELECT NAME FROM CAR_BRAND",(err_brand,row_brand)=>{
        if(err_brand){
            console.log(err_brand);
        }else{
            var carbrand = JSON.stringify(row_brand);
            carbrand = carbrand.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
            mysqlDB.query("SELECT * FROM MALLIMG",(mallimg_err,mallimg_row)=>{
                if(mallimg_err){
                    console.log(mallimg_err);
                }else{
                    var mallimg = JSON.stringify(mallimg_row);
                    if (itembrand) {
                        //itembrand
                        mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND BRAND_I = ?", [itembrand], function (err, row) {
                            if (err) {
                                console.log(err);
                            } else {
                                //  console.log(itembrand+"\n"+row[0]);
                                var data = JSON.stringify(row);
                                data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg});
                            }
                        })
                    }
                    else {
                
                        if (parts_num) {
                            //parts_num
                            mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND PARTS_NUM = ?", [parts_num], function (err, row) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var data = JSON.stringify(row);
                                    data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                    res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                }
                            })
                        }
                        else if (!req.query.category) {
                            if (!model) {
                                //brand
                
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ?", [brand], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                
                            } else if (!version) {
                                //brand & model
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ? AND BASE_M = ? ", [brand, model], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand ,img_list:mallimg});
                                    }
                                })
                
                            } else {
                                //brand & model & version
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND CAR_M = ? AND BASE_M = ? AND DETAIL_M = ?", [brand, model, version], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                            }
                        } else {
                            if (!brand) {
                                //category
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? ", [main, sub], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                            }
                            else if (!model) {
                                //brand & category
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ? ", [main, sub, brand], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                
                            } else if (!version) {
                                //brand & model & category
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ? AND BASE_M = ? ", [main, sub, brand, model], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                
                            } else {
                                //brand & model & version & category
                                mysqlDB.query("SELECT * FROM ITEM, ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ? AND BASE_M = ? AND DETAIL_M = ?", [main, sub, brand, model, version], function (err, row) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var data = JSON.stringify(row);
                                        data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                        res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                    }
                                })
                            }
                        }
                
                    }
                }
            })
           
        }
    })
   
})


//search item method get
router.get("/shop/item", function (req, res) {
    //console.log("get");
    sess = req.session;
    var main = req.query.main;
    var sub = req.query.sub;
    mysqlDB.query("SELECT NAME FROM CAR_BRAND",(err_brand,row_brand)=>{
        if(err_brand){
            console.log(err_brand);
        }else{
            var carbrand = JSON.stringify(row_brand);
            carbrand = carbrand.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
            mysqlDB.query("SELECT * FROM MALLIMG",(mallimg_err,mallimg_row)=>{
                if(mallimg_err){
                    console.log(mallimg_err);
                }else{
                    var mallimg = JSON.stringify(mallimg_row);
                   // console.log(mallimg);
                    if (sess.carmanufacturer) {
                        mysqlDB.query("SELECT * FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ? AND CAR_M = ?", [main, sub, sess.carmanufacturer], function (err, row) {
                            if (err) {
                                console.log(err);
                            } else {
                                var data = JSON.stringify(row)
                                data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                res.render("shop.html", { username: sess.username, info: data, category: sess.category,carbrand:carbrand,img_list:mallimg });
                            }
                        })
                    } else {
                        mysqlDB.query("SELECT * FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM AND MAIN_C = ? AND SUB_C = ?", [main, sub], function (err, row) {
                            if (err) {
                                console.log(err);
                            } else {
                                var data = JSON.stringify(row)
                                data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                                res.render("shop.html", { username: sess.username, info: data, category: sess.category ,carbrand:carbrand ,img_list:mallimg});
                            }
                        })
                    }
                }
            })
    }
        })
})

router.get("/item/info", function (req, res) {
    // console.log("get");
    sess = req.session;
    var pin = req.query.pin;
    // console.log(pin);
    mysqlDB.query("select * from ITEM,ITEMINFO where PIN = ITEM_NUM AND PIN = ?", [pin], function (err, row) {
        if (err) {
            console.log(err);
        } else {
            console.log(row);

            mysqlDB.query("select * from REVIEW where ITEM_PIN = ?", [pin], function (err2, row2) {
                if (err2) {
                    console.log(err2);
                } else {
                    var data = JSON.stringify(row);
                    data = data.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '&nbsp;').replace(/\\f/gi, ' ');
                    
                    var data2 = JSON.stringify(row2);
                    data2 = data2.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '&nbsp;').replace(/\\f/gi, ' ');
                
                    res.render("item.html", { username: sess.username, info: data, category: sess.category, review: data2, userid: sess.userid });
                }
            })

        }
    })
})

//contact to admin
router.post("/item/contact", (req, res) => {
    var sess = req.session;
    console.log(req.body);
    var data = {
        fromEmail: req.body.to,
        toEmail: req.body.to,
        subject: "Item price enquiry",
        text: "From: " + sess.email + "\n" + "Item name: " + req.body.name + "\nParts number: " + req.body.parts_num + "\nPin: " + req.body.pin
    };
    nodemailer.sendmail(data, () => {
        res.send("success");
    });

})

//review
router.get("/review", (req, res) => {
    var pin = req.query.pin;
    var sess = req.session;
    res.render("review.html", { username: sess.username, pin: pin, user_id: sess.userid });
})
//delete review
router.get("/review/delete", (req, res) => {
    var id = req.query.id;
    mysqlDB.query("DELETE FROM REVIEW WHERE REVIEW_ID = ?", [id], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            res.send("success");
        }
    })
})
//add review
router.post("/review/confirm", (req, res) => {
    //console.log(req.body);
    var pin = req.body.pin;
    var user_id = req.session.userid;
    var user_name = req.session.username;
    var id = user_id + "_" + pin;
    var review = req.body.review;
    var rate = req.body.rate;
    let today = new Date();


    var data = {
        USER_NAME: user_name,
        ITEM_PIN: pin,
        USER_ID: user_id,
        RATE: rate,
        REVIEW: review,
        REVIEW_ID: id,
        REVIEW_DATE: today
    }
    mysqlDB.query("INSERT INTO REVIEW SET ?", [data], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //update rate
            mysqlDB.query("SELECT RATE,REVIEW_NUM FROM ITEM WHERE PIN = ?", [pin], (err2, row2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    //console.log(row2);
                    var num = Number(row2[0].REVIEW_NUM);
                    var avg = Number(row2[0].RATE);
                    var sum = avg * num;
                    num = num + 1;

                    avg = parseFloat((sum + Number(rate)) / num);
                    avg = avg.toFixed(0);
                    //console.log(avg);                    
                    mysqlDB.query("UPDATE ITEM SET RATE = ?, REVIEW_NUM = ? WHERE PIN = ?", [avg, num, pin], (err3, row3) => {
                        if (err3) {
                            console.log(err3)
                        } else {
                            res.send("success");
                        }

                    })
                }
            })

        }
    })
})
//order
router.post("/order", (req, res) => {
    var sess = req.session;
    var date = new Date();
    mysqlDB.query("SELECT DISTINCT ITEM, VOLUME, PRICE, PARTS_NUM, PIN FROM CART WHERE ID = ? AND CART_ID = 'before'", [sess.userid], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.stringify(row);
            mysqlDB.query("SELECT ZIPCODE,ADDRESS FROM USER WHERE USER_ID = ?", [sess.userid], (err2, row2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    var dest = JSON.stringify(row2);
                    res.render("order.html", { username: sess.username, cart: data, email: sess.email, dest: dest });
                  
                    
                }
            })

        }
    })
})
//insert item into cart
router.post("/item/cart", (req, res) => {
    var name = req.body.item_name;
    var price = req.body.item_price;
    var pin = req.body.item_pin;
    var parts_num = req.body.item_parts_num;
    var volume = req.body.item_volume;
    var user = req.session.userid;
   
    var original = req.body.volume_original;
    console.log(original);
    var data;
    //console.log(req.body);
    //no price
    if (price === "") {
        data = {
            
            ID: user,
            ITEM: name,
            PRICE: "no data",
            PIN: pin,
            PARTS_NUM: parts_num,
            VOLUME: volume
        }
    } else {
        price = parseFloat(price) * parseFloat(volume);//new input
        //console.log("have a price");
        data = {
           
            ID: user,
            ITEM: name,
            PRICE: price,
            PIN: pin,
            PARTS_NUM: parts_num,
            VOLUME: volume
        }
    }

    if (!user) {
        res.send("GO SIGNIN");
    } else {
        mysqlDB.query("SELECT * FROM CART WHERE PIN = ? AND CART_ID = 'before'", [pin], (err, row) => {
            if (err) {

                console.log("err1"+err);
            } else {
                //first item input
                console.log(row[0]);
                if (row[0] == null) {
                    //console.log("no item in the cart");
                    mysqlDB.query("INSERT INTO CART SET ?", data, (err2, row2) => {
                        if (err2) {
                            console.log("err2"+err2);

                        } else {
                            //console.log("success to insert item firt time");
                            //update ITEM
                            var new_volume = parseInt(original) - parseInt(volume);
                            mysqlDB.query("UPDATE ITEM SET VOLUME = ? WHERE PIN = ? ", [new_volume, pin], (err4, row4) => {
                                if (err4) {
                                    console.log("err4"+err4);

                                } else {
                                    console.log("finish success");
                                    res.send(name);
                                }
                            })
                        }
                    })
                } else {
                    var new_volume = parseInt(original) - parseInt(volume);
                    volume = parseInt(row[0].VOLUME) + parseInt(volume);//add volume
                    price = parseFloat(price) + parseFloat(row[0].PRICE);//new + before                    
                    mysqlDB.query("UPDATE CART SET VOLUME = ?, PRICE = ? WHERE PIN = ? AND CART_ID = 'before'", [volume, price, pin], (err3, row3) => {
                        if (err3) {
                            console.log(err3);

                        } else {
                            //update ITEM                                        
                            mysqlDB.query("UPDATE ITEM SET VOLUME = ? WHERE PIN = ? AND CART_ID = 'before'", [new_volume, pin], (err4, row4) => {
                                if (err3) {
                                    console.log("err3"+err3);

                                } else {
                                    console.log("finish success");
                                    res.send(name);
                                }
                            })

                        }
                    })
                }
            }

        })



    }
})

//delete item in the cart
router.post("/cart/delete", (req, res) => {
    //console.log(req.body);
    mysqlDB.query("DELETE FROM CART WHERE PIN = ? AND CART_ID = 'before'", [req.body.PIN], (err, row) => {
        if (err) {
            console.log(err);
        } else {

            mysqlDB.query("UPDATE ITEM SET VOLUME = VOLUME + ? WHERE PIN = ? AND CART_ID = 'before'", [req.body.VOLUME, req.body.PIN], (err2, row2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send("success");
                }
            })

        }
    })

})

//shopping mall router
router.get("/shop", function (req, res) {
    //  console.log("get shop");
    sess = req.session;
    sess.carmanufacturer = null;
    var page = req.query.page;
    console.log(page);
    mysqlDB.query("SELECT ID FROM CATEGORY_LIST", (err, row) => {
        if (err) {
            console.log(err);
        } else {
            mysqlDB.query("SELECT NAME FROM CAR_BRAND",(err_brand,row_brand)=>{
                if(err_brand){
                    console.log(err_brand);
                }else{
                    var carbrand = JSON.stringify(row_brand);
                    carbrand = carbrand.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                    var category = JSON.stringify(row);
                    sess = req.session;
                    sess.category = category;
                    mysqlDB.query("SELECT * FROM ITEM,ITEMINFO WHERE PIN = ITEM_NUM",(err2,row2)=>{
                        if(err2){
                            console.log(err3);
                        }else{  
                            console.log(row2);          
                            var data2 = JSON.stringify(row2);
                            data2 = data2.replace(/\\r/gi, '').replace(/\\n/gi, '<br>').replace(/\\t/gi, '_&nbsp;').replace(/\\f/gi, ' ');
                            mysqlDB.query("SELECT * FROM MALLIMG",(mallimg_err,mallimg_row)=>{
                                if(mallimg_err){
                                    console.log(mallimg_err);
                                }else{
                                    var mallimg = JSON.stringify(mallimg_row);
                                    res.render("shop.html", { username: sess.username, info: data2, category: sess.category,carbrand:carbrand,img_list:mallimg });
                                }
                            })
                            
                            
                        }
                    })

               
                }})
        }
    })

})

//shop img
router.get('/admin/shopimg',(req,res)=>{
    mysqlDB.query("SELECT * FROM MALLIMG",(err,row)=>{
        if(err){
            console.log(err);
        }else{
            var data = JSON.stringify(row);
            if(row === ""){
                data={info:"noinfo"};
            }
            res.render('shopimg.html',{img_list:data});
        }
    })
  
})
//shop img setting
router.post('/shopimg/change',shop_img.array("img"),(req,res)=>{
   console.log(req.files);
   console.log(req.body);
   var img1;
   var img2 ;
   var img3; 
   if(req.files){
       if(req.files[0]){img1 = req.files[0].filename;}else{img1 = req.body.org1}
       if(req.files[1]){img2 = req.files[1].filename;}else{img2 = req.body.org2}
       if(req.files[2]){img3 = req.files[2].filename;}else{img3 = req.body.org3}
    mysqlDB.query("UPDATE MALLIMG SET IMG1 = ?, IMG2 = ?, IMG3 = ? WHERE IMG_SET = 'mall'",[img1,img2,img3],(err,row)=>{
        if(err){
            console.log(err);
            res.send("err");
        }else{
            res.send("success");
        }
       } )
   }else{
       res.send("err");
   }
  
     
  
})

//cart router
router.get("/cart", function (req, res) {
    sess = req.session;
    if (!sess.username) {
        res.render("signin.html", { flag: 'no', username: sess.username });
    } else {
        mysqlDB.query("SELECT ITEM, VOLUME, PRICE, PARTS_NUM, PIN FROM CART WHERE CART_ID = 'before' AND ID = ?", [sess.userid], (err, row) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.stringify(row);
                mysqlDB.query("SELECT * FROM RECEIPT,CART WHERE CART_ID = CART_NUM AND ID = ?", [sess.userid], (err2, row2) => {
                    if (err) {
                        console.log(err2);
                    } else {
                        var data2 = JSON.stringify(row2);
                        res.render("cart.html", { username: sess.username, data: data,receipt:data2 });
                    }
                })
        
            }
        })

    }

})
//paypal

router.post("/payments/complete", async (req, res) => {
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: "imp_apikey", // REST API키
                imp_secret: "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f" // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        const getPaymentData = await axios({
            url: "https://api.iamport.kr/payments/" + imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        const order = await Orders.findById(paymentData.merchant_uid);
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액

        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장

            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                    await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name } });
                    // 가상계좌 발급 안내 문자메시지 발송
                    //SMS.send({ text: \`가상계좌 발급이 성공되었습니다. 계좌 정보 \${vbank_num} \${vbank_date} \${vbank_name}\`});
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

//after payment
router.get("/receipt", (req, res) => {
    var id = req.query.id;
    var uid = req.query.uid;
    var total = req.query.total;
    var card = req.query.card;
    var condition = req.query.condition;
    var err = req.query.err;
    var address = req.query.address;
    var zipcode = req.query.zipcode;
    var email = req.query.email;
    var name = req.query.name;
    var date = req.query.date;
    var cart_id = "AM"+req.session.userid+date;
    var data;
    var sess = req.session;
    if (condition === "success") {
        data = {
            condition: condition,
            id: id,
            uid: uid,
            total: total,
            card: card,
            date:date,
            name:name,
            email:email,
            address:address,
            zipcode:zipcode
        }
        var data_set={
            RECIPIENT:sess.userid,
            ORDER_NUM:uid,
            PIN:id,
            Date:date,
            ADDRESS:address,
            ZIPCODE:zipcode,
            EMAIL:email,
            TOTAL:total,
            CARD_APPLY_NUM:card,
            CART_NUM : cart_id
        }
        mysqlDB.query("INSERT INTO RECEIPT SET ?",[data_set],(err,row)=>{
            if(err){
                console.log(err);
            }else{
                //after payment success, set cart id 
                mysqlDB.query("UPDATE CART SET CART_ID = ? WHERE ID = ? AND CART_ID = 'before'",[cart_id,sess.userid],(err3,row3)=>{
                    if(err3){
                        console.log(err3);
                    }else{
                        console.log(data);
                        res.render("receipt.html", { username: sess.username, data: JSON.stringify(data) });
                    }   
                })
               
            }
        })
    } else {
        data = {
            condition: condition,
            err: err,
            name:name
        }
        console.log(data);
        res.render("receipt.html", { username: sess.username, data: JSON.stringify(data) });
    }
    
})
//express run
http.createServer(app).listen(app.get('port'), function () {
    console.log("익스프레스로 웹 서버를 실행함 : " + app.get('port'));
})



