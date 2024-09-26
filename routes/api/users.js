var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
const connectDb = require('../../models/db'); // Import the connectDb function
const authenticateToken = require('../../middleware/auth'); // Import the authenticateToken middleware

router.use(bodyParser.json());

router.post('/register', async function(req, res, next) {
  const { CustomerID, Name, Email, Password, Address } = req.body;
  const hashedPassword = await bcrypt.hash(Password, 10);

  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');
    await usersCollection.insertOne({ CustomerID, Name, Email, Password: hashedPassword, Address });
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async function(req, res, next) {
  const { Email, Password } = req.body;

  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ Email });

    if (user && await bcrypt.compare(Password, user.Password)) {
      const token = jwt.sign({ CustomerID: user.CustomerID }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});


router.get('/profile', authenticateToken, async function(req, res, next) {
  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ CustomerID: req.user.CustomerID });

    if (user) {
      res.json({ CustomerID: user.CustomerID, Name: user.Name, Email: user.Email, Address: user.Address });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user profile');
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;