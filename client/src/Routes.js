import React from "react"
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'
import Create from './components/Create'
import Browse from './components/Browse'

const ContentWrapper = styled.div`
  margin-top: 80px;
  padding-left: 20px;
  padding-right: 20px;
  bottom: 0;
`

const Routes = () => (
  <ContentWrapper>
    <Switch>
      <Route exact path='/' component={Create}/>
      <Route path='/create' component={Create}/>
      <Route path='/browse' component={Browse}/>
    </Switch>
  </ContentWrapper>
)

export default Routes
