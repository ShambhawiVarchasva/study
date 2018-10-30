var express = require('express');
var router = express.Router();
router.get('/',function(req, res){
	res.render('main');
	//res.render('index');
});
router.get('/pastrecruiters',function(req, res){
	res.render('pastrecruiters');
	//res.render('index');
});


module.exports=router;