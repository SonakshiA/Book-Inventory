const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
const multer = require('multer');
const Book = require('./models/book');

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

const dbURI = 'mongodb+srv://sonakshi:1234@cluster0.xwbbzcq.mongodb.net/Book-Inventory?retryWrites=true&w=majority';
mongoose.connect(dbURI).then((res) => {
    console.log("Connected to DB");
    app.listen(port);
}).catch(err => {
    console.log(err);
});

//set storage

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads') //creates a folder called uploads and stores the files in it
    }, 
    filename:(req,file,cb) => {
        cb(null, file.originalname) //first null is for an error if encountered, second is for successful retrieval
    }
});

app.set('view engine','ejs');

const upload = multer({
    storage: Storage
})

app.get('/',(req,res) => {
    Book.find().then((data,err) => {
        if(err){
            console.log(err);
        }
        res.render('homepage',{items: data})
    })
})

app.get('/upload',(req,res) => {
    res.render('form')
})

app.get('/delete/:_id',(req,res)=>{
    const {_id} = req.params;
    Book.deleteOne({_id}).then(() => {
        console.log("Deleted book");
        res.redirect("/");
    }).catch(err => {
        console.log(err);
    })
})

app.post('/upload',upload.single('image'),(req,res,next) => {
   var obj = {
    name : req.body.name,
    author: req.body.author,
    image: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
   }

   Book.create(obj).then((err,item) => {
        if(err){
            console.log(err);
        }
        res.redirect('/');
   })
})