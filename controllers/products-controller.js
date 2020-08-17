const items = require('../staticitems')
const Products = require("../models/products");
const OrderItems = require('../models/order-item')
const httpError = require("../models/httpError");

// users = [{name: 'sumir', email: 'sumir@gmail.com', password: '12345678', }, ]

exports.getAllItems = async function(req,res,next) {
        let allProducts;
        try {
            allProducts = await Products.findAll();
        } catch (error) {
            return next(new httpError("Could not Fetch Product", 500));
        }

        res.json(allProducts);
    }

exports.getItemByID = async function (req, res, next) {
  const pid = req.params.pid

  let product;
  try {
    product = await Products.findByPk(pid);
  } catch (error) {
    return next(error);
  }

  res.json({ product: product });
};

exports.getUserCart = async function (req, res, next) {

  let cart;
  let products;
  try {
    cart = await req.user.getCart();
    products = await cart.getProducts();
  } catch (error) {
    return next(error);
  }
  console.log(req.user)
    console.log(cart);
  console.log(products)

  res.json(products);
};

exports.postAddCart = async function (req, res, next) {

  let prodId = req.body.id
  let newCart;
  let cart;
  let product;
  let quantity = 1;
  let products;
  let includes;
  try {
    cart = await req.user.getCart();
    product = await Products.findByPk(prodId);
    products = await cart.getProducts({ where : {id: prodId} });

    // includes = products.find((p) => {
    //   // console.log(p.dataValues.id);
    //   return p.id === prodId
    // });
    // console.log(includes)
    if (products.length > 0) {
      product = products[0];
      quantity = product.cartItem.count;
      quantity = quantity + 1;

      // newCart = await cart.addProduct(product, {
      //   through: { count: newQuantity },
      // });
      // console.log(newCart)

    }
    newCart = await cart.addProduct(product, {
      through: { count: quantity },
    });
                   
  } catch (error) {
    return next(error);
  }


  try {
    products = await cart.getProducts();
  } catch (error) {
    return next(error);
  }
  console.log(products)
  res.json(products);
};



exports.deleteCart = async function (req, res, next) {
  const prodId = req.body.id
  let products;
  let product;
  let newCart;
  let cart;
  try {
    cart = await req.user.getCart();
    products = await cart.getProducts({ where: { id: prodId}})

    if (products.length > 0) {
      product = products[0];
      quantity = product.cartItem.count;
      if (quantity > 1){
              quantity = quantity - 1;
              newCart = await cart.addProduct(product, {
                through: { count: quantity },
              });
      } else {
              newCart = await cart.removeProduct(product, {
                through: { count: quantity },
              });
      }

    }

  } catch (error) {
          return next(error);
  }

  try {
    products = await cart.getProducts();
  } catch (error) {
    return next(error);
  }

  res.json(products);
}

// get the cart user -- > get the products from cart -- for every product  create an order item record , and have the count 
exports.postOrder = async function (req, res, next) {
  let cart;
  let products;
  let quantity;
  let order;
  let fetchCart;
  try {
    cart = await req.user.getCart();
    fetchCart = cart;
    products = await cart.getProducts();
    order = await req.user.createOrder();

    await order.addProduct(products.map(product => {
      product.orderItem = { count : product.cartItem.count }
      return product
    }));

    await fetchCart.setProducts(null)

  } catch (error) {
        return next(error);
  }  
  
    try {
      products = await order.getProducts();
    } catch (error) {
      return next(error);
    }

  res.json(products)
}

exports.getOrder = async function (req, res, next) {
  let cart;
  let products;
  let order;
  try {
    order = await req.user.getOrders({
      order: [["createdAt", "DESC"]],
      include: ['products'],
    });
    }
    // products = await order.getProducts();

  catch (error) {
    return next(error);
  }
  
  //  const newOrder = order.map( (orderItem) => 
  //        ( orderItem.getProducts())
  //   )

    // const order1 = order.forEach(element => {
    //   element.getProducts()
  res.json(order);
};