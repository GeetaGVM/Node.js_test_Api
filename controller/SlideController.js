const sequelize = require('../dbconfig/db'); 
const { Op } = require('sequelize');
const Slide = require('../dbconfig/slide');
const SlideImage = require('../dbconfig/slideimage');
const SliderName = require('../dbconfig/SliderName');
const ImageSetting = require('../dbconfig/ImageSetting');
const messages = require('../utils/message');



const addSliderName = async (req, res, next) => {
    const { Name,Order,IsHidden } = req.body;
    console.log("request :",req.body)

    try {
        const newSliderName = await SliderName.create({ Name,Order,IsHidden });

        return res.status(201).json({ sliderName: newSliderName });
    } catch (error) {
        return next(error);
    }
};

const updateSliderNamebyid = async (req, res, next) => {
    const { ID, Name, Order,IsHidden } = req.body;

    try {
        const existingSliderName = await SliderName.findByPk(ID);

        if (!existingSliderName) {
            return res.status(404).json({ message: 'SliderName not found.' });
        }

        existingSliderName.Name = Name || existingSliderName.Name;
        existingSliderName.Order = Order || existingSliderName.Order;
        existingSliderName.IsHidden = IsHidden !== undefined ? IsHidden : existingSliderName.IsHidden;

        await existingSliderName.save();

        return res.status(200).json({ sliderName: existingSliderName });
    } catch (error) {
        return next(error);
    }
};


const addImageSetting = async (req, res, next) => {
    const { SliderNameID, order, width, height, format } = req.body;

    try {
        const associatedSliderName = await SliderName.findByPk(SliderNameID);

        if (!associatedSliderName) {
            return res.status(404).json({message:'Invalid SliderNameID. Please provide a valid SliderNameID.'});
        }

        const existingSetting = await ImageSetting.findOne({
            where: {
                SliderNameID,
                order,
            },
        });

        if (existingSetting) {
            return res.status(404).json({message:'Setting with the same SliderNameID and order already exists.'});
        }

        const newSetting = await ImageSetting.create({
            SliderNameID,
            order,
            width,
            height,
            format,
        });

        return res.status(201).json({ message: messages.success.SETTING_ADDED,setting: newSetting });
    } catch (error) {
        return next(error);
    }
};


const addSlide = async (req, res, next) => {
    const { Header, SubHeader, Text, order, SliderNameID } = req.body;
    const images = req.files['SlideImage'];

    try {
        const associatedSliderName = await SliderName.findByPk(SliderNameID);

        if (!associatedSliderName) {
            return res.status(404).json({message : messages.error.INVALID_SLIDERNAMEID});
        }

        const imageSetting = await ImageSetting.findOne({
            where: {
                SliderNameID,
                order,
            },
        });

        if (!imageSetting) {
            return res.status(404).json({message : messages.error.SETTING_NOT_FOUND});
        }

        const newSlide = await Slide.create({
            Header,
            SubHeader,
            Text,
            order,
            SliderNameID,
        });

        let slideimage = []
        const promises = images.map(async (image) => {
            const newSlideImage = await SlideImage.create({
                SlideID: newSlide.ID,
                ImagePath: image.path,
                ImageOrder: newSlide.order,
            });
            slideimage.push(newSlideImage.ImagePath);

        });

        const slideImages = await Promise.all(promises);

        return res.status(201).json({ Name:associatedSliderName,slide: newSlide,slideimage });
    } catch (error) {
        return next(error);
    }
};


const getSlideById = async (req, res, next) => {
    const slideId = req.params.id; 

    try {
        const slide = await Slide.findByPk(slideId, {
            include: [{ model: SlideImage }], 
        });

        if (!slide) {
            return res.status(404).json({ message: 'Slide not found.' });
        }

        return res.status(200).json({ slide });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    addSliderName,
    updateSliderNamebyid,
    addImageSetting,
    addSlide,
    getSlideById, 
};

