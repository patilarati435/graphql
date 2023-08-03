const bcrypt = require('bcryptjs')
const mongoose=require('mongoose')
const jsonwebtoken = require('jsonwebtoken')
const models = require('./model')
// require('dotenv').config()
const resolvers = {
    Query: {
      async me(root, args, { user }) {
        if(!user) throw new Error('You are not authenticated')
        return await models.findById(user.id)
      },
      async user(root, { id }, { user }) {
        try {
          if(!user) throw new Error('You are not authenticated!')
          return models.findById(id)
        } catch (error) {
          throw new Error(error.message)
        }
      },
      async allUsers(root, args, { user }) {
        try {
          if (!user) throw new Error('You are not authenticated!')
          return models.findAll()
        } catch (error) {
          throw new Error(error.message)
        }
      }
    },
    Mutation: {
      async registerUser(aa, { username, email, password }) {
        try {
          const user = await models.create({
            username :username,
            email :email,
            password: await bcrypt.hash(password, 10)
          })
          const token = jsonwebtoken.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1y' }
          )
          return {
            token, id: user.id, username: user.username, email: user.email, message: "Authentication succesfull"
          }
        } catch (error) {
          throw new Error(error.message)
        }
      },
      async login(_, { email, password }) {
        try {
          const user = await models.findOne({ email })
          if (!user) {
            throw new Error('No user with that email')
          }
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            throw new Error('Incorrect password')
          }
          // return jwt
          const token = jsonwebtoken.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
          )
          return ({
           token, user
          })
      } catch (error) {
        throw new Error(error.message)
      }
    }
  },

}
module.exports = resolvers