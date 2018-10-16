import React from "react";
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Colors from './../colors'

import "./../App.css";

const HeaderWrapper = styled.div`
  z-index: 1;
  position: fixed;
  height: 80px;
  width: 100%;
  top: 0;
  background: ${Colors.header.bg};
`

const HeaderContent = styled.div`
  width: 100%;
  height: 100%;
  max-width: 700px;
  margin: auto;

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
    font-size: 40px;
    font-weight: bold;
  }

  a {
    display: inline;
    text-decoration: none;
    height: 100%;
    padding: 0 10px;
    margin-left: 20px;
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
    margin-right: 20px;
    padding: 0 10px;
  }
`

const Header = (props) => (
  <HeaderWrapper>
    <HeaderContent>
      <Link to='/create'>
        <p id='logo'>MG</p>
      </Link>
      <NavItems>
        <Link to='/create'>
        	<p>Create</p>
        </Link>
        <Link to='/browse'>
        	<p>Browse</p>
      	</Link>
      </NavItems>
    </HeaderContent>
  </HeaderWrapper>
)

export default Header
