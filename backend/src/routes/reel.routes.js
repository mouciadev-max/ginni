const { Router } = require('express');
const reelController = require('../controllers/reel.controller');
const { verifyJWT, verifyRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

// Public routes
router.get('/', reelController.getReels);

// Admin routes
router.use(verifyJWT, verifyRole('ADMIN'));
router.post('/', upload.single('video'), reelController.createReel);
router.delete('/:id', reelController.deleteReel);

module.exports = router;
