import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { Icon, Confirm, Button } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';


const DeleteButton = ({postId, commentId, callback}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) { 
      setConfirmDelete(false);

      // If it is for post (not for comment)
      if(!commentId){
        var data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
  
        data = data.getPosts.filter(p => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      

      if(callback) callback();
    },
    variables: { postId, commentId }
  })
  return (
    <>
      <Button as="div" color="red" floated="right" onClick={() => setConfirmDelete(true)}>
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>

      <Confirm
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={deletePostOrComment} />
    </>
  );
}


const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id username createdAt body
      }
      commentCount
    }
  }
`;

export default DeleteButton;

