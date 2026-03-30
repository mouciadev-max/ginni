const { Router } = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verifyJWT);

router.post('/orders/:orderId/review', reviewController.submitReview);
router.get('/orders/:orderId/review', reviewController.getReviewByOrder);

module.exports = router;


