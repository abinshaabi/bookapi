require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialising express
const booky = express();

//configuration
booky.use(express.json());

//Establish Database Connection
mongoose
  .connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection established !!!!"));



//BOOKS///////////////////////////////////////////////

/*
Route         :   /
Description   :  Get all books
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});



/*
Route         :   /is
Description   :  Get specific  books 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  GET
*/
booky.get("/is/:isbn", async (req, res) => {

  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

  if(!getSpecificBook){
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
booky.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category });
  //const getSpecificBook = database.books.filter((book) => 
  //    book.category.includes(req.params.category)
  //);

  if (!getSpecificBook) {
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
booky.get("/l/:lang", async (req,res) => {
  
  const getSpecificBook = await BookModel.find({lang : req.params.lang});
  //const getSpecificBook = database.books.filter(
  //  (book) => book.lang === req.params.lang 
  //  );
  
  if(getSpecificBook.length===0){
    return res.json({ error: `No book found for the category of ${req.params.lang}`});
  }
  return res.json({ books: getSpecificBook});
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
  
  BookModel.create(newBook);

  //database.books.push(newBook);
  return res.json({ message : "new book added"});

});

/*
Route         :   /book/update/title
Description   :  update title of a book 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  PUT
*/
booky.put("/book/update/title/:isbn", async (req, res) => {
  
  const updatedBook = await BookModel.findOneAndUpdate(
    {ISBN: req.params.isbn},
    {title: req.body.bookTitle},
    {new: true}
  );
  
  //database.books.forEach((book) => {
  //  if(book.ISBN===req.params.isbn){
  //    book.title = req.body.newTitle;
  //    return;
  //  }
  
    return res.json({ books : updatedBook });
  });



/*
Route         :   /book/update/author
Description   :  update author of a book 
Access        :  PUBLIC
Parameter     :  isbn,authorId
Methods       :  PUT
*/
booky.put("/book/update/author/:isbn/:authorId", async (req, res) => {
  //updating book dtabse
  
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        author: parseInt(req.params.authorId)
      },
    },
    {
      new: true
    }
  );

  /*database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      return book.author.push(parseInt(req.params.authorId));
    }
  }); */
  
  //updating author database
  
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId)
    },
    {
      $addToSet: {
        books: req.params.isbn
      },
    },
    {
      new: true
    }
  );
  
  /*database.author.forEach((author) => {
    if(author.id === parseInt(req.params.authorId)){
      return author.book.push(req.params.isbn);
    }
  }); */
  return res.json({ books: updatedBook , authors: updatedAuthor});
});

/*
Route         :   /book/delete
Description   :  delete a book 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  DELETE
*/
booky.delete("/book/delete/:isbn", async (req,res) => {
  
  const deletedBook = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );
  
  
  //const newBookDatabase = database.books.filter(
  //  (book) => book.ISBN!==req.params.isbn);

  //database.books = newBookDatabase;
    

  return res.json({ deletedbook: deletedBook });
});

/*
Route         :   /book/delete/author
Description   :  delete an author  from a book
Access        :  PUBLIC
Parameter     :  isbn,authorId
Methods       :  DELETE
*/



booky.delete("/book/delete/author/:isbn/:authorId", async (req,res) => {
  
  //updating  book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $pull:{
        author: parseInt(req.params.authorId)
      },
    },
    {
      new: true
    },
  );
  
  
  /*database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      const newAuthor = book.author.filter((author) => author!==parseInt(req.params.authorId));
      book.author = newAuthor;
      return;
    }  
  });*/
  
  // updating author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId)
    },
    {
      $pull:{
        books: req.params.isbn 
      },
    },
    {
      new: true
    },
  );
  /*database.author.forEach((author) => {
    if(author.id===parseInt(req.params.authorId)){
      const newBook = author.books.filter((book) => book!==req.params.isbn);
      author.books = newBook;
      return;
    } 
  }); */  

  return res.json({ books: updatedBook , authors: updatedAuthor});
});




//AUTHOR/////////////////////////////////////////////////////////////////

/*
Route         :   /authors
Description   :  Get all authors
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});



/*
Route         :   /author
Description   :  Get specific  authors 
Access        :  PUBLIC
Parameter     :  id
Methods       :  GET
*/
booky.get("/author/:id", async(req, res) => {
  
  const getSpecificAuthor = await AuthorModel.findOne({ id : req.params.id });
  
  //const getSpecificAuthor = database.author.filter(
  //  (author) => author.id === parseInt(req.params.id)
  //);

  if(!getSpecificAuthor){
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
booky.get("/author/book/:isbn", async (req,res) => {
  
  const getSpecificAuthor = await AuthorModel.findOne({books : req.params.isbn});
  
  //const getSpecificAuthor = database.author.filter(
  //  (author) => author.books.includes(req.params.isbn)
  //);

  if(!getSpecificAuthor){
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
booky.post("/author/add", async (req, res) => {
  const {newAuthor} = req.body;

  AuthorModel.create(newAuthor);
  //database.author.push(newAuthor);
  return res.json({ message : "new author added"});

});

/*
Route         :   /author/update/name
Description   :  update author name
Access        :  PUBLIC
Parameter     :  id,name 
Methods       :  PUT
*/
booky.put("/author/update/name/:id/:name", async (req, res) => {
  
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {id: parseInt(req.params.id)},
    {name: req.params.name},
    {new: true}
  );
  
  /*database.author.forEach((author) =>{
    if(author.id===parseInt(req.params.id)){
      author.name = req.body.newName;
    }
  }); */
  return res.json({ authors : updatedAuthor});
});

/*
Route         :   /author/delete
Description   :  delete an author 
Access        :  PUBLIC
Parameter     :  id
Methods       :  DELETE
*/
booky.delete("/author/delete/:id", async (req,res) => {
  const deletedAuthor = await AuthorModel.findOneAndDelete(
    {
      id: parseInt(req.params.id)
    }
  );
  
  /*const newAuthorDatabase = database.author.filter(
    (author) => author.id!==parseInt(req.params.id));

  database.author = newAuthorDatabase; */

  return res.json({ deletedauthor: deletedAuthor });
});



//PUBLICATIONS////////////////////////////////////////////////////////////////

/*
Route         :   /publications
Description   :  Get all publications
Access        :  PUBLIC
Parameter     :  NONE
Methods       :  GET
*/
booky.get("/publications", async (req, res) => {
  const getAllPub =await PublicationModel.find();
  return res.json({ publication: getAllPub });
});


/*
Route         :   /publication
Description   :  Get specific  publications 
Access        :  PUBLIC
Parameter     :  id
Methods       :  GET
*/
booky.get("/publication/:id", async (req, res) => {
  
  const getSpecificPub = await PublicationModel.findOne({ id : req.params.id });

  //const getSpecificPub = database.publication.filter(
  //  (pub) => pub.id === parseInt(req.params.id)
  //);

  if(!getSpecificPub){
    return res.json({ error: `No publication found for the id ${req.params.id}`});
  }
  return res.json({ publication : getSpecificPub });
});


/*
Route         :   /publication/book
Description   :  Get all publications based on books 
Access        :  PUBLIC
Parameter     :  isbn
Methods       :  GET
*/
booky.get("/publication/book/:isbn", async (req,res) => {
  
  const getSpecificPub = await PublicationModel.findOne({books : req.params.isbn});

  //const getSpecificPub = database.publication.filter(
  //  (pub) => pub.books.includes(req.params.isbn)
  //);

  if(!getSpecificPub){
    return res.json({ error: `No publication found for the book of isbn ${req.params.isbn}`});
  }
  return res.json({ publications: getSpecificPub });

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

  PublicationModel.create(newPub);
  //database.publication.push(newPub);
  return res.json({ message : " new publication added"});

});

/*
Route         :   /publication/update/name
Description   :  update publication name
Access        :  PUBLIC
Parameter     :  id , name
Methods       :  PUT
*/
booky.put("/publication/update/name/:id/:name", async (req, res) => {
  
  const updatedPub = await PublicationModel.findOneAndUpdate(
    {id: parseInt(req.params.id)},
    {name: req.params.name},
    {new: true}
  );
  
  /*database.publication.forEach((pub) =>{
    if(pub.id===parseInt(req.params.id)){
      pub.name = req.body.newName;
    }
  }); */
  return res.json({ publication : updatedPub});
});

/*
Route         :   /publication/update/book
Description   :  update new book to a publication 
Access        :  PUBLIC
Parameter     :  id ,isbn
Methods       :  PUT
*/
booky.put("/publication/update/book/:id/:isbn", async (req,res) => {
  //update the publication database
  const updatedPub = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.id)
    },
    {
      $addToSet:{
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  /*database.publication.forEach((pub) => {
    if(pub.id===req.body.pubId){
      return pub.books.push(req.params.isbn);
    } */
  
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn
      },
      {
        $set:{
          publications: parseInt(req.params.id)
        }
      },
      {
        new: true
      }
    );
  
    /*database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      return book.publications = req.body.pubId;
      
    } 
  }); */  

  return res.json({ books: updatedBook , publications: updatedPub});
  });



/*
Route         :   /publication/delete
Description   :  delete a publication 
Access        :  PUBLIC
Parameter     :  id
Methods       :  DELETE
*/
booky.delete("/publication/delete/:id",async (req,res) => {
  const deletedPub = await PublicationModel.findOneAndDelete(
    {
      id: parseInt(req.params.id)
    }
  );
  
  /*const newPubDatabase = database.publication.filter(
    (pub) => pub.id!==parseInt(req.params.id));

  database.publication = newPubDatabase;
*/
  return res.json({ deletedpublication: deletedPub });
});

/*
Route         :   /publication/delete/book
Description   :  delete a book from a publication 
Access        :  PUBLIC
Parameter     :  isbn,pubId
Methods       :  DELETE
*/
booky.delete("/publication/delete/:isbn/:pubId", async (req,res) => {
  //update book databse
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN : req.params.isbn
    },
    {
      $set:{
        publications: 0
      }      
    },
    {
      new: true
    },
  );

  /* database.books.forEach((book) => {
    if(book.ISBN===req.params.isbn){
      book.publications = 0;
      return;
    }  
  });
*/

  //update publication daatbase
  const updatedPub = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.pubId)
    },
    {
      $pull:{
        books: req.params.isbn
      },
    },
    {
      new: true
    }
  );

  /*database.publication.forEach((pub) => {
    if(pub.id===parseInt(req.params.pubId)){
      const newBook = pub.books.filter((book) => book!==req.params.isbn);
      pub.books = newBook;
      return;
    } 
  }); */

  return res.json({ books: updatedBook, publications: updatedPub});
});



booky.listen(3000, () => console.log("HEy server is running! 😎"));


