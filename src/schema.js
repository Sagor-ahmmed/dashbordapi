const moongoose=require('mongoose');
const {Schema,model}= moongoose
const express= require('express')
const router = express.Router();
const cors = require('cors');
const NodeCache = require( "node-cache" )
const myCache = new NodeCache();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

// product schema
const productSchema = new Schema({},{strict:false});
const Product = model('products', productSchema)

// order

const orderSchema = new Schema({},{strict:false});
const Order= model('orders', orderSchema);

// user schema

const userSchema = new Schema({},{strict:false});
const User = model('users', userSchema);

router.get('/dashbored',async (req, res) => {

   try {
    const cachedData = myCache.get("dashboardData");
    if (cachedData) {
        return res.status(200).send(cachedData);
        
    }
     const [totalProduct,totalOrder,ActiveUser,allRevenue,monthSales,allStock]=await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Order.aggregate([
  {
    $group:{
        _id: null,
        TotalRevenue: {
          $sum: "$totalAmount"
        },
        AverageRevenue: {
          $avg: "$totalAmount"
        },
        HighestRevenue: {
          $max: "$totalAmount"
        },
        totalOrder: {
          $sum: 1
        }
      }
  },
  {
    $project:{
        _id: 0,
        TotalRevenue: 1,
        totalOrder: 1,
        AverageRevenue: 1,
        HighestRevenue: 1
      }
  }]) ,

//   monthSales
Order.aggregate([
  {
    $project: {
        year: {
          $year: "$orderDate"
        },
        month: {
          $month: "$orderDate"
        },
        status: 1,
        totalAmount: 1
      }
  },
  {
    $sort:{
        year: 1,
        month: 1
      }
  }
]),

// stock analytics
Product.aggregate([
  {
    $group:
      {
        _id: null,
        TotalStock: {
          $sum: "$stock"
        },
        LowStock: {
          $sum: {
            $cond: [
              {
                $lt: ["$stock", 10]
              },
              1,
              0
            ]
          }
        },
        OutStock: {
          $sum: {
            $cond: [
              {
                $lte: ["$stock", 0]
              },
              1,
              0
            ]
          }
        }
      }
  },
  {
    $project: {
        _id: 0
      }
  }
])
        


     ])
    
    


    //  dashbored data

       const dashboardAnylaytic = {
        totalProduct,
        totalOrder,
        ActiveUser,
       
        allRevenue,
        monthSales,
        allStock
        
    };
    // cache the data for 10 minutes

    myCache.set("dashboardData", dashboardAnylaytic, 600); 
    // send the response
    res.status(200).send(dashboardAnylaytic);
    
   } catch (error) {
    res.status(500).send(error.message);
    
   }
 
 
   
});


router.get('/product',  async(req, res) => {
    const name = req.query.name;
    console.log(req.query);

    try {
        const products = await Product.find({name: name});
        if (products) {
            res.status(200).send(products);
            
        }
        res.send('Welcome to the products endpoint');
    } catch (error) {
         res.status(500).send(error.message);
        
    }
})

router.post('/product',  (req, res) => {

    try {
        const product=new Product(req.body);
        product.save()
        .then(() => res.status(201).send(product))
    } catch (error) {
          res.status(500).send(error.message);
        
   
        
    }
})
router.post('/order',  (req, res) => {

    try {
        const order=new Order(req.body);
        order.save()
        .then(() => res.status(201).send(order))
    } catch (error) {
          res.status(500).send(error.message);
        
   
        
    }
})

router.post('/user',  (req, res) => {

    try {
        const user=new User(req.body);
        user.save()
        .then(() => res.status(201).send(user))
    } catch (error) {
          res.status(500).send(error.message);
        
   
        
    }
})
 

module.exports= router;