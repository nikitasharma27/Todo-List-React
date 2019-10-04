import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import {Link, Redirect} from 'react-router-dom';
import './home.scss';

class login extends Component {
    state = {
        email: "",
        password: "",
        loginSuccess: false
    }
    
    handleChange = event => {
        this.setState({ [event.target.name]:event.target.value })
    }

    componentDidMount(){
        localStorage.removeItem("token");
    }

    submitLoginForm = (event) => {
        event.preventDefault();

        const url = 'https://engine-staging.viame.ae/assessment/login';
        const data = {users: { email: this.state.email, password: this.state.password }}
        this.setState({submitting: false});
        fetch(url, { 
            method: 'POST',
            body: JSON.stringify(data),
            headers:{ 'Content-Type': 'application/json' } 
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(resp => {
            if (resp.token) {
                localStorage.setItem("token", resp.token);
                this.loginSuccess = true;
                this.props.userLoggedIn();
            }
        }
        ); 
    }

    render() {
        let enabled = this.state.email.length > 0 && this.state.password.length > 0;
        if(this.loginSuccess) {
            return (
            <Redirect to="/todolist" />);
        }
        return (
            <Form onSubmit={this.submitLoginForm} className="text-center loginForm">
                <Form.Group controlId="EmailInput">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-envelope"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="email" name="email" placeholder="Enter your Email ID" aria-describedby="inputGroupPrepend" onChange={this.handleChange} required />
                        <Form.Control.Feedback type="invalid">Please enter your email address.</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="PwdInput">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text><i className="fa fa-lock"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="password" name="password" placeholder="Enter your Password" aria-describedby="inputGroupPrepend" onChange={this.handleChange} required />
                        <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Button className="submitBtn" variant="primary" type="submit" disabled={!enabled}>Submit</Button>
                <Link className="redirectBtn" onClick={this.props.changeForm} to="/">Don't have an account? Register</Link>
            </Form>
        )
    }
}

export default login;