const express = require('express');
const router = express.Router();

// Article Model
let Article = require('../models/articles');
// User Model
let User = require('../models/user');

// Add Route
/*router.get('/articles._id',function(req,res){
res.render('/');
});*/
router.get('/answer/:id', /*ensureAuthenticated,*/ function(req, res){
  Article.findById(req.params.id, function(err, articles){
		if(err){
		  console.log(err);
		} else {
		  res.render('add_answer', {
			id:req.params.id,
			articles: articles
		  });
		}
  
});
});
router.post('/answer/:id', function(req, res){
  //req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  var errors = req.validationErrors();

  if(errors){
    res.render('add_answer', {
      
      errors:errors
    });
  } else {
    Article.findById( req.params.id ,function(err,article)
    {
      console.log(article);
      article.answers.push(req.body.body);
      article.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success_msg','Article Added');
          
          res.redirect('/article/add');
        }
      });
    });

  }
});

router.get('/add', /*ensureAuthenticated,*/ function(req, res){
  Article.find({}, function(err, articles){
		if(err){
		  console.log(err);
		} else {
		  res.render('add_article', {
			title:'Articles',
			articles: articles
		  });
		}
  
});
});




// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  var errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    article.createdAt=Date.now();
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success_msg','Article Added');
        
        res.redirect('/article/add');
      }
    });
  }
});
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, articles){
   
      res.render('edit_article', {
        article:articles,
        //author: user.name
      
    });
  });
});


// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      
    } else {
      req.flash('success_msg', 'Article Updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.get('/delete/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

 
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        req.flash('success_msg','Article Deleted');
        
        res.redirect('/article/add');
     
    });
  });


// Get Single Article
router.get('/art/:id', function(req, res){
  var value=false;
  Article.findById(req.params.id, function(err, article){
    
    console.log("welcome");
    User.findById(article.author, function(err, user){
      if(req.user._id==article.author)
      value=true;

      res.render('article', {
        article:article,
        author: user.name,
        value:value
      });
    });
  });
});



// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports=router;

