import React, { Component } from 'react';
import { withFirebase } from './Firebase';
import Button from 'react-bootstrap/Button';
 
const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);
 
const INITIAL_STATE = {
  email: '',
  error: null,
  success: null
};
 
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email } = this.state;
 
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .then(() => {
        this.setState({ success: "Your request was succesful. You should receive an email with a reset link." });
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, error, success } = this.state;
 
    const isInvalid = email === '';
 
    return (
        <div id="mainPlaceholder" className="container rectangle registerect container" style={{ marginTop: "120px", height: 'fit-content', width: '100%' }} >
            <h1>Password reset</h1>

            <form onSubmit={this.onSubmit}>
                <input
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
                />
                <Button disabled={isInvalid} type="submit" variant="warning" className='authInputs'>
                Reset My Password
                </Button>
        
                {error && <p style={{color: '#F97F3A'}}>{error.message}</p>}
                {success && <p style={{color: '#F97F3A'}}>{success}</p>}
            </form>
        </div>
    );
  }
}

 
export default PasswordForgetPage;
 
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
 
export { PasswordForgetForm };