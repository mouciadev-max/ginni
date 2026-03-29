const { Router } = require('express');
console.log('  8a. Express Router imported');
const authController = require('../controllers/auth.controller');
console.log('  8b. AuthController imported');
const validate = require('../middlewares/validate.middleware');
console.log('  8c. Validate middleware imported');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
console.log('  8d. Auth validation imported');
const { verifyJWT } = require('../middlewares/auth.middleware');
console.log('  8e. Auth middleware imported');

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', verifyJWT, authController.logout);

module.exports = router;
