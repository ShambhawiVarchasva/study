const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//var passportLocalMongoose = require("passport-local-mongoose");
// User Schema
var CompanySchema = mongoose.Schema({
	companyname: {
		type: String,
		index:true
    },
    website:
    {
type:String
    },
    info:String,
    
        
    rating:
    [
        {username: String,userrating: Number,userreview:String}
    ],
    ratingnumber:[Number],
    ratingsum:{type:Number,default:0}

    
});
//UserSchema.plugin(passportLocalMongoose)

const Company = module.exports = mongoose.model('Company', CompanySchema);

