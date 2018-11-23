import React, {
  Component,
  createRef
} from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { auth } from '../firebase';
import Colors from './../colors'

/* A custom form used in login and register */

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-top: 90px;
  margin-bottom: 100px;

  h1 {
    text-align: center;
    margin-bottom: 60px;
    color: white;
  }

  h4 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: normal;
    color: white;
  }

  input {
    height: 40px;
    width: 100%;
    font-size: 100%;
    background: #171717;
    color: white;
    padding-left: 10px;
    border: 0;
    margin-bottom: 10px;
  }

  button {
    height: 40px;
    font-size: 15px;
    border: none;
    margin: auto;
    margin-top: 20px;
    padding: 0px 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.header.bg};
    color: ${Colors.accent};
    cursor: pointer;
  }
`

class Form extends Component {
  constructor(props) {
    super(props);

    this.email = createRef();
    this.password = createRef();
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess() {
    this.resetForm();
    this.props.onSuccess && this.props.onSuccess();
  }

  handleErrors(reason) {
    this.props.onError && this.props.onError(reason);
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      email,
      password,
      props: { action }
    } = this;

    auth.userSession(
      action,
      email.current.value,
      password.current.value
    ).then(this.handleSuccess).catch(this.handleErrors);
  }

  resetForm() {
    if (!this.email.current || !this.password.current) { return }
    const { email, password } = Form.defaultProps;
    this.email.current.value = email;
    this.password.current.value = password;
  }

  render() {
    return (
      <LoginForm onSubmit={this.handleSubmit}>
        {this.props.isLogin && <h1>{this.props.title}</h1> }
        {this.props.isRegister && <h4>{this.props.title}</h4> }
        <input
          placeholder="Email"
          name="name"
          type="email"
          ref={this.email}
        />
        <input
          placeholder="Password"
          name="password"
          type="password"
          autoComplete="none"
          ref={this.password}
        />
        <button type="submit">Submit</button>
      </LoginForm>
    )
  }
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}

Form.defaultProps = {
  errors: '',
  email: '',
  password: ''
}

export default Form;