const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.get('/', getAllProducts);
router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
