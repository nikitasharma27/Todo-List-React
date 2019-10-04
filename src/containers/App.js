import React, {Component} from 'react';
// import logo from '../logo.svg';
import './App.scss';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Login from '../components/home/login';
import Register from '../components/home/register';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Todo from '../components/todo-list/todo';

class App extends Component {

  state = {
    showLogin: true,
    loggedIn: false,
    tok: ""
  }
  
  componentDidMount = () => {
    const tok = localStorage.getItem("token");
    if(tok != null) {
      this.setState(() => ({loggedIn: true}));
    }
  }

  logIn = () => {
      this.setState(prevState => ({loggedIn: !prevState.loggedIn}));
  }

  changeState =(event) => {
      this.setState(prevState => ({showLogin: !prevState.showLogin}));
  }

  render () {
    let showLogin = this.state.showLogin;
    const tok = localStorage.getItem("token");
    let styles = {};
    if (tok != null) {
      styles = {"background": "linear-gradient(to right, #78ffd6, #007991)", "color": "#fff"}
    } else {
      styles={};
    }
    return(
      <Router>
        <Container fluid={true}>
          <Row style={styles}>
            <Col>
              <header className="text-center">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <h1>ViaMe</h1>
                <p>Your Urban Delivery Partner</p>
              </header>
            </Col>
          </Row>
        </Container> 
        <Switch>
            <Route path="/" exact render={()=> {
                return (
                  <Container>
                    <Row className="justify-content-md-center"><Col xs={12} md={4}>
                    {showLogin && <Login userLoggedIn={this.logIn} changeForm={this.changeState}></Login>}
                    {!showLogin && <Register changeForm={this.changeState}></Register>}</Col></Row>
                  </Container>
            )}} />
            <Route path="/todolist" exact render={(props) => {
              if (tok != null) {
                return (<div className="todo-background">
                { <Todo {...props}  userLoggedOut={this.logIn} />}</div>);
              } else {
                return (<Redirect to="/" />);
              }
            }} />
        </Switch>
      </Router>
    )
  };
}

export default App;
