const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      }
      catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        // if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
        //   throw new Error('Invalid ID');
        // }      
        const post = await Post.findById(postId);
        if (post) {
          return post;
        }
        else {
          throw new Error('Post not found');
        }
      }
      catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const errors={};
      const user = checkAuth(context);
      // console.log(user);

      if(body.trim() === ''){
        // throw new Error('Post body must not be empty');
        errors.general = 'Post body must not be empty';
        throw new UserInputError('Post body must not be empty', {errors});
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      const post = await newPost.save();

      // Subscription also
      context.pubsub.publish('NEW_POST', {
        newPost: post
      })

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        }
        else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already likes, then unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        }
        else {
          // Not liked, then like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;

      } else throw new UserInputError('Post not found');
    }

  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }

}