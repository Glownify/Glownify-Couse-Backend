const auth = require("./middleware/auth");
// const isTrainer = require("./middleware/checkRole");
const router = require("express").Router();


router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/categories", require("./modules/category/category.routes"));
router.use("/courses", require("./modules/course/course.routes"));
router.use("/admission-forms", require("./modules/admissionForm/admissionForm.routes"));
router.use("/submitted-applications", require("./modules/submittedApplication/submittedApplication.routes"));
router.use("/dashboard", auth, require("./modules/dashboard/dashboard.routes"));
// router.use("/payments", require("./modules/payment/payment.routes"));


module.exports = router;