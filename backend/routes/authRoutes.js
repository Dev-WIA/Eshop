const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Wishlist Routes
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, addToWishlist).delete(protect, removeFromWishlist);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
