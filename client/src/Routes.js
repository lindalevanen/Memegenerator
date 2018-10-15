import React from "react"
import { Switch, Route } from 'react-router-dom'
import Create from './components/Create'
import Browse from './components/Browse'


const Routes = () => (
  <Switch>
    <Route exact path='/' component={Create}/>
    <Route path='/create' component={Create}/>
    <Route path='/browse' component={Browse}/>
  </Switch>
)

export default Routes
