var express = require('express');
var router = express.Router();
/*const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;*/
const mongoose = require("mongoose");
var Students = require('../models/students');
var Admin = require('../models/admin');
var User = require('../models/user');
var Arrive = require('../models/arrive');
var Students=require('../models/students');
var Statistics=require('../models/statistics');

var Company = require('../models/company');
mongoose.connect('mongodb://localhost/project');

  router.get('/link',function(req,res)
  {
    //if(req.user.year==4 && )
    res.render('admin')
  })
router.get('/login',function(req, res){
  
  
	//res.render('addcompany');
	res.render('adminlogin');
	//res.render('index');
});
router.get('/admindashboard',function(req,res){
  
    res.render('admindashboard');
  
	
	//res.render('index');
});
router.get('/addcompany',function(req, res){
  

	
	res.render('addcompany');
	//res.render('index');
});
router.post('/addcompany',function(req,res)
{
  var newCompany = new Company({
    companyname: req.body.name,
    website:req.body.website,
    info:req.body.info
  });
  req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('website', 'Email is required').notEmpty();
  req.checkBody('info', 'Email is not valid').notEmpty();
  
console.log(newCompany);
	
	var er = req.validationErrors();

	if (er) {
		res.render('addcompany', {
			errors: er
		});
	}
  else
  {
  newCompany.save((err)=>{
    if(err)
    {
      console.log(err);
    }
    console.log(newCompany);

    req.flash('success_msg',"Company Data Has Been Added");
    res.redirect('/admin/admindashboard');
  })
  }
});
router.get('/notification',function(req, res){
	res.render('notification');
	//res.render('index');

});

// Get Homepage
router.get('/updates', function(req, res){
	Arrive.find({}, function(err, arrive){
		if(err){
		  console.log(err);
		} else {
      
		  res.render('updates', {
			
			arrive: arrive
		  });
		}
	  });

});


  router.post('/login',function(req, res){
    
 
        Admin.findOne({name:req.body.name,password:req.body.password},function(err,admin)
        {

          console.log(admin);
          //console.log(req.body);
          //console.log(req.body.password);
          if(err)
          {
            console.log(err);
          }
          if(!admin)
          {
            req.flash('success_msg', 'Invalid');
            res.render('adminlogin');

          }
          else
          {
            Arrive.find({},function(err,student)
            {
              
              res.render('admindashboard',{student:student});
            });
            //req.flash('success_msg', 'S');
         
          }
        });
    });
    router.get('/delete', function(req, res){
      
      Arrive.findOne({companyname:req.body.companyname,purpose:req.body.purpose},function(err,arrive)
      {
          arrive.status=false;


      });
      /*let query = {companyname:req.body.companyname,purpose:req.body.purpose};
    
     
          Arrive.remove(query, function(err){
            if(err){
              console.log(err);
            }*/

            //req.flash('success_msg',' Deleted');
            
            res.redirect('/admin/updates');
         
        });
      
    router.get('/add',function(req,res){
      res.render('addarrive');
    });
    router.post('/add', function(req, res){
      
      req.checkBody('name','Title is required').notEmpty();
      //req.checkBody('author','Author is required').notEmpty();
      req.checkBody('info','Body is required').notEmpty();
      req.checkBody('date','Body is required').notEmpty();
      req.checkBody('link','Body is required').notEmpty();
      req.checkBody('purpose','Body is required').notEmpty();
      req.checkBody('branch','Body is required').notEmpty();
      req.checkBody('ec','Body is required').notEmpty();
      // Get Errors
      console.log("hello");
      var errors = req.validationErrors();
    
      if(errors){
        res.render('addarrive', {
          
          errors:errors,
          msg:"Missing Credentials"
        });
      } else {
        var cid;
        let arrive = new Arrive();
        arrive.companyname = req.body.name;
        arrive.info = req.body.info;
        arrive.date = req.body.date;
        Company.findOne({companyname:req.body.name},function(err,company)
        {
          console.log(company);
          if(company==null)
          {
            req.flash("error","First Fill Form For Company In Add Company");
            res.redirect("/admin/updates");
          }
          else
          {
          cid=company._id;
        
          arrive.cid=cid;
          console.log(cid);
        arrive.EligibilityCriteria=req.body.ec;
        var str=req.body.purpose;
       var str1=str.toUpperCase();
        if(str1=="INTERN")

        arrive.purpose = true;
        else
        arrive.purpose=false;
        arrive.branch = req.body.branch;
        arrive.link = req.body.link;
        //article.createdAt=Date.now();
        
        arrive.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            //console.log(arrive);
            //req.flash('success_msg','Company Added');
            var student=new Students({arriveid:arrive._id});
            student.save(function(err){
              if(err)
              {
                console.log(err);
              }
            });
            console.log(student);
            console.log(arrive);
            User.find({},function(err,users)
            {
              //console.log(users);
              var i;
              for(i=0;i<users.length;i++)
               { users[i].notifications.push({notification:"Hey   "+ users[i].name +"   "+ arrive.companyname+ "is coming on " +arrive.date + "Apply soon.", isRead:false,link:"/users/listofcompanies",time:Date.now()});
               users[i].length=users[i].length+1;
                users[i].save(function(err){
                  console.log(err);
                });
                  //console.log(users[i].notifications);
            }
            
            });
            res.redirect('/admin/updates');
          }
        });
      }
        });
        
        
      }
    });
    router.get('/registered/:id',function(req,res)
    {
      var dps=[];
      console.log("hi");
      Arrive.findOne({_id:req.params.id},function(err,student)
      {
        var i;
        console.log(student);
        for(var i=0;i<student.list.length;i++)
        {
          console.log(student.list[i].name);
          User.findOne({username:student.list[i].name},function(err,users)
          {
              dps.push(users);
          });
        }
        console.log(dps);
          res.render('registered',{student:student,sid:req.params.id,dps:dps});
        
        
      });
      
    });
    router.get('/registerededit/:id',function(req,res)
    {
      console.log("hi");
      Arrive.findOne({_id:req.params.id},function(err,student)
      {
        console.log(student);
          res.render('registerededit',{student:student,sid:req.params.id});
        
        
      });
      
    });
    router.post('/registerededit/:id',function(req,res)
    {
      let arrive = {};
  arrive.info= req.body.title;
  arrive.date = req.body.date;
  arrive.EligibilityCriteria = req.body.ec;
  var str=req.body.purpose;
  var str1=str.toUpperCase();
   if(str1=="INTERN")

   arrive.purpose = true;
   else
   arrive.purpose=false;
  let query = {_id:req.params.id}

  Arrive.update(query, arrive, function(err){
    if(err){
      console.log(err);
      
    } else {
      req.flash('success_msg', 'Arrive Updated');
      res.redirect('/admin/updates');
    }
  });
    });
    router.get('/logout', function (req, res) {
      req.logout();
    
      req.flash('success_msg', 'You are logged out');
    
      res.redirect('/main');
    });
    router.get('/updates/:id', function(req, res){
     
      Arrive.findOne({_id:req.params.id},function(err,arrive)
      {
          arrive.status=false;
        console.log(arrive);
        arrive.save((err)=>{
          if(err)
          {
            console.log(err);
          }
          else
          {
            res.redirect('/admin/updates');
          }
      });
            
    });
         
        });
        
       
      router.get('/chart',function(req,res)
      {
        res.render('chart');
      });
      router.post('/chart',function(req,res)
      {
          var newchart=new Statistics({branch:req.body.branch,max_ctc:req.body.max_ctc,placed:req.body.placed});
          newchart.save((err)=>{
          if(err)
          {
            console.log(err);
          }
          else
          {
            res.redirect('/statistics');
          }
      });
      });
    router.post('/absent/:name',function(req,res)
    {
      User.findOne({username:req.params.name},function(err,users)
      {
        users.absent=users.absent+1;
        console.log(req.body.iden);
        users.save((err)=>
        
        res.redirect('/admin/registered/'+req.body.iden)
        );
      });
    });
    router.get('/selected/:id',function(req,res)
    {
      Arrive.findOne({_id:req.params.id},function(err,arrive)
      {
          res.render('studentsselected',{student:arrive});
      }
    );
    });
    router.post('/shortlisted/:id',function(req,res)
    {
      console.log(req.body.dpi);
      res.redirect('/admin/registered/'+req.params.id);
    });
module.exports=router;