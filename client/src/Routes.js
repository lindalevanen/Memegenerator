import React from "react"
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'
import Create from './components/Create'
import Browse from './components/Browse'

const ContentWrapper = styled.div`
  margin-top: 100px;
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
