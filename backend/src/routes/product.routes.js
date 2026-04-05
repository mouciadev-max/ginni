const { Router } = require('express');
const productController = require('../controllers/product.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

// ================= PUBLIC ROUTES =================
router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// ================= ADMIN ROUTES =================
router.post(
  '/categories',
  verifyJWT,
  verifyRole('ADMIN'),
  productController.createCategory
);

router.delete(
  '/categories/:id',
  verifyJWT,
  verifyRole('ADMIN'),
  productController.deleteCategory
);

router.post(
  '/',
  verifyJWT,
  verifyRole('ADMIN'),
  upload.array('images', 5),
  productController.createProduct
);

router.put(
  '/:id',
  verifyJWT,
  verifyRole('ADMIN'),
  upload.array('images', 5),
  productController.updateProduct
);

router.delete(
  '/:id',
  verifyJWT,
  verifyRole('ADMIN'),
  productController.deleteProduct
);

module.exports = router;
