const router = require("express").Router();
const admissionFormController = require("./admissionForm.controller");

router.get("/:id", admissionFormController.getAdmissionForm);
router.put("/:id", admissionFormController.updateAdmissionForm);
router.delete("/:id", admissionFormController.deleteAdmissionForm);

module.exports = router;