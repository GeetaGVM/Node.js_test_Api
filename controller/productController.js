const { Op } = require('sequelize');
const Product = require('../dbconfig/Product'); 
const messages = require('../utils/message');
const { ProductMedia } = require('../dbconfig/productMedia');
const ProductReview = require('../dbconfig/ProductReview');
const Wishlist = require('../dbconfig/Wishlist');
const User = require('../dbconfig/User');


//add product
const createProduct = async (req, res, next) => {
  const { ProductName, Description, Price, IsInStock, Quantity,ProductStatus } = req.body;
  try {
  
    if (!ProductName || !Description || !Price || !IsInStock || !Quantity || !req.files) {
      return res.status(400).json({ message: messages.error.MISSING_REQUIRED_FIELDS });
    }

    const productImages = req.files['Productimage'];
    const extraImages = req.files['Extraimages'];

    const mainImagePaths = productImages.map((image) => image.path);
    const extraImagePaths = extraImages.map((image) => image.path);

    const newProduct = await Product.create({
      ProductName,
      Description,
      Price,
      IsInStock,
      Quantity,
      ProductStatus,
    });

    const createProductMediaEntries = async (imagePaths, isMainImage) => {
      for (const imagePath of imagePaths) {
        await ProductMedia.create({
          ProductID: newProduct.ID,
          ImagePath: imagePath,
          Is_Main_Image: isMainImage,
        });
      }
    };

    await createProductMediaEntries(mainImagePaths, true);
    await createProductMediaEntries(extraImagePaths, false);

    const productWithMedia = {
      ...newProduct.toJSON(),
      ProductMedia: await ProductMedia.findAll({ where: { ProductID: newProduct.ID } }),
    };

    return res.status(201).json({ message: messages.success.PRODUCT_CREATED, Product: productWithMedia });

  } catch (error) {
    return next(error);
  }
};



// update product
const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const { ProductName, Description, Price, IsInStock, Quantity } = req.body;
  const productImages = req.files && req.files['Productimage'];
  const extraImages = req.files && req.files['Extraimages'];

  try {
    let product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (ProductName) product.ProductName = ProductName;
    if (Description) product.Description = Description;
    if (Price) product.Price = Price;
    if (IsInStock !== undefined) product.IsInStock = IsInStock;
    if (Quantity) product.Quantity = Quantity;

    await product.save();

    if (productImages || extraImages) {
      await ProductMedia.destroy({ where: { ProductID: productId } });

      const mainImagePaths = productImages ? productImages.map((image) => image.path) : [];
      const extraImagePaths = extraImages ? extraImages.map((image) => image.path) : [];

      const createProductMediaEntries = async (imagePaths, isMainImage) => {
        for (const imagePath of imagePaths) {
          await ProductMedia.create({
            ProductID: productId,
            ImagePath: imagePath,
            Is_Main_Image: isMainImage,
          });
        }
      };

      await createProductMediaEntries(mainImagePaths, true);
      await createProductMediaEntries(extraImagePaths, false);
    }

    const productWithMedia = {
      ...product.toJSON(),
      ProductMedia: await ProductMedia.findAll({ where: { ProductID: productId } }),
    };

    return res.status(200).json({ message: messages.success.PRODUCT_UPDATED, Product: productWithMedia });

  } catch (error) {
    return next(error);
  }
};



// get all product  for user with pagination
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit, search = '' } = req.body;
    const offset = (page - 1) * (limit ? parseInt(limit, 10) : 0);
    const options = {
      attributes: { exclude: ['CreatedAt', 'UpdatedAt'] },
      offset,
      limit: limit ? parseInt(limit, 10) : null,
      where: {
        ProductStatus: 'published', 
      },
    };

    if (search) {
      options.where = {
        [Op.or]: [
          
          { ProductName: { [Op.like]: `%${search}%` } },
          { Description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows: products } = await Product.findAndCountAll(options);

    for (const product of products) {
      const productMedia = await ProductMedia.findAll({
        where: { ProductID: product.ID },
        attributes: ['ImagePath', 'Is_Main_Image'],
      });

      product.dataValues.ProductMedia = productMedia.length > 0 ? productMedia : null;
    }

    const totalPages = limit ? Math.ceil(count / parseInt(limit, 10)) : 1;
    const currentPage = parseInt(page, 10);

    return res.status(200).json({ products, totalPages, currentPage, totalRecords: count });

  } catch (error) {
    return next(error);
  }
};



// for user - get product by id 
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: { exclude: ['CreatedAt', 'UpdatedAt'] },
      where: {
        ProductStatus: 'published',
      },
    });

    if (!product || product.ProductStatus !== 'published') {
      return res.status(404).json({ message: messages.error.PRODUCT_NOT_FOUND });
    }

    const productMedia = await ProductMedia.findAll({
      where: { ProductID: id },
      attributes: ['ImagePath', 'Is_Main_Image'],
    });

    product.dataValues.ProductMedia = productMedia.length > 0 ? productMedia : null;

    return res.status(200).json(product);

  } catch (error) {
    return next(error);
  }
};


// for admin - Delete Product 
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: messages.error.PRODUCT_NOT_FOUND });
    }

    await product.destroy();

    return res.status(200).json({ message: messages.success.PRODUCT_DELETED });

  } catch (error) {
    return next(error);
  }
};


//for admin - for product report 
const getProductReport = async (req, res, next) => {
  try {
      const { page = 1, pageSize = 10, searchTerm, startDate, endDate } = req.body;

      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      const whereConditions = {};
      if (searchTerm) {
          whereConditions[Op.or] = [
              { 'productName': { [Op.like]: `%${searchTerm}%` } },
              { 'description': { [Op.like]: `%${searchTerm}%` } },
          ];
      }
      if (startDate && endDate) {
          whereConditions.createdAt = {
              [Op.between]: [new Date(startDate), new Date(endDate)],
          };
      }

      const products = await Product.findAndCountAll({
        attributes: {
          exclude: [
            'CreatedAt',
            'UpdatedAt',
          ],
        },
          where: whereConditions,
          offset: offset,
          limit: limit,
      });

      const totalPages = Math.ceil(products.count / limit);

      res.status(200).json({
          products: products.rows,
          totalItems: products.count,
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


//for user - review product 
const reviewProduct = async (req, res, next) => {
  try {
    const { userID, productID, rating, review } = req.body;

    const user = await User.findByPk(userID);
    const product = await Product.findByPk(productID);

    if (!user || !product) {
      return res.status(404).json({ MESSAGE : messages.error.NOT_FOUND});
    }

    // Create the product review
    const productReview = await ProductReview.create({
      UserID: userID,
      ProductID: productID,
      Rating: rating,
      Review: review,
    });

    return res.status(201).json({ message : messages.success.PRODUCT_REVIEW_SUCCESS,review:productReview});
  } catch (error) {
    return next(error);
  }
}


//for user- adding to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { userID, productID } = req.body;

    // Check if the product and user exist
    const user = await User.findByPk(userID);
    const product = await Product.findByPk(productID);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found.' });
    }

    // Check if the product is already in the user's wishlist
    const isInWishlist = await Wishlist.findOne({
      where: {
        UserID: userID,
        ProductID: productID,
      },
    });

    if (isInWishlist) {
      return res.status(400).json({ message: 'Product is already in the wishlist.' });
    }

    // Add the product to the user's wishlist
    await Wishlist.create({
      UserID: userID,
      ProductID: productID,
    });

    return res.status(201).json({ message: 'Product added to wishlist successfully.' });
  } catch (error) {
    return next(error);
  }
};


//for user - delete wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const { userID, productID } = req.body;

    // Check if the product and user exist
    const user = await User.findByPk(userID);
    const product = await Product.findByPk(productID);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found.' });
    }

    // Remove the product from the user's wishlist
    await Wishlist.destroy({
      where: {
        UserID: userID,
        ProductID: productID,
      },
    });

    return res.status(200).json({ message: 'Product removed from wishlist successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductReport,
  reviewProduct,
  addToWishlist,
  removeFromWishlist

};
