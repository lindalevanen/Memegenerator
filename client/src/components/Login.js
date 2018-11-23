import React from 'react';
import { withRouter } from 'react-router-dom';
import Form from '../shared/Form';
import { Consumer } from './AppProvider';

/* A simple login with a custom form found from the component Form */

const Login = props => <Consumer>
  {({ state, ...context }) => (
    <Form
      action="signIn"
      title="Login"
      onSuccess={() => props.history.push('/create')}
      onError={({ message }) => context.setMessage(`Login failed: ${message}`)}
    />
  )}
</Consumer>;

export default withRouter(Login);