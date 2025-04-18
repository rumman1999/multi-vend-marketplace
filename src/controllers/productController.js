const Product = require("../models/product");
const Vendor = require("../models/vendor");
const redis = require("../config/redis")

exports.addProduct = async (req , res) =>{
    const {name , description  , price , category , stock , images} = req.body;
    const vendorId = req.user.id;

    try {
        if(!vendorId) res.status(404).json({message:'Vendor not found'});

        const product = new Product({
            name , description , price , category , stock , vendor : vendorId , images
        })

        await product.save()
        res.status(201).json({message:"Product added successfully " , product})
    }
    catch(err){
        res.status(500).json({message:`Server Error ${err}`})
    }
}

exports.addMultipleProducts = async (req, res) => {
    const products = req.body.products; // Expecting array of product objects
    const vendorId = req.user.id;
  
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products array is required and must not be empty.' });
    }
  
    try {
      if (!vendorId) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      // Add vendorId to each product object
      const productsToInsert = products.map(product => ({
        ...product,
        vendor: vendorId
      }));
  
      const insertedProducts = await Product.insertMany(productsToInsert);
  
      res.status(201).json({
        message: `${insertedProducts.length} product(s) added successfully`,
        products: insertedProducts
      });
    } catch (err) {
      res.status(500).json({
        message: `Server Error: ${err.message}`,
        error: err
      });
    }
  };
  

exports.getProducts = async (req , res)=>{
    try{
        const products = await Product.find().populate('vendor' , 'name storeName');
        res.json(products)
    }
    catch(err){
        res.status(500).json({
            message:`Server Error ${err}`
        })
    }
}

exports.getProductById = async (req , res) => {
    const {id} = req.params;
    const cacheKey = `product:${id}`;
    try{
        const cached = await redis.get(cacheKey);
        if(cached){
            return res.json({
                source:'cache',
                data : JSON.parse(cached)
            })
        }

        const product = await Product.findById(id);
        if(!product) return res.status(404).json({
            message : 'Product not found'
        })

        await redis.set(cacheKey , JSON.stringify(product) , 'EX' , 120)
    }
    catch(err){
        res.status(500).json({
            error : 'Internal Server Error',
            err : err
        })
    }
}


exports.getProductsWithFilter = async (req, res) => {
    const filters = req.query;

    // Create a cache key based on filters
    const cacheKey = `products:${JSON.stringify(filters)}`;

    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.json({
                source: 'cache',
                data: JSON.parse(cached)
            });
        }

        // Build Mongoose filter object
        const mongoFilter = { ...filters };

        const products = await Product.find(mongoFilter).populate('vendor', 'name storeName');

        // Cache the result for 2 minutes
        await redis.set(cacheKey, JSON.stringify(products), 'EX', 120);

        res.json({ source: 'db', data: products });
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            err: err.message
        });
    }
};
