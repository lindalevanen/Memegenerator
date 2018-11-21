import React, {
  Component,
  createRef
} from 'react';
import PropTypes from 'prop-types';
import { auth } from '../firebase';

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
      <form onSubmit={this.handleSubmit}>
        <h1>{this.props.title}</h1>
        <input
          name="name"
          type="email"
          ref={this.email}
        />
        <input
          name="password"
          type="password"
          autoComplete="none"
          ref={this.password}
        />
        <button type="submit">Submit</button>
      </form>
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