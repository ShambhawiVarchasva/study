var express = require('express');
var router = express.Router();
let Arrive = require('../models/arrive');
let Students = require('../models/students');
let Article = require('../models/articles');
// Get Homepage
router.get('/', ensureAuthenticated,function(req, res){
	
		  res.render('landing');
		  
	//res.send("Welcome");
	//res.render('index');
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		Arrive.find({list:{$elemMatch:{name:req.user.username,status:false}}},function(err,student)
      {
        console.log(student);
          res.render('dashboard',{student:student});
      });
	} 
		//req.flash('error_msg','You are not logged in');
		//res.render('admindashboard');

	else
	{
		return next();
	}
}
module.exports = router;