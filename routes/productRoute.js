const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
  searchProducts
} = require('../controller/productController');
const {uploadProductMedia,uploadReviewMedia} = require('../middleware/upload');
const {ReviewRating,getAllReviews,getReviewsbyid} = require('../controller/ReviewController');





router.post('/add-product',uploadProductMedia,authenticate,authorize(['admin']),createProduct);
router.put('/update-product/:id',uploadProductMedia, authenticate,authorize(['admin']),updateProduct);
router.delete('/delete-product/:id',authenticate,authorize(['admin']), deleteProduct);
router.get('/getallproduct', getAllProducts);
router.get('/getproduct/:id', getProductById);
router.post('/addReview',uploadReviewMedia,ReviewRating);
router.post('/addToWishlist',addToWishlist);
router.post('/removeFromWishlist',removeFromWishlist);
router.post('/getAllReviews',getAllReviews);
router.post('/searchProducts',searchProducts)
router.post('/getReviewsbyid',getReviewsbyid)


module.exports = router;

