const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//var passportLocalMongoose = require("passport-local-mongoose");
// User Schema
var StudentsSchema = mongoose.Schema({
    arriveid:String,
    list:
    [
        {name: String,status: {type:Boolean,default:false}}
    ],
    
});
//UserSchema.plugin(passportLocalMongoose)

const Students = module.exports = mongoose.model('Students', StudentsSchema);

