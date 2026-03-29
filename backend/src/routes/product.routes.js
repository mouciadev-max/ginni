const { Router } = require('express');
const productController = require('../controllers/product.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

// Public routes
router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.use(verifyJWT);
router.use(verifyRole('ADMIN'));

router.post('/categories', productController.createCategory);
router.delete('/categories/:id', productController.deleteCategory);

// Product creation accepts up to 5 images
router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
