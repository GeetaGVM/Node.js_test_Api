// orderController.js
const Order = require('../dbconfig/order');
const Cart = require('../dbconfig/cart');
const Product = require('../dbconfig/product');
const User = require('../dbconfig/user');
const messages = require('../utils/message');


const placeOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, billingAddress } = req.body;

    if (!userId || !shippingAddress || !billingAddress) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const cartItems = await Cart.findAll({
      where: { UserId: userId },
      include: [{ model: Product }],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Add items to the cart first.' });
    }

    const totalPrice = cartItems.reduce((sum, cartItem) => sum + cartItem.Product.Price * cartItem.Quantity, 0);


    const order = await Order.create({
      UserId: userId,
      TotalPrice: totalPrice,
      Status: 'Pending', // Default status
      ShippingAddress: shippingAddress,
      BillingAddress: billingAddress,
    });


    await Promise.all(cartItems.map(async (cartItem) => {
      const product = cartItem.Product;
      product.Quantity -= cartItem.Quantity;
      await product.save();
      await cartItem.destroy();
    }));

    res.json({ message: 'Order placed successfully', orderId: order.ID, totalPrice: order.TotalPrice, status: order.Status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  placeOrder,
};



// const placeOrder = async (req, res) => {
//   try {
//     const { userId, shippingAddress, billingAddress } = req.body;

//     // Input validation
//     if (!userId || !shippingAddress || !billingAddress) {
//       return res.status(400).json({ error: 'Invalid input data' });
//     }

//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const cartItems = await Cart.findAll({
//       where: { UserId: userId },
//       include: Product, // Include the associated Product model
//     });

//     if (cartItems.length === 0) {
//       return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
//     }

//     // Calculate total price based on cart items
//     const totalPrice = cartItems.reduce((total, cartItem) => {
//       return total + cartItem.quantity * cartItem.Product.price;
//     }, 0);

//     // Create an order
//     const order = await Order.create({
//       UserId: userId,
//       shippingAddress,
//       billingAddress,
//       totalAmount: totalPrice,
//       status: 'Pending', // Initial order status
//     });

//     // Add cart items to the order
//     await Promise.all(cartItems.map(async (cartItem) => {
//       await order.addProduct(cartItem.Product, { through: { quantity: cartItem.quantity } });
//     }));

//     // Clear the user's cart
//     // await Cart.destroy({ where: { UserId: userId } });

//     res.json({ message: 'Order placed successfully', orderId: order.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// // Place a new order (for users)
// // const placeOrder = async (req, res) => {
// //   try {
// //     const { userId,shippingAddress, billingAddress } = req.body;

// //     const user = await User.findByPk(userId);
    
// //     const cartItems = await Cart.findAll({
// //       where: { UserId: userId },
// //       include: [{ model: Product}],
// //     });

// //     if (cartItems.length === 0) {
// //       return res.status(400).json({ message: messages.error.CART_EMPTY });
// //     }

// //     const orderTotal = cartItems.reduce((total, cartItem) => {
// //       return total + (cartItem.Product.Price * cartItem.Quantity);
// //     }, 0);

// //     const newOrder = await Order.create({
// //       UserId: user,
// //       ShippingAddress: shippingAddress,
// //       BillingAddress: billingAddress,
// //       Total: orderTotal,
// //       Status: 'placed', // You can set the initial status as 'pending'
// //       Products: cartItems.map(cartItem => ({
// //         ProductId: cartItem.Product.ID,
// //         Quantity: cartItem.Quantity,
// //         UnitPrice: cartItem.Product.Price,
// //       })),
// //     }, {
// //       include: [{ association: Order.Products }],
// //     });

// //     // // Clear the user's cart after placing the order
// //     // await Cart.destroy({ where: { UserId: userId } });

// //     res.status(201).json({ message: messages.success.ORDER_PLACED, order: newOrder });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: messages.SERVER_ERROR });
// //   }
// // };


// // // Get all orders (for admin)
// // exports.getAllOrders = async (req, res) => {
// //   try {
// //     // Ensure the user is an admin before allowing access to all orders
// //     if (req.user.Role !== 'admin') {
// //       return res.status(403).json({ message: messages.error.UNAUTHORIZED_ACCESS });
// //     }

// //     const orders = await Order.findAll({
// //       include: [
// //         { model: User, attributes: ['ID', 'Name', 'Email'] },
// //         { model: Product, attributes: ['ID', 'ProductName', 'Price'] },
// //       ],
// //     });

// //     res.status(200).json({ orders });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: messages.SERVER_ERROR });
// //   }
// // };

// // // Update order status (for admin)
// // exports.updateOrderStatus = async (req, res) => {
// //   try {
// //     // Ensure the user is an admin before allowing order status update
// //     if (req.user.Role !== 'admin') {
// //       return res.status(403).json({ message: messages.error.UNAUTHORIZED_ACCESS });
// //     }

// //     const orderId = req.params.orderId;
// //     const { status } = req.body;

// //     const order = await Order.findByPk(orderId, {
// //       include: [{ model: User, attributes: ['ID', 'Name', 'Email'] }],
// //     });

// //     if (!order) {
// //       return res.status(404).json({ message: messages.error.ORDER_NOT_FOUND });
// //     }

// //     order.Status = status;
// //     await order.save();

// //     res.status(200).json({ message: messages.success.ORDER_STATUS_UPDATED, order });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: messages.SERVER_ERROR });
// //   }
// // };

// // // View report of orders, users, and products
// // exports.viewReport = async (req, res) => {
// //   try {
// //     // Ensure the user is an admin before allowing access to reports
// //     if (req.user.Role !== 'admin') {
// //       return res.status(403).json({ message: messages.error.UNAUTHORIZED_ACCESS });
// //     }

// //     const orders = await Order.findAll();
// //     const users = await User.findAll();
// //     const products = await Product.findAll();

// //     res.status(200).json({ orders, users, products });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: messages.SERVER_ERROR });
// //   }
// // };


// module.exports={placeOrder};