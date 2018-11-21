import React from "react"
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'
import Create from './components/Create'
import Browse from './components/Browse'
import Login from './components/Login'
import Signup from './components/Signup'

const ContentWrapper = styled.div`
  margin-top: 80px;
  bottom: 0;
`

const Routes = () => (
  <ContentWrapper>
    <Switch>
      <Route exact path='/'   component={Create}/>
      <Route path='/create'   component={Create}/>
      <Route path='/browse'   component={Browse}/>
      <Route path='/login'    component={Login}/>
      <Route path='/register' component={Signup}/>
    </Switch>
  </ContentWrapper>
)

export default Routes
