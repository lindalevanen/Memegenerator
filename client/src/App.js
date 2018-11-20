import React, { Component } from "react";
import Routes from './Routes'
import Header from './components/Header'

class App extends Component<Props>  {
  render() {
    return (
      <div>
        <Header />
        <Routes />
      </div>
    );
  }
}

export default App
