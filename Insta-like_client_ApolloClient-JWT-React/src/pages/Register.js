import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation, gql } from '@apollo/client';

import { useForm } from '../util/hooks'
import { AuthContext } from '../util/context/auth';

const Register = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  // const [values, setValues] = useState({
  //   username: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: ''
  // })
  // const onChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value })
  // }

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // update(_, result) {
    // console.log(result);
    update(_, { data: { register: userData } }) {
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
  //   addUser()
  // }

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label='Username'
          type="text"
          placeholder="Username"
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange} />
        <Form.Input label='Email' type="email" placeholder="Email" name="email" value={values.email} error={errors.email ? true : false} onChange={onChange} />
        <Form.Input label='Password' type="password" placeholder="Password" name="password" value={values.password} error={errors.password ? true : false} onChange={onChange} />
        <Form.Input label='ConfirmPassword' type="password" placeholder="ConfirmPassword" name="confirmPassword" value={values.confirmPassword} error={errors.confirmPassword ? true : false} onChange={onChange} />
        <Button type="submit" primary>
          Register
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
  )
}

const REGISTER_USER = gql`
  mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!){
    register(registerInput:{
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    }){
      id email username createdAt token
    }
  }
`;

export default Register

