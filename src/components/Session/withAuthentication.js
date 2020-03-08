import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
// import  AuthUserContext from './context';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.props.onSetAuthUser(
        JSON.parse(localStorage.getItem('authUser')),
      );
    }

    componentDidMount() {
      let userType;
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.props.onSetAuthUser(authUser);
          if (authUser) {
            this.props.firebase.database().ref.child('companies').orderByChild('email').equalTo(authUser.email).once('value', snap => {
              if (!snap.exists()) {
                userType = 'jobSeeker';
              } else {
                userType = 'company';
              }
              localStorage.setItem('userType', userType);
              this.props.onSetUserType(userType)
            })
          }
        },
        () => {
          localStorage.removeItem('authUser');
          this.props.onSetAuthUser(null);
          localStorage.removeItem('userType');
          this.props.onSetUserType(null)
        },
      );
    }

    componentWillUnmount() {
      this.listener = null;
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser =>
      dispatch({ type: 'AUTH_USER_SET', authUser }),
    onSetUserType: userType =>
      dispatch({ type: 'USER_TYPE_SET', userType })
  });
  return compose(
    withFirebase,
    connect(
      null,
      mapDispatchToProps,
    ),
  )(WithAuthentication);
};
export default withAuthentication;