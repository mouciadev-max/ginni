const { Router } = require('express');
const orderController = require('../controllers/order.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verifyJWT);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Razorpay Payment Routes
router.post('/razorpay/create', orderController.createRazorpayOrder);
router.post('/razorpay/verify', orderController.verifyRazorpayPayment);

// Admin only
router.put('/:id/status', verifyRole('ADMIN'), orderController.updateOrderStatus);

module.exports = router;
