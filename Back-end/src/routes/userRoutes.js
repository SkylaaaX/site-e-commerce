const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/orders', userController.listOrders);
router.post('/orders', userController.createOrder);
router.delete('/orders/:idCommande', userController.deleteOrder);

module.exports = router;
