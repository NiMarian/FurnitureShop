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

//Schema pentru produse
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
    stock: {
        type: Number,
        required: true,
        default: 0,
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
            subject: 'Abonare confirmată',
            text: `Mulțumim pentru abonarea la Exotique! Acum veți primi oferte și actualizări exclusive. Click pe linkul următor pentru a confirma anularea abonamentului: ${unsubscribeLink}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Mulțumim pentru abonarea la Exotique!</h2>
                <p style="font-size: 16px; color: #555;">
                  Acum veți primi oferte și actualizări exclusive.
                </p>
                <p style="font-size: 16px; color: #555;">
                  Vă așteptăm!
                </p>
                <hr style="border: 0; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #999;">
                  Exotique, București, România<br>
                  Dacă nu v-ați abonat la acest newsletter, Click pe <a href="${unsubscribeLink}" style="color: #1a73e8;">acest link</a> pentru a confirma anularea abonamentului..
                </p>
              </div>
            `
          };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true });
    } catch (error) {
        console.error('Eroare la trimiterea emailului de abonare:', error);
        return res.status(500).json({ success: false, message: 'Eroare la trimiterea emailului de abonare' });
    }
});



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

//Creare Schema pentru promocode
const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Endpoint pentru adăugarea unui promo code
app.post('/addpromocode', async (req, res) => {
    try {
        const promoCode = new PromoCode({
            code: req.body.code,
            discount: req.body.discount,
        });
        await promoCode.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error adding promo code:", error);
        res.status(500).json({ success: false, message: 'Error adding promo code' });
    }
});


const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

// Endpoint pentru verificarea unui promo code
app.post('/checkpromocode', async (req, res) => {
    try {
        let promoCode = await PromoCode.findOne({ code: req.body.code });
        if (promoCode) {
            res.json({ success: true, discount: promoCode.discount });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error("Error checking promo code:", error);
        res.status(500).json({ success: false, message: 'Error checking promo code' });
    }
});

// Endpoint pentru actualizarea stocului
app.post('/updatestock', async (req, res) => {
    try {
        const { id, stock } = req.body;
        const product = await Product.findOneAndUpdate({ id }, { stock }, { new: true });
        if (product) {
            res.json({ success: true, product });
        } else {
            res.status(404).json({ success: false, message: 'Produsul nu a fost găsit' });
        }
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ success: false, message: 'Error updating stock' });
    }
});

//Schema pentru comanda
const orderSchema = new mongoose.Schema({
    contactDetails: {
      email: String,
    },
    shippingDetails: {
      country: String,
      firstName: String,
      lastName: String,
      company: String,
      address: String,
      postalCode: String,
      city: String,
      county: String,
      phone: String,
    },
    deliveryMethod: String,
    paymentMethod: String,
    cardDetails: {
      cardNumber: String,
      expiryDate: String,
      cvv: String,
      cardHolder: String,
    },
    subtotal: Number,
    shippingCost: Number,
    total: Number,
    promoCode: String,
    promoDiscount: Number,
    cartItems: [
        {
          productId: String,
          productName: String,
          quantity: Number,
          price: Number
        }
      ],
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Order = mongoose.model('Order', orderSchema);
  

  //Endpoit pentru plasarea comenzii
  app.post('/placeorder', async (req, res) => {
    try {
        console.log('Order Details:', req.body);
        const { contactDetails, shippingDetails, deliveryMethod, paymentMethod, cardDetails, subtotal, shippingCost, total, promoCode, promoDiscount, cartItems } = req.body;

        const insufficientStockItems = [];
        for (const item of cartItems) {
            const product = await Product.findOne({ id: item.productId });
            console.log(`Product ID: ${item.productId}, Product:`, product);
            if (!product || product.stock < item.quantity) {
                insufficientStockItems.push(product ? product.name : item.productId);
            }
        }

        if (insufficientStockItems.length > 0) {
            return res.status(400).json({ success: false, message: 'Stocul este insuficient pentru următoarele produse: ' + insufficientStockItems.join(', ') });
        }

        const order = new Order({
            contactDetails,
            shippingDetails,
            deliveryMethod,
            paymentMethod,
            cardDetails,
            subtotal,
            shippingCost,
            total,
            promoCode,
            promoDiscount,
            cartItems 
        });

        await order.save();

        for (const item of cartItems) {
            await Product.updateOne(
                { id: item.productId },
                { $inc: { stock: -item.quantity } }
            );
        }

        const formattedCartItems = cartItems.map(item => 
            `${item.productName} - Cantitate: ${item.quantity} - Preț: ${item.price} RON`
        ).join('\n');

        const mailOptions = {
            from: 'contactexotique2@gmail.com',
            to: contactDetails.email,
            subject: 'Confirmare comandă',
            text: `Dragă ${shippingDetails.firstName},\n\nComanda ta a fost plasată cu succes. Detaliile comenzii sunt următoarele:\n\nProduse:\n${formattedCartItems}\n\nSubtotal: ${subtotal} RON\nCost de livrare: ${shippingCost} RON\nDiscount: ${promoDiscount} RON\nTotal: ${total} RON\n\nMulțumim pentru cumpărăturile făcute!\n\nCu stimă,\nEchipa Exotique`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #333; text-align: center;">Confirmare comandă</h2>
                <p style="font-size: 16px; color: #555;">Dragă ${shippingDetails.firstName},</p>
                <p style="font-size: 16px; color: #555;">Comanda ta a fost plasată cu succes. Detaliile comenzii sunt următoarele:</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produs</th>
                      <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Cantitate</th>
                      <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Preț</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartItems.map(item => `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price} RON</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <p style="font-size: 16px; color: #555;">Subtotal: ${subtotal} RON</p>
                <p style="font-size: 16px; color: #555;">Cost de livrare: ${shippingCost} RON</p>
                <p style="font-size: 16px; color: #555;">Discount: ${promoDiscount} RON</p>
                <p style="font-size: 16px; font-weight: bold; color: #333;">Total: ${total} RON</p>
                <p style="font-size: 16px; color: #555;">Mulțumim pentru cumpărăturile făcute!</p>
                <p style="font-size: 16px; color: #555;">Cu stimă,</p>
                <p style="font-size: 16px; color: #555;">Echipa Exotique</p>
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">
                  Exotique, București, România<br>
                  Vă urăm o zi buna in continuare!
                </p>
              </div>
            `
          };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Eroare la plasarea comenzii:', error);
        res.status(500).json({ success: false, message: 'Eroare la plasarea comenzii. Detalii complete: ' + error.message });
    }
});



 //Endpoint pentru actualizarea cantitatii unui produs din cos
app.post('/updatecartitemquantity', fetchUser, async (req, res) => {
    const { itemId, quantity } = req.body;
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[itemId] = quantity;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Updated");
});


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});