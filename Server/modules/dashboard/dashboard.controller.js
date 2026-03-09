// const dashboardService = require('./dashboard.service');
const course=require("../../database/models/Course");
const SubmittedApplication=require("../../database/models/SubmittedApplication");

exports.getDashboardData=async(req,res)=>{
    try{
        const trainerId=req.user.id;
        const courses =await course.find({trainerId});
        const totalCourses=courses.length;
        const totalEnrollments=await SubmittedApplication.countDocuments({trainerId});
        res.status(200).json({
            message:"Dashbord data retrieved successfully",
            dashboardData:{
                totalCourses,
                totalEnrollments,
                courses
            }
    })
}
    catch(error){
        res.status(500).json({
            message:"Error retrieving dashboard data",
            error:error.message
        })
    }


}