const path = require('path');
const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('615e49fa7fafbaae4a59e05a')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const corsOptions = {
  origin: "https://testherokualex.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://andrucastro:Fabianvallejo01@cluster0.xfyy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
.connect(
  MONGODB_URL, options
)
.then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'andres',
        email: 'guevaracastroandres@gmail.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  });
  const PORT = process.env.PORT || 5000
  app.listen(PORT);
})
.catch(err => {
  console.log(err);
});

