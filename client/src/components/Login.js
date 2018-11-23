import React from 'react';
import { withRouter } from 'react-router-dom';
import Form from '../shared/Form';
import { auth } from '../firebase';
import { Consumer } from './AppProvider';

/* A simple login with a custom form found from the component Form */

const Login = props => <Consumer>
  {({ state, ...context }) => (
    <div>
      <Form
        isLogin={true}
        action="signIn"
        title="Login"
        onSuccess={() => props.history.push('/create')}
        onError={({ message }) => context.setMessage(`Login failed: ${message}`)}
      />
      <Form
        isRegister={true}
        action="createUser"
        title="Or create an account"
        onSuccess={() => auth.logout().then(() => {
          props.history.push('/create');
        })}
        onError={({ message }) => context.setMessage(`Error occured: ${message}`)}
      />
    </div>
  )}
</Consumer>;

export default withRouter(Login);