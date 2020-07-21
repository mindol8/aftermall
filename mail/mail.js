var nodemailer = require('nodemailer');
var fs = require('fs');


var mailsender = {
    sendmail: function(param){
        var transporter = nodemailer.createTransport({           
                service:"Lineworks",
                host:"smtp.worksmobile.com",
                secure:true,
                port:465,
                tls:{
                    rejectUnauthorized:false,
                    ignoreTls:false,
                    requireTls:true,
                    secureProtocol:"TLSv1_method"
                },  
                auth:{
                    user:"service@autoingroup.com",
                    pass:"autoin2020$"
                }
            
        });
        var mailoption={
            from:param.fromEmail,
            to:param.toEmail,
            subject: param.subject,
            text: param.text,
            html:param.html
        };
        
        transporter.sendMail(mailoption,(err,res)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("email success: "+res.response);
            }
        })
    }
}


module.exports = mailsender;
