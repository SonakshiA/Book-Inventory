const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookModel = new Schema({
    name:{
        type:String,
        required:true
    },

    author:{
        type:String,
        required:true
    },
    
    image:{
        data:Buffer, //binary data
        contentType: String
    }
});

const Book = mongoose.model('Book',bookModel);
module.exports = Book;