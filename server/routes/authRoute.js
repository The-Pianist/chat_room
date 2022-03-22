const express= require("express");
const router=express.Router();
const authController=require("../controller/authControllers");

router.post("/signup",authController.signUp)
router.post("/login",authController.login)
router.get("/logout",authController.logout)
router.get("/verifyUser", authController.verifyUser)

module.exports=router;