require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
// Database
const database = require("./database");

// Initialization
const booky = express();

//configuration
booky.use(express.json());






//BOOKS///////////////////////////////////////////////

/*
Route         :   /
Description   :  Get all books
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/", (req, res) => {
  return res.json({ books: database.books });
});



/*
Route         :   /is
Description   :  Get specific  books 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  GET
*/
booky.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0){
    return res.json({ error: `No book found for the ISBN ${req.params.isbn}`});
  }
  return res.json({ book: getSpecificBook });
});



/*
Route         :   /c
Description   :  Get specific books based on category
Access        :  PUBLIC
Parameter     :  category
Methods       :  GET
*/
booky.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter((book) => 
      book.category.includes(req.params.category)
  );

  if (getSpecificBook.length === 0) {
      return res.json({
        error: `No book found for the category of ${req.params.category}`,
      });
    }
    
  return res.json({ book: getSpecificBook });
});



/*
Route         :   /l
Description   :  Get list of books based on languages
Access        :  PUBLIC
Parameter     :  lang
Methods       :  GET
*/
booky.get("/l/:lang", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.lang === req.params.lang 
    );
  
  if(getSpecificBook.length === 0){
    return res.json({ error: `No book found for the category of ${req.params.lang}`});
  }
  return res.json({ book: getSpecificBook});
});

/*
Route         :   /book/add
Description   :  add new book 
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  POST
*/
booky.post("/book/add", (req, res) => {
  const {newBook} = req.body;

  database.books.push(newBook);
  return res.json({ books: database.books});

});

/*
Route         :   /book/update/title
Description   :  update title of a book 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      book.title = req.body.newTitle;
      return;
    }
  
    return res.json({ books : database.books });
  });

});

/*
Route         :   /book/update/author
Description   :  update author of a book 
Access        :  PUBLIC
Parameter     :  isbn,authorId
Methods       :  PUT
*/
booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      return book.author.push(parseInt(req.params.authorId));
    }
  });
  database.author.forEach((author) => {
    if(author.id === parseInt(req.params.authorId)){
      return author.book.push(req.params.isbn);
    }
  });
  return res.json({ books: database.books , authors: database.author});
});

/*
Route         :   /book/delete
Description   :  delete a book 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
  const newBookDatabase = database.books.filter(
    (book) => book.ISBN!==req.params.isbn);

  database.books = newBookDatabase;

  return res.json({ books: database.books });
});

/*
Route         :   /book/delete/author
Description   :  delete an author  from a book
Access        :  PUBLIC
Parameter     :  isbn,authorId
Methods       :  DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      const newAuthor = book.author.filter((author) => author!==parseInt(req.params.authorId));
      book.author = newAuthor;
      return;
    }  
  });

  database.author.forEach((author) => {
    if(author.id===parseInt(req.params.authorId)){
      const newBook = author.books.filter((book) => book!==req.params.isbn);
      author.books = newBook;
      return;
    } 
  });

  return res.json({ books: database.books , authors: database.author});
});




//AUTHOR/////////////////////////////////////////////////////////////////

/*
Route         :   /authors
Description   :  Get all authors
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/authors", (req, res) => {
  return res.json({ authors: database.author });
});



/*
Route         :   /author
Description   :  Get specific  authors 
Access        :  PUBLIC
Parameter     :  id
Methods       :  GET
*/
booky.get("/author/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({ error: `No author found for the id ${req.params.id}`});
  }
  return res.json({ author: getSpecificAuthor });
});


/*
Route         :   /author/book
Description   :  Get all authors based on books 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  GET
*/
booky.get("/author/book/:isbn",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({ error: `No author found for the book of isbn ${req.params.isbn}`});
  }
  return res.json({ authors: getSpecificAuthor });

});

/*
Route         :   /author/add
Description   :  add new author 
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  POST
*/
booky.post("/author/add", (req, res) => {
  const {newAuthor} = req.body;

  database.author.push(newAuthor);
  return res.json({ authors: database.author});

});

/*
Route         :   /author/update
Description   :  update author name
Access        :  PUBLIC
Parameter     :  id
Methods       :  PUT
*/
booky.put("/author/update/:id", (req, res) => {
  database.author.forEach((author) =>{
    if(author.id===parseInt(req.params.id)){
      author.name = req.body.newName;
    }
  });
  return res.json({ authors : database.author});
});

/*
Route         :   /author/delete
Description   :  delete an author 
Access        :  PUBLIC
Parameter     :  id
Methods       :  DELETE
*/
booky.delete("/author/delete/:id", (req,res) => {
  const newAuthorDatabase = database.author.filter(
    (author) => author.id!==parseInt(req.params.id));

  database.author = newAuthorDatabase;

  return res.json({ authors: database.author });
});



//PUBLICATIONS////////////////////////////////////////////////////////////////

/*
Route         :   /publications
Description   :  Get all publications
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/publications", (req, res) => {
  return res.json({ publication: database.publication });
});


/*
Route         :   /publication
Description   :  Get specific  publications 
Access        :  PUBLIC
Parameter     :  id
Methods       :  GET
*/
booky.get("/publication/:id", (req, res) => {
  const getSpecificPub = database.publication.filter(
    (pub) => pub.id === parseInt(req.params.id)
  );

  if(getSpecificPub.length === 0){
    return res.json({ error: `No publication found for the id ${req.params.id}`});
  }
  return res.json({ author: getSpecificPub });
});


/*
Route         :   /publication/book
Description   :  Get all publications based on books 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  GET
*/
booky.get("/publication/book/:isbn",(req,res) => {
  const getSpecificPub = database.publication.filter(
    (pub) => pub.books.includes(req.params.isbn)
  );

  if(getSpecificPub.length === 0){
    return res.json({ error: `No publication found for the book of isbn ${req.params.isbn}`});
  }
  return res.json({ authors: getSpecificPub });

});

/*
Route         :   /publication/add
Description   :  add new publication 
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  POST
*/
booky.post("/publication/add", (req, res) => {
  const {newPub} = req.body;

  database.publication.push(newPub);
  return res.json({ publications: database.publication});

});

/*
Route         :   /publication/update
Description   :  update publication name
Access        :  PUBLIC
Parameter     :  id
Methods       :  PUT
*/
booky.put("/publication/update/:id", (req, res) => {
  database.publication.forEach((pub) =>{
    if(pub.id===parseInt(req.params.id)){
      pub.name = req.body.newName;
    }
  });
  return res.json({ publications : database.publication});
});

/*
Route         :   /publication/update/book
Description   :  update new book to a publication 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //update the publication database
  database.publication.forEach((pub) => {
    if(pub.id===req.body.pubId){
      return pub.books.push(req.params.isbn);
    }
  //
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      return book.publications = req.body.pubId;
      
    }
  });  

  return res.json({ books: database.books , publications: database.publication});
  });

});

/*
Route         :   /publication/delete
Description   :  delete a publication 
Access        :  PUBLIC
Parameter     :  id
Methods       :  DELETE
*/
booky.delete("/publication/delete/:id", (req,res) => {
  const newPubDatabase = database.publication.filter(
    (pub) => pub.id!==parseInt(req.params.id));

  database.publication = newPubDatabase;

  return res.json({ publications: database.publication });
});

/*
Route         :   /publication/delete/book
Description   :  delete a book from a publication 
Access        :  PUBLIC
Parameter     :  isbn,pubId
Methods       :  DELETE
*/
booky.delete("/publication/delete/:isbn/:pubId", (req,res) => {
  database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      book.publications = 0;
      return;
    }  
  });

  database.publication.forEach((pub) => {
    if(pub.id===parseInt(req.params.pubId)){
      const newBook = pub.books.filter((book) => book!==req.params.isbn);
      pub.books = newBook;
      return;
    } 
  });

  return res.json({ books: database.books , publications: database.publication});
});



booky.listen(3000, () => console.log("HEy server is running! 😎"));


