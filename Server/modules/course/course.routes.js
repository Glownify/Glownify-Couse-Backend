const router=require("express").Router();
const courseController = require("./course.controller");   
const auth = require("../../middleware/auth");

router.post("/",auth, courseController.createCourse);
router.get("/trainer",auth, courseController.getTrainerCourses);
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.put("/:id",auth, courseController.updateCourse);
router.delete("/:id",auth, courseController.deleteCourse);   

module.exports = router;
