import React, { useState, useContext, useRef } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Icon, Label, Button, Card, Grid, Image, Form } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../util/context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const FETCH_POST_QUERY = gql`
  query($postId: ID!){
    getPost(postId: $postId){
      id body createdAt username likeCount
      likes{
        username
      }
      commentCount
      comments{
        id username createdAt body
      }
    }
  }
`
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id body createdAt username
      }
      commentCount
    }
  }
`

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);

  const postId = props.match.params.postId;

  const [comment, setComment] = useState('');
  const commentInputref = useRef(null);

  // Fetch data from id
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });
  // console.log(data)

  // Create comment
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputref.current.blur();
    },
    variables: { postId, body: comment }
  })

  function deletePostCallback() {
    props.history.push('/')
  }

  let postPage;
  if (!data) {
    postPage = <p>Loading post...</p>
  }
  else {
    const { id, body, createdAt, username, likeCount, likes, commentCount, comments } = data.getPost;
    postPage = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />

                <Button labelPosition='right' as="div" onClick={() => console.log('Comment on post')}>
                  <Button color='blue' basic>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>

            {/* Comment Form */}
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>

                  <Form onSubmit={submitComment}>
                    <div className="ui action input fluid">
                      <input type="text" placeholder="Comment..." name="comment" 
                      value={comment} 
                      onChange={event => setComment(event.target.value)} 
                      ref={commentInputref}/>
                      <button floated="left" className='ui button teal' disabled={comment.trim() === ''} >Submit</button>
                    </div>          
                  </Form>

                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {/* Delete comment of that user */}
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}

                  {/* Display comments */}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>

                </Card.Content>
              </Card>

            ))}

          </Grid.Column>

        </Grid.Row>
      </Grid>
    );
  }

  return postPage;

}


export default SinglePost;


