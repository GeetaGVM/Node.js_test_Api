const Order = require('../dbconfig/Order');
const Cart = require('../dbconfig/Cart');
const Product = require('../dbconfig/Product');
const User = require('../dbconfig/User');
const messages = require('../utils/message');
const CartItem = require('../dbconfig/Cartitem');
const sequelize = require('../dbconfig/db'); 
const { Op } = require('sequelize');
const OrderItem = require('../dbconfig/OrderItem');

//for user - place order
const placeOrder = async (req, res, next) => {
    try {
      const { UserID, ShippingAddress, BillingAddress } = req.body;
  
      // Find the user's cart and associated cart items
      const cart = await Cart.findOne({
        where: { UserID },
        include: [{ model: CartItem, include: [Product] }],
      });
  
      if (!cart) {
        return res.status(404).json({ message : messages.error.CART_NOT_FOUND });
      }
  
      const GrandTotal = cart.CartItems.reduce((total, cartItem) => total + parseFloat(cartItem.TotalAmount), 0);
      const totalItems = cart.CartItems.reduce((total, cartItem) => total + cartItem.Quantity, 0);

      // Create an order record
      const order = await Order.create({
        UserID,
        GrandTotal,
        ShippingAddress,
        BillingAddress,
        Status: 'pending',
        PaymentStatus: 'pending',
        TotalItems: totalItems

      });
  
      // Update product quantities, associate cart items with the order
      await Promise.all(
        cart.CartItems.map(async (cartItem) => {
          const product = await Product.findByPk(cartItem.ProductID, {
          });
  
          if (product) {
  
            const product = cartItem.Product;
            product.Quantity -= cartItem.Quantity;
            await product.save();

            const orderItem = await OrderItem.create({
              OrderID: order.ID,
              ProductID: product.ID,
              UserID, UserID,
              Quantity: cartItem.Quantity,
              TotalAmount: parseFloat(cartItem.TotalAmount),
            });

            await cartItem.update({ OrderID: order.ID });
  
            cartItem.dataValues.Product = product;
          }
        })
      );
  
      await CartItem.destroy({
        where: { CartID: cart.ID },
      });
  
      await Cart.destroy({
        where: { UserID },
      });
  
      res.status(200).json({ message: messages.success.ORDER_SUCCESS, orderdetails: { order, products: cart.CartItems } });
    } catch (error) {
      return next(error);
    }
};
  

//for admin- get all orders
const getAllOrders = async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        include: [
            { model: User, attributes: ['ID', 'Name', 'Email'] },
          ],
      });
      
      res.status(200).json({ orders });
    } catch (error) {
      return next(error);
    }
  };
 
// update order status admin  
const updateOrderStatus = async (req, res,next) => {
    try {
     
      const { orderID } = req.body;
      const { status } = req.body;
  
      const order = await Order.findByPk(orderID, {
        include: [{ model: User, attributes: ['ID', 'Name', 'Email'] }],
      });
  
      if (!order) {
        return res.status(404).json({ message: messages.error.ORDER_NOT_FOUND });
      }
  
      order.Status = status;
      await order.save();
  
      res.status(200).json({ message: messages.success.ORDER_STATUS_UPDATED, order });
    } catch (error) {
     return next(error);
    }
};



//user order report for admin  
const getCustomerOrderReport = async (req, res, next) => {
    try {
      const { page = 1, pageSize = 10, searchTerm, startDate, endDate,Status } = req.body;
    
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);
  
      const whereConditions = {};
      if (searchTerm) {
        whereConditions[Op.or] = [
          { '$User.Name$': { [Op.like]: `%${searchTerm}%` } },
          { '$User.Email$': { [Op.like]: `%${searchTerm}%` } },
        ];
      }
      if (startDate && endDate) {
        whereConditions.CreatedAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      if (Status) {
        whereConditions.Status = { [Op.eq]: Status };
      } 
          
      const orders = await Order.findAndCountAll({
        attributes: [
          'UserID',
          'Status',
          [sequelize.fn('COUNT', sequelize.col('Order.ID')), 'TotalOrders'],
          [sequelize.fn('SUM', sequelize.col('Order.GrandTotal')), 'TotalAmount'],
          [sequelize.fn('SUM', sequelize.col('Order.TotalItems')), 'TotalItems'], // Assuming TotalItems is a field in the Order model

        ],
        include: [
          {
            model: User,
            attributes: ['ID','Name','Email'],
          },
        ],
        where: whereConditions,
        group: ['Order.UserID','Order.Status'],
        offset: offset,
        limit: limit,
      });
  
      const totalPages = Math.ceil(orders.count / limit);
    
      const formattedOrders = orders.rows.map(order => ({
        UserName: order.User.Name,
        Email: order.User.Email,
        NoOfOrders: order.get('TotalOrders'),
        NoOfProducts : order.get('TotalItems'),
        TotalAmount: order.get('TotalAmount'),
        Status: order.Status,
      }));
      
      res.status(200).json({
        orders: formattedOrders,
        pagination: {
          page: parseInt(page),
          pageSize: limit,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      return next(error);
    }
};


// //for user - review order 
// const  ReviewOrder = async (req, res,next) => {
//   try {
//     const { userID, orderID, rating, review } = req.body;
//     console.log("userid :",userID)

//     const user = await User.findByPk(userID);
//     const order = await Order.findByPk(orderID);

//     if (!user || !order) {
//       return res.status(404).json({ message : messages.error.NOT_FOUND });
//     }

//     const userHasOrder = await Order.findOne({
//       where: {
//         UserID: userID,
//         ID: orderID,
//       },
//     });

//     if (!userHasOrder) {
//       return res.status(400).json({ message: 'User does not have the specified order.' });
//     }

//     // Create the order review
//     const orderReview = await OrderReview.create({
//       UserID : userID,
//       OrderID: orderID,
//       Rating: rating,
//       Review: review,
//     });

//     return res.status(201).json({ messaage : messages.success.ORDER_REVIEW_SUCCESS , review:orderReview });
//   } catch (error) {
//     return next(error)
//   }
// };

  
  
module.exports={placeOrder,getAllOrders,updateOrderStatus,getCustomerOrderReport};