const router = require('express').Router();
const auth = require("../../middleware/auth");
const submittedApplicationController = require("./submittedApplication.controller");

router.post("/", auth, submittedApplicationController.submitApplication);
router.get("/trainer", auth, submittedApplicationController.getApplicationsForTrainer);
router.get("/student", auth, submittedApplicationController.getApplicationForStudent);

module.exports = router;