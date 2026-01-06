
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import { ruruHTML } from 'ruru/server';


// ============================================
// SCHEMA DEFINITION
// ============================================

// buildSchema() parses a GraphQL schema string and returns a GraphQLSchema object
// This defines the structure of your API - what queries and mutations are available

// const schema = buildSchema(`
//   # Query type - All read operations go here
//   type Query {
//     # Simple query that returns a greeting
//     hello: String
    
//     # Query to get current server time
//     serverTime: String
    
//     # Query to get a single book by ID
//     # The ! means the argument is required
//     book(id: ID!): Book
    
//     # Query to get all books
//     # [Book] means it returns an array of Book objects
//     books: [Book]
    
//     # Query to search books by title
//     searchBooks(title: String!): [Book]
//   }

//   # Mutation type - All write/modify operations go here
//   type Mutation {
//     # Create a new book
//     # Returns the created Book object
//     createBook(title: String!, author: String!, year: Int): Book
    
//     # Delete a book by ID
//     # Returns true if successful, false otherwise
//     deleteBook(id: ID!): Boolean
    
//     # Update a book
//     updateBook(id: ID!, title: String, author: String, year: Int): Book
//   }

//   # Custom type definition for Book
//   # Defines the shape of a Book object

//   type Book {
//     # ID! means this field is non-nullable (always has a value)
//     id: ID!
    
//     # Required string field
//     title: String!
    
//     # Required string field
//     author: String!
    
//     # Optional integer field (no !)
//     year: Int
    
//     # Optional boolean field
//     available: Boolean
//   }
// `);


const schema  = buildSchema(`#graphql

  type Book {
    id: String!,
    bookName: String!
  }
  
  type Query {
  
    greeting : String

    getBooks : [Book]

  }
  
  `)

  let rootValue = {
    greeting : () => 'Hello Faizan created this',
    getBooks : () => [{id:"45",bookName:"Paper"}]
  }


// let books = [
//   {
//     id: '1',
//     title: 'The Great Gatsby',
//     author: 'F. Scott Fitzgerald',
//     year: 1925,
//     available: true,
//   },
//   {
//     id: '2',
//     title: 'To Kill a Mockingbird',
//     author: 'Harper Lee',
//     year: 1960,
//     available: true,
//   },
//   {
//     id: '3',
//     title: '1984',
//     author: 'George Orwell',
//     year: 1949,
//     available: false,
//   },
// ];

// Counter for generating unique IDs
let nextId = 4;


// ============================================
// RESOLVERS (Root Value)
// ============================================

// Resolvers are functions that return data for each field in your schema
// The resolver function names must match the field names in the schema

// const rootValue = {
  
//   // ----------------
//   // QUERY RESOLVERS
//   // ----------------
  
//   // Simple resolver - returns a static string
//   // Called when client queries: { hello }
//   hello: () => {
//     return 'Hello from GraphQL!';
//   },

//   // Resolver that returns dynamic data
//   // Called when client queries: { serverTime }
//   serverTime: () => {
//     return new Date().toISOString();
//   },

//   // Resolver with arguments
//   // The first parameter contains the arguments passed in the query
//   // Called when client queries: { book(id: "1") { title } }
//   book: ({ id }) => {
//     // find() returns the first matching element or undefined
//     return books.find((book) => book.id === id);
//   },

//   // Resolver that returns an array
//   // Called when client queries: { books { title author } }
//   books: () => {
//     return books;
//   },

//   // Resolver with search functionality
//   // Called when client queries: { searchBooks(title: "Great") { title } }
//   searchBooks: ({ title }) => {
//     // Filter books where title includes the search string (case-insensitive)
//     return books.filter((book) =>
//       book.title.toLowerCase().includes(title.toLowerCase())
//     );
//   },

//   // -------------------
//   // MUTATION RESOLVERS
//   // -------------------

//   // Create mutation - adds new data
//   // Called when client sends: mutation { createBook(title: "...", author: "...") { id } }
//   createBook: ({ title, author, year }) => {
//     // Create new book object
//     const newBook = {
//       id: String(nextId++),  // Generate unique ID and increment counter
//       title,                  // ES6 shorthand for title: title
//       author,                 // ES6 shorthand for author: author
//       year: year || null,     // Use provided year or null if not provided
//       available: true,        // Default value for new books
//     };

//     // Add to our "database"
//     books.push(newBook);

//     // Return the created book (so client can see the generated ID)
//     return newBook;
//   },

//   // Delete mutation - removes data
//   // Called when client sends: mutation { deleteBook(id: "1") }
//   deleteBook: ({ id }) => {
//     // Find the index of the book to delete
//     const index = books.findIndex((book) => book.id === id);

//     // If book not found, return false
//     if (index === -1) {
//       return false;
//     }

//     // Remove the book from array
//     books.splice(index, 1);

//     // Return true to indicate success
//     return true;
//   },

//   // Update mutation - modifies existing data
//   // Called when client sends: mutation { updateBook(id: "1", title: "New Title") { title } }
//   updateBook: ({ id, title, author, year }) => {
//     // Find the book to update
//     const book = books.find((book) => book.id === id);

//     // If book not found, return null
//     if (!book) {
//       return null;
//     }

//     // Update only the fields that were provided
//     // If title is undefined, keep the existing value
//     if (title !== undefined) book.title = title;
//     if (author !== undefined) book.author = author;
//     if (year !== undefined) book.year = year;

//     // Return the updated book
//     return book;
//   },
// };


const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'GraphQL API Server',
    graphqlEndpoint: '/graphql',
    playgroundEndpoint: '/graphql (open in browser)',
  });
});


// ------------------------------------
// GraphQL Playground (Ruru)
// ------------------------------------
// GET http://localhost:4000/graphql
// When you visit this URL in a browser, it serves the GraphQL IDE
app.get('/graphql', (req, res) => {
  // Set the response content type to HTML
  res.type('html');
  res.end(ruruHTML({ 
    endpoint: '/graphql',  // The playground will POST requests to this URL
  }));
});


app.post('/graphql', createHandler({
  schema: schema,
  rootValue: rootValue,
  context: (req) => ({
    timestamp: Date.now(),
  }),
}));


app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
  });
});


app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
  });
});


app.listen(PORT, () => {
  console.log('');
  console.log('🚀 GraphQL Server is running!');
  console.log('');
  console.log(`   📍 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
  console.log(`   🎮 GraphQL Playground: http://localhost:${PORT}/graphql`);
  console.log(`   ❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Try these queries in the playground:');
  console.log('');
  console.log('   { hello }');
  console.log('   { books { id title author } }');
  console.log('   { book(id: "1") { title year } }');
  console.log('');
});