import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation, gql } from '@apollo/client';

import { useForm } from '../util/hooks'
// import { AuthContext } from '../util/context/auth';
import { FETCH_POSTS_QUERY } from '../util/graphql';


const PostForm = () => {
  // const {user} = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    body: '',
  };

  const { values, onChange, onSubmit } = useForm(createPostCallback, initialState);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    // update(_, result) {
    update(proxy, result) {
      var data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });

      data = [result.data.createPost, ...data.getPosts];
      // console.log('data:', data)
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

      // console.log(result);
      values.body = '';
    },
    onError(err) {
      // console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0] ? err.graphQLErrors[0].extensions.exception.errors : {});
    }


  });

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   createPost()
  // }

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Input type="text" placeholder="Post something" name="body" value={values.body} error={errors.general ? true : false} onChange={onChange} />
        <Button type="submit" color='teal'>Submit</Button>
      </Form>

      <div className='postformError'>
      {
        Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map(value => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )
      }
      </div>

    </>
  )
}



export default PostForm;

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!){
    createPost(body: $body){
      id body username createdAt
      likes{
        id username createdAt
      }
      likeCount
      comments{
        id body username createdAt
      }
      commentCount
    }
  }
`;


