const router = require("express").Router();
const {authController,userController,youtubeController} =require("../controllers")

router.get('/getVedios',youtubeController.getVideoDetails);
router.get('/subscribeToChannel',youtubeController.subscribeToChannel);
router.get('/oauth2callback',youtubeController.oauth2callback);
router.get('/loginWithYoutube',youtubeController.loginWithYoutube);
router.post('/Add_channel',youtubeController.Add_channel);
router.get('/Get_channel',youtubeController.Get_channel);

module.exports = router;
