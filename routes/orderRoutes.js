const express = require('express');
const router = express.Router();
const {addToCart} = require('../controller/cartController');
const {placeOrder} = require('../controller/OrderController');
const {getAllOrders} = require('../controller/OrderController');
const {updateOrderStatus} = require('../controller/OrderController');
const {getCustomerOrderReport} = require('../controller/OrderController');
const {getProductReport} = require('../controller/productController');
const {getUserReport} = require('../controller/authController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');




router.post('/cart-add',addToCart);
router.post('/place-order',authenticate,placeOrder);
router.get('/getallorder',authenticate,authorize(['admin']),getAllOrders);
router.post('/updateOrderStatus',authenticate,authorize(['admin']),updateOrderStatus);
router.get('/getCustomerOrderReport',authenticate,authorize(['admin']),getCustomerOrderReport);
router.get('/getProductReport',authenticate,authorize(['admin']),getProductReport);
router.get('/getUserReport',authenticate,authorize(['admin']),getUserReport)


module.exports = router;