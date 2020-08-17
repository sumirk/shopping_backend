const express = require("express");
const adminController = require("../controllers/admin");


const router = express.Router();

router.get("/", adminController.getProducts);

router.post("/", adminController.postAddProduct);

router.patch("/:pid", adminController.updateProduct);

module.exports = router;