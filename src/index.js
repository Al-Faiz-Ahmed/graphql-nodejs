import express from "express";
import { ApolloServe } from "@apollo/server";
import {expre} from "graphql"

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  console.log("Root Page Accessed");
  res.json("ALL OK");
});

app.listen(6000, () => {
  console.log(`Server Start on http://localhost:6000`);
});
