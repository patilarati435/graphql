const { ApolloServer } = require('apollo-server')
const jwt =  require('jsonwebtoken')
const mongoose = require('mongoose');
const typeDefs=require("./schema")
const resolvers = require('./resolvers')
require('dotenv').config()
const { JWT_SECRET, PORT } = process.env

mongoose.connect('mongodb://127.0.0.1:27017/');

// const fs = require('fs')
// const { default: mongoose } = require('mongoose')
// const typeDefs = fs.readFileSync('./schema.graphql',{encoding:'utf-8'})
const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET)
    }
    return null
  } catch (error) {
    return null
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.get('Authorization') || ''
    return { user: getUser(token.replace('Bearer', ''))}
  },
  
  
})
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});