var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const connectDb = require('../../models/db'); // Import the connectDb function
const authenticateToken = require('../../middleware/auth'); // Import the authenticateToken middleware

router.use(bodyParser.json());

// Thêm danh mục
router.post('/add', authenticateToken, async function(req, res, next) {
  const { CategoryID, Name, Description } = req.body;

  try {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.insertOne({ CategoryID, Name, Description });
    res.status(201).send('Category added successfully');
  } catch (error) {
    res.status(500).send('Error adding category');
  }
});

// Sửa danh mục
router.put('/update/:id', authenticateToken, async function(req, res, next) {
  const { id } = req.params;
  const { Name, Description } = req.body;

  try {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const result = await categoriesCollection.updateOne(
      { CategoryID: id },
      { $set: { Name, Description } }
    );

    if (result.matchedCount > 0) {
      res.send('Category updated successfully');
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    res.status(500).send('Error updating category');
  }
});

// Xóa danh mục
router.delete('/delete/:id', authenticateToken, async function(req, res, next) {
  const { id } = req.params;

  try {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const result = await categoriesCollection.deleteOne({ CategoryID: id });

    if (result.deletedCount > 0) {
      res.send('Category deleted successfully');
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting category');
  }
});

// Hiển thị danh sách danh mục
router.get('/list', async function(req, res, next) {
  try {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    res.json(categories);
  } catch (error) {
    res.status(500).send('Error fetching categories');
  }
});

module.exports = router;