const Products = require('../models/products');
const httpError = require('../models/httpError')

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Products.findAll()
  } catch (error) {
    return next(new httpError("Could not save Product", 500));
  }

  res.json({ products: products });
};


exports.postAddProduct = async (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    let product;
    try {
        product = await Products.create({
      title: title,
        price: price,
      imageUrl: imageUrl,
      description: description
    })
    } catch (error) {
      return next(new httpError('Could not save Product', 500))
    }

    res.json({ result: "Product Added" });
}


exports.updateProduct = async (req, res, next) => {
  const pid = req.params.pid;
  const { title, price, imageUrl, description} = req.body
  let product;
  try {
    product = await Products.findByPk(pid)
    if (product){
      product = {
        title,
        price,
        imageUrl,
        description
      }
    } else{
      throw Error('Error updating product');
    }
  } catch (error) {
    return next(new httpError("Could not find Product, please enter the correct product ID", 400));
  }

  try {
    await Products.update(product, { where: {id: pid}})
  } catch (error) {
    return next(
      new httpError(
        "Could not Update product",
        500
      )
    );
  }

  res.json({ result: "Product Updated", product: product });
};