const express = require('express')
const bodyParser = require('body-parser')


const productRoutes = require('./routes/product-routes');
const adminRoutes = require('./routes/admin-routes')
const userRoutes = require("./routes/user-routes");

const sequelize = require('./utils/database')

const Cart = require('./models/carts')
const CartItem = require('./models/cart-item')
const User = require('./models/user')
const Product = require('./models/products')
const Order = require('./models/orders')
const OrderItem = require('./models/order-item')


const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });


app.use("/api/admin", adminRoutes);

app.use("/api/products/", productRoutes);

app.use("/api/users/", userRoutes);


app.use((err, req, res, next) => {
  if (res.headers) {
    next(err);
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})  
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem})
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  // .then((result) => {
  //   return User.findByPk(1);
  //   // console.log(result);
  // })
  // .then((user) => {
  //   if (!user) {
  //     return User.create({ name: "sumir", email: "sumir@test.com", password: "12345678" });
  //   }
  //   return user;
  // })
  // .then((user) => {
  //   // console.log(user);
  //   return user.createCart();
  // })
  .then(app.listen(process.env.PORT || 5000))
  .catch((err) => console.log(err));




