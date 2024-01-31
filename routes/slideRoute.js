const express = require('express');
const router = express.Router();
const {addSliderName,updateSliderNamebyid,addImageSetting,
    addSlide} = require('../controller/SlideController');
const {uploadslideImage} = require('../middleware/upload');


router.post('/add-name',addSliderName);
router.post('/updateSliderNamebyid',updateSliderNamebyid)
router.post('/addImageSetting',addImageSetting);
router.post('/add-slide',uploadslideImage,addSlide);

module.exports = router;