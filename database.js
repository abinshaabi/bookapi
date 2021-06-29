let books = [
    {
      ISBN: "12345one",
      title: "Getting started with MERN",
      pubDate: "2021-07-07",
      lang: "en",
      numPage: 250,
      author: [1, 2],
      publications: 1,
      category: ["tech", "programming", "education", "thriller"],
    },
    {
        ISBN: "12345two",
        title: "Getting started with HTML",
        pubDate: "2020-05-06",
        lang: "en",
        numPage: 350,
        author: [1],
        publications: 1,
        category: ["tech", "programming", "education"],
      },
  
];
  
let author = [
    { id: 1, name: "Pavan", books: ["12345one","12345two"] },
    { id: 2, name: "Elon Musk", books: [] },
];
  
let publication = [
    { id: 1, name: "writex", books: ["12345one"] },
    { id: 2, name: "ruby", books: [] },
];

module.exports = {books, author, publication};
  