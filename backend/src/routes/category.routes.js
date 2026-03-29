const { Router } = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);

// Admin routes
router.use(verifyJWT, verifyRole('ADMIN'));
router.post('/', categoryController.addCategory);
router.delete('/:id', categoryController.deleteCategory);
router.post('/:categoryId/subcategories', categoryController.addSubcategory);
router.delete('/subcategories/:id', categoryController.deleteSubcategory);

module.exports = router;
