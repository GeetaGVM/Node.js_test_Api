const { CartItem } = require('../dbconfig/cartitem');
const {Cart} = require('../dbconfig/cart');
const {Product} = require('../dbconfig/product')

const addToCart = async (userId, productId, quantity) => {
  try {
    if (!userId || !productId || !quantity || quantity <= 0) {
      throw new Error('Invalid input data');
    }
    const cart = await Cart.findOne({
      where: { UserId: userId },
    });

    if (!cart) {
      throw new Error('User cart not found');
    }

    const product = await Product.findByPk(productId);

    if (!product || !product.IsInStock) {
      throw new Error('Product not found or out of stock');
    }


    if (quantity > product.Quantity) {
      throw new Error('Requested quantity not available');
    }

    const cartItem = await CartItem.create({
      CartId: cart.id,
      ProductId: productId,
      Quantity: quantity,
    });

    return { success: true, cartItem };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  addToCart,
};
