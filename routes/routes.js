const express=require("express");
const { getCustomerData } = require("../controller/controller");
const route=express.Router();

route.get("/customers",getCustomerData)


module.exports=route
