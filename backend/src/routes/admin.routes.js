const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verifyJWT);
router.use(verifyRole('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/orders', adminController.getAllOrders);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
