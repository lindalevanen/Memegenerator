import React, {
  Component,
  Fragment
} from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import AppProvider from './components/AppProvider';

import Routes from './Routes'

import Navbar from './shared/Navbar';

class App extends Component  {
  render() {
    return (
      <AppProvider>
        <Router>
          <Fragment>
            <Navbar />
            <Routes />
          </Fragment>
        </Router>
      </AppProvider>
    );
  }
}

export default App
