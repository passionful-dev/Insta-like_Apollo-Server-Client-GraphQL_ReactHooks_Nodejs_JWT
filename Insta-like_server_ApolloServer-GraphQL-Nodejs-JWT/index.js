const { ApolloServer, PubSub } = require('apollo-server')
// const gql = require('graphql-tag')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
// const Post = require('./models/Post')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config')

// const typeDefs = gql`
//   type Post{
//     id: ID!
//     body: String!
//     createdAt: String!
//     username: String!
//   }
//   type Query{
//     # sayHi: String!
//     getPosts: [Post]
//   }
// `

// const resolvers = {
//   Query: {
//     // sayHi: () => 'Hello World!'
//     async getPosts(){
//       try {
//         const posts = await Post.find()
//         return posts
//       } 
//       catch (err) {
//         throw new Error(err)
//       }
//     }
//   }
// }

const PORT = process.env.port || 5000;

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs, resolvers,
  context: ({ req }) => ({ req, pubsub })
})

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => {
    console.log('Connected to database')
    return server.listen({ port: PORT })
      .then(res => {
        console.log(`Server ready at ${res.url}`)
      })
  })
  .catch(err => {
    console.log(err)
  })


