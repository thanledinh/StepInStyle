var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const connectDb = require('../../models/db'); // Import the connectDb function
const authenticateToken = require('../../middleware/auth'); // Import the authenticateToken middleware

router.use(bodyParser.json());

// Thêm sản phẩm
router.post('/add', authenticateToken, async function(req, res, next) {
  const { ProductID, Name, Description, CategoryID, Price, Brand, Variants, Images } = req.body;

  try {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    await productsCollection.insertOne({ ProductID, Name, Description, CategoryID, Price, Brand, Variants, Images });
    res.status(201).send('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error); // Log the error to the console
    res.status(500).send(`Error adding product: ${error.message}`); // Send detailed error message
  }
});

// Sửa sản phẩm
router.put('/update/:id', authenticateToken, async function(req, res, next) {
  const { id } = req.params;
  const { Name, Description, CategoryID, Price, Brand, Variants, Images } = req.body;

  try {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const result = await productsCollection.updateOne(
      { ProductID: id },
      { $set: { Name, Description, CategoryID, Price, Brand, Variants, Images } }
    );

    if (result.matchedCount > 0) {
      res.send('Product updated successfully');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error updating product:', error); // Log the error to the console
    res.status(500).send(`Error updating product: ${error.message}`); // Send detailed error message
  }
});

// Xóa sản phẩm
router.delete('/delete/:id', authenticateToken, async function(req, res, next) {
  const { id } = req.params;

  try {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const result = await productsCollection.deleteOne({ ProductID: id });

    if (result.deletedCount > 0) {
      res.send('Product deleted successfully');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error deleting product:', error); // Log the error to the console
    res.status(500).send(`Error deleting product: ${error.message}`); // Send detailed error message
  }
});

// Hiển thị danh sách sản phẩm
router.get('/list', async function(req, res, next) {
  try {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error); // Log the error to the console
    res.status(500).send('Error fetching products');
  }
});

module.exports = router;