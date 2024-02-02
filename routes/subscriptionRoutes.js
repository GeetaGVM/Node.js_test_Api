const express = require('express');
const router = express.Router();

const {addSubscriptionPlan,getSubscriptionPlanById,getAllSubscriptionPlans,buySubscription,getAllSubscriptions,unsubscribeSubscription,getUserSubscriptionById,deleteUserSubscription} = require('../controller/SubscriptionController');


router.post('/add-plan',addSubscriptionPlan);
router.post('/buySubscription',buySubscription);
router.post('/getAllSubscriptions',getAllSubscriptions);
router.post('/unsubscribeSubscription',unsubscribeSubscription);
router.get('/getSubscriptionPlanById',getSubscriptionPlanById);
router.get('/getAllSubscriptionPlans',getAllSubscriptionPlans);
router.get('/getUserSubscriptionById',getUserSubscriptionById);
router.get('/deleteUserSubscription',deleteUserSubscription);



module.exports = router;