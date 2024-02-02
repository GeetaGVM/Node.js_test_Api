const sequelize = require('../dbconfig/db'); 
const { Op } = require('sequelize');
const SubscriptionPlan = require('../dbconfig/SubscriptionPlan');
const User = require('../dbconfig/User');
const UserSubscription = require('../dbconfig/UserSubscription');
const messages = require('../utils/message')


//for admin
const addSubscriptionPlan = async (req, res,next) => {
    try {
      const { Name, Price } = req.body;
  
      const existingSubscription = await SubscriptionPlan.findOne({ where: { Name } });
      if (existingSubscription) {
        return res.status(400).json({ error: 'Subscription already exists for this name.' });
      }
  
      const newSubscription = await SubscriptionPlan.create({ Name, Price });
  
      res.status(201).json(newSubscription.toJSON());
    } catch (error) {
      return next(error);
    }

};

//for user
const getAllSubscriptionPlans = async (req, res, next) => {
    try {
      const subscriptionPlans = await SubscriptionPlan.findAll({
        attributes: { exclude: ['CreatedAt', 'UpdatedAt'] },
      });
  
      res.status(200).json({ subscriptionPlans });
    } catch (error) {
      return next(error);
    }
  };
 
//for user
const getSubscriptionPlanById = async (req, res, next) => {
    try {
      const { subscriptionPlanId } = req.body;
  
      const subscriptionPlan = await SubscriptionPlan.findByPk(subscriptionPlanId, {
        attributes: { exclude: ['CreatedAt', 'UpdatedAt'] },
      });
  
      if (!subscriptionPlan) {
        return res.status(404).json({ error: 'Subscription plan not found.' });
      }
  
      res.status(200).json({ subscriptionPlan });
    } catch (error) {
      return next(error);
    }
};

//for user
const buySubscription = async (req, res,next) => {
    try {
      const { userId, subscriptionplanId, billingAddress, paymentMethod } = req.body;
     
      const user = await User.findByPk(userId);
      const subscriptionPlan = await SubscriptionPlan.findByPk(subscriptionplanId);
  
      if (!user || !subscriptionPlan) {
        return res.status(404).json({ error: 'User or subscription not found.' });
      }
  
      const activeUserSubscription = await UserSubscription.findOne({
        where: { UserID: userId, SubscriptionPlanID: subscriptionplanId, Status: 'Active' },
      });
  
      if (activeUserSubscription) {
        return res.status(400).json({ error: 'User already has an active subscription for this plan.' });
      }
  
      const newUserSubscription = await UserSubscription.create({
        UserID: userId,
        SubscriptionPlanID: subscriptionplanId,
        BillingAddress: billingAddress,
        PaymentMethod: paymentMethod,
      });
  
      const responseSubscription = await SubscriptionPlan.findByPk(subscriptionplanId);
  
      res.status(200).json({
        message: messages.success.SUBSCRIPTION_SUCCESS,
        subscriptionPlan: responseSubscription.toJSON(),
        userSubscription: newUserSubscription.toJSON(),
      });
    } catch (error) {
      return next(error)
    }
};


//for admin
const getAllSubscriptions = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.body;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const subscriptions = await UserSubscription.findAndCountAll({
      offset,
      limit,
      include: [
        { model: User, attributes: ['Name'] },
        { model: SubscriptionPlan, attributes: ['Name'] }
      ],
    });

    const subscriptionsWithDetails = subscriptions.rows.map(subscription => ({
      UserName: subscription.User ? subscription.User.Name : null,
      PaymentMethod: subscription.PaymentMethod,
      SubscriptionPlanName: subscription.SubscriptionPlan ? subscription.SubscriptionPlan.Name : null,
      Status: subscription.Status ,
      CreatedAt: subscription.createdAt,
    }));

    res.status(200).json({
      total: subscriptions.count,
      subscriptions: subscriptionsWithDetails,
    });
  } catch (error) {
    return next(error);
  }
};

//for admin
const getUserSubscriptionById = async (req, res, next) => {
    try {
      const { userId } = req.body;
  
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message : messages.error.USER_NOT_FOUND });
      }
  
      const userSubscriptions = await UserSubscription.findAll({
        where: { UserID: userId },
        include: [
          { model: SubscriptionPlan, attributes: ['Name', 'Price'] },
        ],
        order: [['Status', 'DESC'], ['CreatedAt', 'DESC']], 
      });
  
      const activeSubscriptions = userSubscriptions.filter(subscription => subscription.Status === 'Active');
      const historicalSubscriptions = userSubscriptions.filter(subscription => subscription.Status !== 'Active');
  
      const userSubscriptionDetails = {
        User: {
          UserName: user.Name,
          UserEmail: user.Email,
        },
        ...(activeSubscriptions.length > 0 && { 
          ActiveSubscriptions: activeSubscriptions.map(subscription => ({
            BillingAddress: subscription.BillingAddress,
            PaymentMethod: subscription.PaymentMethod,
            SubscriptionPlan: {
              Name: subscription.SubscriptionPlan ? subscription.SubscriptionPlan.Name : null,
              Price: subscription.SubscriptionPlan ? subscription.SubscriptionPlan.Price : null,
            },
            Status: subscription.Status,
            CreatedAt: subscription.createdAt,
          })),
        }),
        SubscriptionHistory: historicalSubscriptions.map(subscription => ({
          BillingAddress: subscription.BillingAddress,
          PaymentMethod: subscription.PaymentMethod,
          SubscriptionPlan: {
            Name: subscription.SubscriptionPlan ? subscription.SubscriptionPlan.Name : null,
            Price: subscription.SubscriptionPlan ? subscription.SubscriptionPlan.Price : null,
          },
          Status: subscription.Status,
          CreatedAt: subscription.createdAt,
        })),
      };
  
      res.status(200).json({ userSubscriptionDetails });
    } catch (error) {
      return next(error);
    }
  };

//for user
const unsubscribeSubscription = async (req, res, next) => {
    try {
      const { userId, subscriptionPlanId } = req.body;
  
      const user = await User.findByPk(userId);
      const subscriptionPlan = await SubscriptionPlan.findByPk(subscriptionPlanId);
  
      if (!user || !subscriptionPlan) {
        return res.status(404).json({ error: 'User or subscription plan not found.' });
      }
  
      const userSubscription = await UserSubscription.findOne({
        where: { UserID: userId, SubscriptionPlanID: subscriptionPlanId },
      });
  
      if (!userSubscription) {
        return res.status(400).json({ error: 'User does not have an active subscription for this plan.' });
      }
  
      await userSubscription.update({ Status :'Unsubscribed' });
  
      res.status(200).json({ message: messages.success.UNSUBSCRIBE });
    } catch (error) {
      return next(error);
    }
};

// for admin
const deleteUserSubscription = async (req, res, next) => {
    try {
      const { userSubscriptionId } = req.body;
  
      const userSubscription = await UserSubscription.findByPk(userSubscriptionId);
  
      if (!userSubscription) {
        return res.status(404).json({ error: 'User subscription not found.' });
      }
  
      await userSubscription.destroy();
  
      res.status(200).json({ message: messages.success.SUBSCRIPTION_DELETED });
    } catch (error) {
      return next(error);
    }
};
  


module.exports = {addSubscriptionPlan,getAllSubscriptionPlans,getSubscriptionPlanById,buySubscription,getAllSubscriptions,unsubscribeSubscription,getUserSubscriptionById,deleteUserSubscription};