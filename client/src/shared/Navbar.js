import React, { Fragment } from 'react';
import styled from 'styled-components'
import {
  Link,
  withRouter
} from 'react-router-dom';
import { auth } from '../firebase';
import { Consumer } from '../components/AppProvider';

import Colors from './../colors'



const Navbar = props => {

  const path = props.location.pathname
  const activeLocation = 
    path === "/create" || path === "/" ? "create"
    : path === "/browse" ? "browse" 
    : path === "/login" ? "login" 
    : path === "/register" ? "register"
    : ""

  const handleLogout = context => {
    auth.logout();
    context.destroySession();
    props.history.push('/signedOut');
  };

  return <HeaderWrapper>
      <HeaderContent>
        <Consumer>
              
        {({ state, ...context }) => (
          state.currentUser ?
            <Fragment>
              <Link to='/create'>
                <p id='logo'>MG</p>
              </Link>
              <NavItems>
                <Link className={activeLocation === "login" ? "active" : ""} onClick={handleLogout} to='/create'>
                  <p>Logout</p>
                </Link>
                <Link className={activeLocation === "create" ? "active" : ""} to='/create'>
                  <p>Create</p>
                </Link>
                <Link className={activeLocation === "browse" ? "active" : ""} to='/browse'>
                  <p>Browse</p>
                </Link>
              </NavItems>
            </Fragment>
            :
            <Fragment>
              <Link to='/create'>
                <p id='logo'>MG</p>
              </Link>
              <NavItems>
                <Link className={activeLocation === "register" ? "active" : ""} to='/register'>
                  <p>Register</p>
                </Link>
                <Link className={activeLocation === "login" ? "active" : ""} to='/login'>
                  <p>Login</p>
                </Link>
                <Link className={activeLocation === "create" ? "active" : ""} to='/create'>
                  <p>Create</p>
                </Link>
                <Link className={activeLocation === "browse" ? "active" : ""} to='/browse'>
                  <p>Browse</p>
                </Link>
              </NavItems>
            </Fragment>
        )}
        </Consumer>
      </HeaderContent>
    </HeaderWrapper>
};









const HeaderWrapper = styled.div`
  z-index: 1;
  position: fixed;
  height: 80px;
  width: 100%;
  top: 0;
  box-shadow: 0px 1px 6px black;
  background: ${Colors.header.bg};
`

const HeaderContent = styled.div`
  width: 100%;
  height: 100%;
  max-width: 700px;
  margin: auto;
  padding-left: 20px;

  p {
    display: inline;
    color: white;
    vertical-align: middle;
    line-height: 80px;
    font-weight: lighter;
  }

  #logo {
    color: ${Colors.accent};
    font-family: impact;
    font-size: 35px;
    font-weight: bold;
  }

  a {
    display: inline;
    text-decoration: none;
    height: 100%;
    padding: 0 10px;
  }
  
`

const NavItems = styled.div`
  display: inline;

  a {
    display: inline;
    float: right;
    text-decoration: none;
    height: 100%;
    margin-left: 0px;
    margin-right: 5px;
    padding: 0 15px;
  }

  .active {
    background: ${Colors.main.bg};
  }
`


export default withRouter(Navbar);