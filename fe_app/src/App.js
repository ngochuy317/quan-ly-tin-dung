import React from "react";
import './App.css';
import Layout from "./components/Layout/layout";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: localStorage.getItem(localStorage.getItem("authenticated") || false),
    }
  }

  setAuthenticated = () => {
    this.setState({
      authenticated: true
    })
  }

  render() {
    return (
      <Layout />
    );
  }
}

export default App;