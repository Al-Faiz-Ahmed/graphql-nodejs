import express from "express";
// import { buildSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

allMiddleWare(app);

app.get("/", (req, res) => {
  res.type(".html");
  res.send("<h1>Server is working</h1>");
});

app.get("/graphql", (req, res) => {
  res.type("html");
  res.end(
    ruruHTML({
      endpoint: "/graphql",
    })
  );
});

app.post(
  "/graphql",
  createHandler({
    schema: schema,
  })
);

app.listen(PORT, () => {
  console.log(`Serever Started on http://localhost:${PORT}`);
});

function allMiddleWare(app) {
  app.use(express.json());
  app.use(cors());
}
