const express = require('express');
const { addProduct, getProducts , addMultipleProducts , getProductsWithFilter} = require('../controllers/productController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add-product', authMiddleware, addProduct);
router.post('/add-multiple-products' ,authMiddleware , addMultipleProducts)
router.post('/get-filter-product' ,authMiddleware , getProductsWithFilter)
router.get('/', getProducts);

module.exports = router;
