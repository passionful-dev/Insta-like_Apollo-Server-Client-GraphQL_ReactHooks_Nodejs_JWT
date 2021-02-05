import React, { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation, gql } from '@apollo/client';

import { useForm } from '../util/hooks'
import { AuthContext } from '../util/context/auth';

function Login(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({});
  // const [values, setValues] = useState({
  //   username: '',
  //   password: '',
  // })
  // const onChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value })
  // }

  const initialState = {
    username: '',
    password: '',
  };

  const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // update(_, result) {
    //   context.login(result.data.login);
    update(_, { data: { login: userData } }) {
      // console.log(userData);
      context.login(userData);

      props.history.push('/');
    },
    onError(err) {
      // console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  })

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   loginUser()
  // }

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label='Username'
          type="text"
          placeholder="Username"
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange} />
        <Form.Input label='Password' type="password" placeholder="Password" name="password" value={values.password} error={errors.password ? true : false} onChange={onChange} />
        <Button type="submit" primary>
          Login
        </Button>

      </Form>


      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}


const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      id email username createdAt token
    }
  }
`;

export default Login;

