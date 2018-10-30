var express = require('express');
const request =require('request');
var _ =require('underscore');
var router = express.Router();
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy=require('passport-google-oauth20').Strategy;
var User = require('../models/user');
var Students = require('../models/students');
var gser = require('../models/googleuser');
var Campground = require("../models/campground");
var Company = require("../models/company");
var Arrive = require("../models/arrive");
var async = require("async");
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require("nodemailer");
var crypto = require("crypto"); //part of node so no need to install it
var keys=require('../config/keys');
const mongoose = require("mongoose");
var arrayAverage =(arr)=>{
return _.reduce(arr,function(memo,num){
  return memo+num;

},0)/(arr.length==0?1:arr.length);
}
mongoose.connect('mongodb://localhost/project');
let transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
      user: 'gdivya686@gmail.com', // generated ethereal user
      pass: pwd  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});
let transporte = nodemailer.createTransport({
  service:'gmail',
  auth: {
      user: 'gdivya686@gmail.com', // generated ethereal user
      pass: pwd  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});


//Serializing and Deserilaizing Users
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
});
//list of all companies
router.get('/company', function (req, res) {
  Company.find({}, function(err, company){
		if(err){
		  console.log(err);
		} else {
		  res.render('companies', {
			
			company: company
		  });
		}
});
});
//preparation fro placement
router.get('/prepare',ensure, function (req, res) {
	res.render('prepare');
});

router.get('/companyprofile/:id',ensure, function (req, res) {
  var message=req.flash('success');
  console.log("hi");
  Company.findOne({_id:req.params.id}, function(err, company){
    console.log(req.params.id);
    console.log(company);
   
    var avg= arrayAverage(company.ratingnumber);
		if(err){
		  throw err;
		} else {
		  res.render('companyprofile', {
			avg:avg,
      company: company,
      user:req.user,
      msg:message
		  });
		}
	  });
	
});
router.get('/contactus',function(req,res){

  res.render('contactus');
});
router.post('/review/:id',function(req,res)
{
  console.log("hello");
  console.log(req.body.clickedValue);
  async.waterfall([
    function(callback){
      Company.findOne({'_id':req.params.token},(err,result)=>{
        callback(err,result);
      });
    },
    function(result,callback){
      Company.update({
        '_id':req.params.id
      },
      {
        $push:{rating:{
            username:req.body.sender,
            userreview:req.body.review,
            userrating:req.body.clickedValue

         },
         ratingnumber: req.body.clickedValue
        },
       $inc:{ratingsum:req.body.clickedValue} 
      },(err)=>{
        req.flash('success','Your Review Has Been Added');
      
        res.redirect('/users/company');
      }
      )
    }
  ])
});
//Register
router.get('/register',isregistered, function (req, res) {
	res.render('dashboard');
});
function isregistered(req, res, next){
	if(!req.isAuthenticated()){
		res.render('register');
	} else {
		//req.flash('error_msg','You are not logged in');
		return next();
	}
}


// Login
router.get('/login', ensure,function(req, res){
	Arrive.find({list:{$elemMatch:{name:req.user.username,status:false}}},function(err,student)
      {
        console.log(student);
          res.render('dashboard',{student:student});
      });
	  });
   
function ensure(req, res, next){
	if(!req.isAuthenticated()){
    //res.json({ error: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
           
		res.render('login',{error_msg:"Login First"});
  } 
  
  else {
		
		return next();
	}
}



// Register User
router.post('/register', function (req, res) {
  
	var name = req.body.name;
	var email = req.body.email;
  var username = req.body.username;
  var branch=req.body.branch;
	var password = req.body.password;
	var password2 = req.body.password2;
  var isAdmin;
  if(req.body.username=='ridz')
  isAdmin=true;
  else
  isAdmin=false;
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('branch','Branch is Required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user ) {
					res.render('register', {
            user: user

					});
        }
        
				else {
          
          var year;
          if(req.body.year=3)
            year=true;
            else
            year=false;
					var newUser = new User({
						name: name,
            email: email,
            branch:branch,
						username: username,
            password: password,
            isAdmin: isAdmin,
            year:year,
            temporarytoken : jwt.sign({ username: username, email: email }, secret, { expiresIn: '24h' }) 
          });
         
          
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
            console.log(user);
           

          });
          
    
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'gdivya686@gmail.com', // sender address
        to: 'gdivya686@gmail.com', // list of receivers
        subject: 'Your Activation Link', // Subject line
        text: 'Hello ' + req.body.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:3000/users/activate/' + newUser.temporarytoken,
        html: 'Hello<strong> ' + req.body.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:3000/users/activate/' + newUser.temporarytoken + '">http://localhost:3000/users/activate/newUser.temporarytoken</a>'
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
          
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        req.flash('success_msg', 'You are registered and Check Email for Activation Link');
        res.redirect('/users/login');
        
    });

         
				}
			});
		});
  }
  
});


passport.use(
  new GoogleStrategy({
      // options for google strategy
      clientID: '167185798986-nd3c9u1he061qfbo45k5ljen0kbn16t7.apps.googleusercontent.com',
      clientSecret:'FMDXAhgB5bNvbr9VqHVPN9Lt',
      callbackURL: '/users/google/redirect'
      //profile info that google gives on verifying token
      //done indicates what needs to be done once callback function is fired
  }, (accessToken, refreshToken, profile, done) =>
  

  {
    console.log("hello");
      // check if user already exists in our own db
      gser.findOne({googleid: profile.id}).then((currentgser) => {
          if(currentgser){
              // already have this user
              console.log('user is: ', currentgser);
              done(null, currentgser);
              // do something
          } else {
              // if not, create user in our db
              new gser({
                  googleid: profile.id,
                  username: profile.displayName
              }).save().then((newgser) => {
                  console.log('created new user: ', newgser);
                  done(null, newgser);
                  // do something
              });
          }
      });
  })
);
router.get('/contactus',function(req,res)
{
  res.render('contactus');
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'),(req, res,next) => {
 res.redirect('/profile/');
 
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
          console.log("hello");
					return done(null, user);
				} else {
          
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

  router.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/users/login',failureFlash:true
    }), (req, res) => {
      console.log("hello");
      if (req.user.username=== "ridz") {
        req.user.isAdmin=true;
      }
      Arrive.find({list:{$elemMatch:{name:req.user.username,status:false}}},function(err,student)
      {
        console.log(student);
          res.render('dashboard',{student:student,user:req.user});
      });
      
        
      
    });


router.get('/listofcompanies',function(req,res){
  Arrive.find({}, function(err, arrive){
		if(err){
		  console.log(err);
		} else {
		  res.render('listofcompanies',{
			title:'Articles',
			arrive: arrive
		  });
		}
});
});
router.get('/dashboard',ensure,function(req,res){
 Arrive.find({list:{$elemMatch:{name:req.user.username,status:false}}},function(err,student)
      {
        console.log(student);
        
          res.render('dashboard',{student:student,user:req.user});
        
          
      });
  });
  router.get('/profile',ensure,function(req,res){
    res.render('profile');
    });
    
router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/main');
});



/// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/users/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        //console.log("hello");
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gdivya686@gmail.com',
          pass:pwd
          host: 'smtp.gmail.com'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gdivya686@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) 
    return next(err);
    res.redirect('/users/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.password=req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
              console.log("hey");
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gdivya686@gmail.com',
          pass: pwd
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gdivya686@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/users/login');
  });
});

router.get('/activate/:token',function(req,res){
res.render('active',{token:req.params.token});
});
router.post('/activate/:token',function(req,res)
{
  async.waterfall([
    function(done) {
      User.findOne({ temporarytoken: req.params.token }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        
          user.active=true;
            user.temporarytoken = undefined;
            //user.resetPasswordExpires = undefined;
              //console.log("hey");
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            
          })
        
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gdivya686@gmail.com',
          pass:pwd
        }
      });
      var mailOptions = {
        to: 'gdivya686@gmail.com',
        from: 'gdivya686@mail.com',
        subject: 'Your account activated',
        text: 'Hello,\n\n' +
          'This is a confirmation that  your account   has been activated.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/users/login');
  });
});

router.get("/companyregister/:id",ensure,function(req,res)
{
  Arrive.findOne({_id:req.params.id},function(err,arrive)
  {
    Arrive.find({_id:req.params.id,list:{$elemMatch:{name:req.user.username,status:false}}},function(err,student)
    {
      console.log(student);
      
        
      
        if(student.length!=0)
              {
                req.flash('error_msg',"You Are Already Registered");
                res.redirect('/users/listofcompanies');
              }
              else if(arrive.EligibilityCriteria>req.user.cgpa)
              {
                req.flash('error_msg',"You Are Not Eligible");
          res.redirect('/users/listofcompanies');
              }
              else if(arrive.branch!=req.user.branch)
              {
                req.flash('error_msg',"You Are Not Eligible");
          res.redirect('/users/listofcompanies');
              }
              else
              {
    res.render('companyregister', {
			arrive:arrive
      });
    }
    });
    

  });



});
router.post("/companyregister/:id",function(req,res){

    
      
        Arrive.findOne({_id:req.params.id},function(err,arrive )
        {
          console.log(arrive);
         
              
                
                   
                    
                      arrive.list.push({name:req.body.username});
                      //student.list.push({name:req.body.username});
                      //console.log(student);
                      arrive.save((err)=>{
                        if(err)
                        {
                          console.log(err);
                        }
                        else
                        {
                          res.redirect('/users/listofcompanies');
                        }
                    });
                    
                    
                
                
              
         
          
      
    });

});
// view all notifications
router.get('/notifications', ensure, async function(req, res) {
  res.render('notifications');
});


router.get('/typed',function(req,res)
{
res.render('typed');
});

router.get('/read/:id',function(req,res)
{
  User.findOne({username:req.user.username},function(err,users)
  {
    var i,link;
      for(i=0;i<users.notifications.length;i++)
      {
          if(users.notifications[i]._id==req.params.id)
          {
            users.notifications[i].isRead=true;
            users.save(function(err)
            {
              if(err)
              console.log(err);
            });
            users.length=users.length-1;
            link=users.notifications[i].link;
            break;
          }
      }
      res.redirect(link);
  });
});
   module.exports=router;