
const express  = require('express');
const mongoose = require('mongoose');

const MenuItem = require('./model/Menuitem.js');
const Category = require('./model/Category');
const User = require('./model/User');

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/', // Change to your preferred destination
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the field name

const conn = "mongodb+srv://pizzata:VWyvLdXItTwQtRh2@cluster0.sapwb2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(conn, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var cors = require('cors');

app.use(
    cors({
      origin: '*',
      // Allow follow-up middleware to override this CORS for options
      preflightContinue: true,
    }),
  );

function md5(str) {
    return require('crypto').createHash('md5').update(str).digest('hex');
}

app.get('/login', async (req, res) => {
    const { email, password } = req.query;

    const user = await User.findOne({ email, password: md5(password) });

    if (user) {
        res.send(user);
    } else {
        res.send('failed');
    }
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get('/ban', async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
        res.send('failed');
        return;
    }

    user.banned = !user.banned;

    try {
        await user.save();
        res.send(user);
    }
    catch (e) {
        res.send(e.message);
    }
});

app.get('/profile', async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne({ email, banned: false });

    if (user) {
        res.send(user);
    } else {
        res.send('failed');
    }
});

app.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.send(categories);
});

app.post('/categories', async (req, res) => {
    const { name } = req.body;

    const category = new Category({ name });

    try {
        await category.save();
        res.send(category);
    }
    catch (e) {
        res.send(e.message);
    }
});

app.put('/categories', async (req, res) => {
    const { _id, name } = req.body;

    const category = await Category.findOne({ _id });

    if (!category) {
        res.send('failed');
        return;
    }

    category.name = name;

    try {
        await category.save();
        res.send(category);
    }
    catch (e) {
        res.send(e.message);
    }
});

app.delete('/categories', async (req, res) => {
    const { _id } = req.body;

    const category = await Category
        .findOne({_id});

    if (!category) {
        res.send('failed');
        return;
    }

    try {
        await category.deleteOne();
        res.send('success');
    }
    catch (e) {
        console.log(e);
        res.send(e.message);
    }
});

app.get('/menuitems', async (req, res) => {


    const items = await MenuItem.find({ });

    res.send(items);
});

app.post('/menuitems',  async (req, res) => {
    upload(req, res, async (err) => {
        const item = new MenuItem({ ...req.body });

        try {
            await item.save();
            res.send(item);
        }
        catch (e) {
            console.log(e);
            res.send(e.message);
        }
    });
});

app.put('/menuitems', async (req, res) => {
    const { _id } = req.body;
    
    try {
        const item = await MenuItem.findByIdAndUpdate(_id, req.body);
        res.send(item);
    } catch (e) {
        console.log(e);
        res.send(e.message);
    }
});

app.delete('/menuitems', async (req, res) => {
    const { _id } = req.body;

    const item = await MenuItem.findOne({ _id });

    if (!item) {
        res.send('failed');
        return;
    }

    try {
        await item.deleteOne();
        res.send('success');
    }
    catch (e) {
        res.send(e.message);
    }
});

app.get('/register', async (req, res) => {
    const { name, email, password, phone, street, postal, city, country, role } = req.query;

    const user = new User({
        name,
        email,
        password: md5(password),
        phone,
        streetAddress: street,
        postalCode: postal,
        city,
        country,
        role
    });

    try {
        await user.save();
        res.send('success');
    }
    catch (e) {
        res.send(e.message);
    }
});

app.put('/update', async (req, res) => {
    const { name, email, phone, streetAddress, postalCode, city, country, } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        res.send('failed');
        return;
    }

    user.name = name;
    user.phone = phone;
    user.streetAddress = streetAddress;
    user.postalCode = postalCode;
    user.city = city;
    user.country = country;

    try {
        await user.save();
        res.send(user);
    }
    catch (e) {
        res.send(e.message);
    }
});

app.get('/restaurants', async (req, res) => {
    const users = await User.find({ role: 'Restaurant' });
    res.send(users);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});