import React from "react";
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import "./../App.css";

const HeaderWrapper = styled.div`
	height: 100px;
	background: #171717;

	a {
		text-decoration: none;
		float: right;
		height: 100%;
		text-align: center;
	}
`

const NavLink = styled.p`
	color: white;
	padding: auto;
	margin: 10px;
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
