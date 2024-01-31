const Order = require('../dbconfig/Order');
const Product = require('../dbconfig/Product');
const Review = require('../dbconfig/Review');
const { Op} = require('sequelize');
const ReviewImages = require('../dbconfig/ReviewImages');


const ReviewRating = async (req, res, next) => {
    try {
      const { review, rating, targetType, targetId, userId } = req.body;
      const reviewImages = req.files['ReviewImage'];
  
      if (!['Product', 'Order'].includes(targetType)) {
        return res.status(400).json({ error: 'Invalid targetType. Must be either Product or Order.' });
      }
  
      const targetModel = targetType === 'Product' ? Product : Order;
      const targetEntity = await targetModel.findByPk(targetId);
  
      if (!targetEntity) {
        return res.status(404).json({ error: 'Target entity not found.' });
      }
  
      if (targetType === 'Order' && userId) {
        const userHasOrder = await Order.findOne({
          where: { ID: targetId, UserID: userId },
        });
  
        if (!userHasOrder) {
          return res.status(403).json({ error: 'User does not have access to this order.' });
        }
      }
  
      // Create the review and rating
      const reviewRating = await Review.create({
        UserID:userId,
        Review:review,
        Rating:rating,
        targetType,
        TargetID:targetId,
      });

      const reviewImagePaths = [];
      if (reviewImages && Array.isArray(reviewImages)) {
        for (const image of reviewImages) {
          const reviewImage = await ReviewImages.create({
            path: image.path,
            TargetID:targetId
          });
          reviewImagePaths.push(reviewImage.path);
        }
      }
  
      return res.status(201).json({ reviewRating ,reviewImagePaths});
    } catch (error) {
      return next(error);
    }
};

const getAllReviews = async (req, res, next) => {
  try {
    const page = req.body.page ? parseInt(req.body.page, 10) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit, 10) : 10;

    const offset = (page - 1) * limit;

    const allReviews = await Review.findAll({
      include: [
        {
          model: ReviewImages,
          as: 'ReviewImage',
          attributes: ['path'],
        },
      ],
      offset,
      limit,
    });

    return res.status(200).json({
      reviews: allReviews,
      pagination: {
        page,
        limit,
        totalReviews: allReviews.length, 
      },
    });
  } catch (error) {
    return next(error);
  }
};

  


const getReviewsbyid = async (req, res, next) => {
    try {
      const { targetType, targetId } = req.body; //targettype = Product/Order , targetid = ProductId / OrderId 
  
      const allReviews = await Review.findAll({
        include: [
          {
            model: ReviewImages,
            as: 'ReviewImage',
            attributes: ['path'],
          },
        ],
        where: {
          targetType,
          TargetID:targetId,
        },
      });

  
      const ratings = await Review.findAll({
        attributes: ['Rating'],
        where: {
          targetType,
          TargetID:targetId,
          Rating: { [Op.not]: null },
        },
        raw: true, 
      });
  
      const totalRatings = ratings.length;
      const totalRatingSum = ratings.reduce((sum, { Rating }) => sum + Rating, 0);
      const avgRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;
  
      return res.status(200).json({
        reviews: allReviews,
        totalRatings,
        totalReviews: allReviews.length,
        avgRating,
      });
    } catch (error) {
      return next(error);
    }
  };
  
module.exports = { ReviewRating,getAllReviews,getReviewsbyid};
  