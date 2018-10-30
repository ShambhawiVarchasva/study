var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
router.get('/',function(req, res){
	res.render('contact');
	//res.render('index');
});
router.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
  
      `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
          user: 'gdivya686@gmail.com', // generated ethereal user
          pass: 'daring654'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'gdivya686@gmail.com', // sender address
        to: 'gdivya686@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent'});
    });
    });
module.exports=router;