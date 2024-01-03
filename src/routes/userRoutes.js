const router = require("express").Router();
const {authController,userController} =require("../controllers")
router.get('/getdesignation',userController.getdesignation);
router.get('/getAllUserData',userController.getAllUserData);
router.delete('/DeleteUser',userController.DeleteUser);




module.exports = router;
