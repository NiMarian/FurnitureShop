const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer= require("multer");
const path = require("path");
const cors = require("cors");
const e = require("express");
const { type } = require("os");
const { log, error } = require("console");
const fs = require("fs");
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(cors());

// Conexiune la baza de date MongoDB

const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

mongoose.connect("mongodb+srv://nicutamarian:7SdQPYGTpRgq55Mz@cluster0.50bjgvw.mongodb.net/licenta");

// Creare API

app.get("/",(req,res)=>{
    res.send("Express App is running")
})

// Image Storage

const storage = multer.diskStorage({
    destination: uploadDir,
    filename:(req,file,cb)=>{
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage:storage})

//Upload endpoint imagini

app.use('/images',express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    if (req.file) {
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    } else {
        res.status(400).json({
            success: 0,
            message: 'Image upload failed'
        });
    }
});

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Product = mongoose.model("Product", productSchema);

// Adaugare produs endpoint
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        console.log("Saved");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: 'Error adding product'
        });
    }
});

// Stergere produs endpoint
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({
            success: true,
            id: req.body.id,
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: 'Error removing product'
        });
    }
});

// Get all products endpoint
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products");
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
});

//Schema pentru crearea modelului User

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Registrare user endpoint

app.post('/signup',async(req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Deja exista acest email."})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})


//Creare endpoint pentru logare
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Parola gresita"});
        }
    }
    else{
        res.json({succes:false,errors:"Email gresit"});
    }
})

//Creare endpoint pentru colectii noi 
app.get('/newcollections', async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Colectie noua luata");
    res.send(newcollection);
})

//Creare endpoint pentru popular

app.get('/popularindecoratiuni',async (req,res)=>{
    let products = await Product.find({category:"decoratiuni"});
    let popular_in_decoratiuni = products.slice(0,4);
    console.log("Popular in decoratiuni luat");
    res.send(popular_in_decoratiuni);
})

//Creare middleware pentru a lua user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({errors:"Autentifica-te cu un token valid"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Autentifica-te cu un token valid"})
            
        }
    }
}

//Creare endpoint pentru cartdata
app.post('/addtocart',fetchUser, async(req,res)=>{
    console.log("Adaugat",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Adaugat")
})

//Creare endpoint sa stearga un produs din cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("Sters",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Sters")
})

//Creare endpoint sa ia datele din cartdata
app.post('/getcart', fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

//Schema abonare
const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

//Creare de transporter pentru a trimite emailuri
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'contactexotique2@gmail.com',
        pass: 'trjf oysr kftu ivoc'
    }
});

//Creare endpoint pentru gestionarea abonarii
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    try {
        let existingSubscription = await Subscription.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ success: false, message: 'Email-ul este deja abonat.' });
        }

        const newSubscription = new Subscription({ email });
        await newSubscription.save();

        const unsubscribeLink = `http://localhost:${port}/unsubscribe/${email}`;

        const mailOptions = {
            from: 'contactexotique2@gmail.com',
            to: email,
            subject: 'Abonare confirmata',
            text: `Mulțumim pentru abonarea la Exotique! Acum veți primi oferte și actualizări exclusive. Click pe linkul următor pentru a confirma anularea abonamentului: ${unsubscribeLink}`,
            html: `<p>Mulțumim pentru abonarea la Exotique! Acum veți primi oferte și actualizări exclusive.</p>
                   <p>Click pe <a href="${unsubscribeLink}">acest link</a> pentru a confirma anularea abonamentului.</p>`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true });
    } catch (error) {
        console.error('Eroare la trimiterea emailului de abonare:', error);
        return res.status(500).json({ success: false, message: 'Eroare la trimiterea emailului de abonare' });
    }
});


// Endpoint pentru anularea abonarii
// Endpoint pentru anularea abonarii
app.post('/unsubscribe', async (req, res) => {
    const { email } = req.body;

    try {
        const subscription = await Subscription.findOne({ email });
        if (!subscription) {
            return res.status(400).json({ success: false, message: 'Email-ul nu este abonat.' });
        }

        const unsubscribeLink = `http://localhost:${port}/unsubscribe/${email}`;

        const mailOptions = {
            from: 'contactexotique2@gmail.com',
            to: email,
            subject: 'Anulare abonament',
            text: `Click pe linkul următor pentru a confirma anularea abonamentului: ${unsubscribeLink}`,
            html: `<p>Click pe <a href="${unsubscribeLink}">acest link</a> pentru a confirma anularea abonamentului.</p>`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'Cererea de anulare a fost trimisă. Verificați email-ul pentru confirmare.' });
    } catch (error) {
        console.error('Eroare la trimiterea emailului de anulare a abonării:', error);
        return res.status(500).json({ success: false, message: 'Eroare la trimiterea emailului de anulare a abonării' });
    }
});

// Endpoint pentru confirmarea anularii abonarii
app.get('/unsubscribe/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const subscription = await Subscription.findOneAndDelete({ email });
        if (!subscription) {
            return res.status(400).json({ success: false, message: 'Email-ul nu este abonat.' });
        }

        return res.json({ success: true, message: 'Abonarea a fost anulată cu succes.' });
    } catch (error) {
        console.error('Eroare la anularea abonării:', error);
        return res.status(500).json({ success: false, message: 'Eroare la anularea abonării' });
    }
});


// Endpoint pentru confirmarea anularii abonarii
app.get('/unsubscribe/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const subscription = await Subscription.findOneAndDelete({ email });
        if (!subscription) {
            return res.status(400).json({ success: false, message: 'Email-ul nu este abonat.' });
        }

        return res.json({ success: true, message: 'Abonarea a fost anulată cu succes.' });
    } catch (error) {
        console.error('Eroare la anularea abonării:', error);
        return res.status(500).json({ success: false, message: 'Eroare la anularea abonării' });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});