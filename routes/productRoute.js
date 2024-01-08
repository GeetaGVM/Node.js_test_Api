const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controller/productController');
const {uploadProductMedia} = require('../middleware/upload');

router.post('/add-product',uploadProductMedia,authenticate,authorize(['admin']),createProduct);
router.put('/update-product/:id',uploadProductMedia, authenticate,authorize(['admin']),updateProduct);
router.delete('/delete-product/:id',authenticate,authorize(['admin']), deleteProduct);
router.get('/getallproduct', getAllProducts);
router.get('/getproduct/:id', getProductById);

module.exports = router;

