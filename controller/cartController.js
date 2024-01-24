const CartItem = require('../dbconfig/Cartitem');
const Cart = require('../dbconfig/Cart');
const Product = require('../dbconfig/Product');
const message = require('../utils/message');

const addToCart = async (req, res,next) => {
  try {
    const { UserID, ProductID, Quantity } = req.body;

    // Find or create a cart for the user
    const [cart, created] = await Cart.findOrCreate({
      where: { UserID },
      defaults: { UserID },
    });

    // Use the existing or newly created cart ID
    const CartID = cart.ID;

    // Fetch the product details to get the price
    const product = await Product.findByPk(ProductID);

    if (!product) {
      return res.status(404).json({ message : message.error.PRODUCT_NOT_FOUND });
    }

     // Check if the product is in stock
     if (product.IsInStock <= 0) {
      return res.status(400).json({ message: message.error.PRODUCT_OUT_OF_STOCK });
    }

    // Check if the requested quantity is available
    if (Quantity > product.Quantity) {
      return res.status(400).json({ message: message.error.INSUFFICIENT_STOCK });
    }

    // Calculate total amount based on quantity and product price
    const TotalAmount = Quantity * product.Price;

    // Check if the product already exists in the cart
    const existingCartItem = await CartItem.findOne({
      where: { CartID, ProductID },
    });

    if (existingCartItem) {
      // If the product exists, update the quantity and total amount
      existingCartItem.Quantity = Quantity;
      existingCartItem.TotalAmount = TotalAmount;
      await existingCartItem.save();
    } else {
      // If the product doesn't exist, create a new cart item
      await CartItem.create({
        CartID,
        ProductID,
        Quantity,
        TotalAmount,
      });
    }

    res.status(200).json({ message: message.success.ITEM_ADDED_CART});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addToCart,
};
