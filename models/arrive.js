const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//var passportLocalMongoose = require("passport-local-mongoose");
// User Schema
var ArriveSchema = mongoose.Schema({
	companyname: {
		type: String,
        index:true,
        unique:true
	},
    date:
    {
        type:String

    },
    info:
    {
        type:String
        
    },
    purpose:
    {
        type:Boolean
    },
   link:
    {
        type:String
        
    },
   branch:
    {
        type:String
        
    },
    status:
    {
        type:Boolean,
        default:true
    },
    arriveid:
    {
        type:String
    },
    deadline:
    {
        type:Date
    },
    EligibilityCriteria:

    {
        type:Number
    },
    cid:{
        type:String
    },
    
    list:[
        {name:String,status:{type:Boolean,default:false},applied:String}]
    
});
//UserSchema.plugin(passportLocalMongoose)

const Arrive = module.exports = mongoose.model('Arrive', ArriveSchema);

