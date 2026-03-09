const router= require("express").Router();
const dashboardController=require("./dashboard.controller");

router.get("/",dashboardController.getDashboardData);

module.exports=router;