var express = require('express');
var router = express.Router();
let Company = require('../models/company');
router.get('/:id',function(req, res){
	Company.findById(req.params.id, function(err, company){
		if(err){
		  console.log(err);
		} else {
		  res.render('company', {
			title:'Articles',
			company: company
		  });
		}
	  });
	//res.render('index');
});
module.exports=router;