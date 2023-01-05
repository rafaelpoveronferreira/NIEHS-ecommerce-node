const Product = require('../models/Product');
const router = require('express').Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// Create product
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    let newProduct = new Product(req.body);
    
    try {
        let savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
    } catch(err) {
      return res.status(501).json(err);
    }
})

// Update product
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        let updatedProduct = await Product.findByIdAndUpdate(req.params.id,
             {$set: req.body}, {new:true});
        return res.status(200).json(updatedProduct);
    } catch(err) {
      return res.status(500).json(err);
    }
})


// Delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json(`Product ${req.params.id} has been deleted`);
    } catch (err) {
      return res.status(500).json(err);
    }
  });
  
// Find product
  router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json(err);
    }
  });

//Get all products
  router.get('/', async(req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        
        if(qNew)  {
            var products = await Product.find().sort({createdAt:-1}).limit(1);
        } else if(qCategory) {
            var products = await Product.find({categories: {$in: [qCategory]}});
        } else {
          var products = await Product.find();
        };
      
        return res.status(200).json(products);
    } catch(err) {
      return res.status(500).json(err);
    }
    
  });

module.exports = router;