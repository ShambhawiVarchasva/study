var express = require('express');
var router = express.Router();
router.get('/',function(req, res){
	res.render('about');
	//res.render('index');
});
module.exports=router;