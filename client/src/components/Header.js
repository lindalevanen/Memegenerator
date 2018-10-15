import React from "react";
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import "./../App.css";

const HeaderWrapper = styled.div`
  height: 100px;
  width: 100%;
  top: 0;
  position: fixed;
  background: #171717;

  a {
    text-decoration: none;
    float: right;
    height: 100%;
    line-height: 100%;
    text-align: center;
  }
`

const NavLink = styled.p`
  color: white;
  padding: 10px;
  top: 50%;
`

const Header = (props) => (
  <HeaderWrapper>
    <Link to='/create'>
    	<NavLink>Create</NavLink>
    </Link>
    <Link to='/browse'>
    	<NavLink>Browse</NavLink>
  	</Link>
  </HeaderWrapper>
)

export default Header
