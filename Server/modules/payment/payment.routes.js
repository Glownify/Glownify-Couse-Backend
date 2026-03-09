const router = require("express").Router();
const PaymentController = require("./payment.controller");

router.get("/", PaymentController.getPaymentDetails);
router.put("/:id", PaymentController.updatePaymentDetails); 
router.delete("/:id", PaymentController.deletePaymentDetails);

module.exports = router;
