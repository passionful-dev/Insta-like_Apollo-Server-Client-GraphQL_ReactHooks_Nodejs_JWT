import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { Icon, Label, Button } from 'semantic-ui-react';


function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);


  // If loggedin user is seeing and if that user is the one to like, then set 'Like' to it
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) setLiked(true);
    else setLiked(false);
  }, [user, likes]);

  // Send the id of the Post
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  })

  // If there is user and he has liked it, then change colour
  const likeButton = user ? liked ? (
    <Button color='teal'>
      <Icon name='heart' />
    </Button >
  ) : (
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button >
    ) : (
      <Button as={Link} to='/login' color='teal' basic>
        <Icon name='heart' />
      </Button >
    )


  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      {/*<Button color='teal' basic>
        <Icon name='heart' />
      </Button> */}

      {likeButton}

      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>

    </Button>
  )
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!){
    likePost(postId: $postId) {
      id
      likes{
        id username
      }
      likeCount
    }
  }
`;

export default LikeButton;