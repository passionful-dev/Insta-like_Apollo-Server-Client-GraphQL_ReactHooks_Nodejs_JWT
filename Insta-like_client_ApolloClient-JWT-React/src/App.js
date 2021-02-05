import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import './App.css';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import AuthRoute from './util/AuthRoute';
import { AuthProvider } from './util/context/auth';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Route exact path='/' component={Home} />
          {/* <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} /> */}
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path='/posts/:postId' component={SinglePost} />
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
