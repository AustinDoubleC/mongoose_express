const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")


const Product = require("./models/product")

mongoose.connect('mongodb://localhost:27017/farmStand')
.then(()=>{
    console.log("MONGO CONNECTION OPEN")
}).catch(err=>{
    console.log("MONGO ERROR FOUND")
    console.log(err)
})

app.set("views", path.join(__dirname,"views")); //set the default path
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

const categories = ["fruit", "vegetable", "dairy"]

app.get("/products", async(req,res)=>{
    const {category} = req.query
    if (category){
        const products = await Product.find({category}) //mongoose find
        res.render("products/index",{products, category})
    }else{
        const products = await Product.find({}) //mongoose find
        res.render("products/index",{products, category:"All"})
    }
    
})
app.get("/products/new", (req,res)=>{ //show add product page
    res.render("products/new", {categories})
})

app.get("/products/:id", async(req,res)=>{
   const { id } = req.params;
   const product = await Product.findById(id)
   res.render("products/show",{product})
})

app.get("/products/:id/edit",async(req,res)=>{
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render("products/edit",{product, categories})
})

app.put("/products/:id", async(req, res)=>{
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true})
    res.redirect(`/products/${product._id}`)
})

app.delete("/products/:id", async(req, res)=>{
    const { id } = req.params;
    await Product.findByIdAndDelete(id)
    res.redirect(`/products`)
})

app.post("/products", async(req,res)=>{  //post request to add product
    const newProduct = new Product (req.body)
    await newProduct.save()
    res.redirect(`products/${newProduct._id}`)  //redirect to new product page
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})
