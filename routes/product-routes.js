const express = require('express')

const placeController = require("../controllers/products-controller")
const checkAuth = require("../middleware/route-protect");

const router = express.Router();


// router.get("/:pid", placeController.getItemByID);
router.get("/", placeController.getAllItems);


router.use(checkAuth);
router.get("/cart", placeController.getUserCart); 
router.post("/cart", placeController.postAddCart);
router.delete("/cart", placeController.deleteCart); 
router.get("/create-order", placeController.postOrder);
router.get("/get-order", placeController.getOrder);

module.exports = router