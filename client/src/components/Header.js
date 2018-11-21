import React from "react";
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router";

import Colors from './../colors'

//TODO: move styled-components to a style file
const HeaderWrapper = styled.div`
  z-index: 10;
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

const Header = (props) => {
  const path = props.location.pathname
  const activeLocation = 
    path === "/create" || path === "/" ? "create"
    : path === "/browse" ? "browse" : ""

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Link to='/create'>
          <p id='logo'>MG</p>
        </Link>
        <NavItems>
          <Link className={activeLocation === "create" ? "active" : ""} to='/create'>
          	<p>Create</p>
          </Link>
          <Link className={activeLocation === "browse" ? "active" : ""} to='/browse'>
          	<p>Browse</p>
        	</Link>
        </NavItems>
      </HeaderContent>
    </HeaderWrapper>
  )
}

export default withRouter(Header)
