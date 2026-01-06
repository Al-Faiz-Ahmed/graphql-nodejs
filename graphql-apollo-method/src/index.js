import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";

const PORT = 4000;

const typeDefs = `#graphql

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    userId: Int
    user: User
  }

  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    website: String!
    phone: String!
  }
  
  type Query {
    greeting: String!
    getTodos: [Todo]
    getTodoById(id: ID!): Todo
    getAllUsers: [User]
    getUserById(id: ID!): User
  }

`;

const resolvers = {
  Todo: {
    user: async (parent) => {
      // parent contains the todo object with userId
      if (!parent.userId) return null;

      return await fetch(
        `https://jsonplaceholder.typicode.com/users/${parent.userId}`
      ).then((res) => res.json());
    },
  },

  Query: {
    greeting: () => `Hello Faizan Created this`,

    getTodos: async () => {
      return await (
        await fetch("https://jsonplaceholder.typicode.com/todos/")
      ).json();
    },

    getTodoById: async (_, { id }) => {
      return await (
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      ).json();
    },

    getAllUsers: async () => {
      return await (
        await fetch("https://jsonplaceholder.typicode.com/users/")
      ).json();
    },

    getUserById: async (_, { id }) => {
      return await (
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      ).json();
    },
  },
};

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send(`
      <h1>🚀 GraphQL API Server</h1>
      <p>Created by Faizan</p>
      <p>Visit <a href="/graphql">/graphql</a> for GraphQL Playground</p>
    `);
});

app.use("/graphql",  expressMiddleware(server));

// httpServer.listen(PORT, () => {
//   console.log(` Server ready at http://localhost:${PORT}`);
// });

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve)).then(()=>{

    console.log(` Server ready at http://localhost:${PORT}`) ;
});
