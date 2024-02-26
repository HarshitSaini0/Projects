const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
// const collection = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const templatePath = path.join(__dirname, '../templates')

app.use(express.json())
app.set('view engine', 'hbs');
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/admin', (req, res) => {
    res.render('admin');
})

mongoose.connect('mongodb://localhost:27017/login-sign-up').then(() => {
    console.log("mongodb connected");
})
    .catch(() => {
        console.log('Connection failed!');
    })



const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }

})



const collection = new mongoose.model("collection1", loginSchema);


app.post('/signup', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = {
        name: req.body.name,
        password: hashedPassword,
    }


    const userExist = await collection.findOne({ name: data.name });
    if (!userExist) {
        await collection.insertMany([data]);
    }
    else {
        res.json({ msg: "username already exist!!" });
    }

    res.render('home');
    console.log("yep")

})
app.post('/', async (req, res) => {

    const data = {
        name: req.body.name,
        password: req.body.password,
    }
    const userExist = await collection.findOne({ name: data.name });
    if (userExist) {

        if (await bcrypt.compare(data.password, userExist.password)) {
            res.render('home');
        }
        else {
            res.json({ msg: "password doest match!!" });
        }
    }
    else {
        res.json({ msg: "username doest exist!!" })
    }



    res.render('home');
    console.log("yep")

})


app.post('/admin', async (req, res) => {
    console.log('clicked');
    const data = {
        name: req.body.name,
        password: req.body.password,
    }
    try {
        console.log("here");
        const userExist = await collection.findOne({ name: data.name });
        if (userExist.isAdmin && userExist.password == data.password) {
            console.log("done !")
            res.render('adminPannel');
        }
        else {
            console.log("aahhh!!!")
            res.json({ msg: "do correct things" });
        }
    } catch (error) {
        res.json({ msg: 'Fuck you👎' })
    }

})
const PORT_NO = 5000;

app.listen(PORT_NO, () => {
    console.log('connected to port', PORT_NO)
})
