const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

router.post('/address', userController.addAddress);
router.delete('/address/:addressId', userController.removeAddress);

module.exports = router;
