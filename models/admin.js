const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//var passportLocalMongoose = require("passport-local-mongoose");
// User Schema
var AdminSchema = mongoose.Schema({
	
    name:
    {
        type: String,unique:true
    },
	password: {
		type: String,unique:true
    }
});
//UserSchema.plugin(passportLocalMongoose)

const Admin = module.exports = mongoose.model('Admin', AdminSchema);



module.exports.getAdminByName = function(name, callback){
	var query = {name:name};
	Admin.findOne(query, callback);
}

module.exports.getAdminById = function(id, callback){
	Admin.findById(id, callback);
}

