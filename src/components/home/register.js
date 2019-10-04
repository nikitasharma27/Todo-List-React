import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import './home.scss';

class register extends Component {

    state = {
        email: "",
        password: "",
        // alreadyRegistered: false
    }

    handleChange = event =>{
        this.setState({ [event.target.name]:event.target.value })
    }

    submitForm = (event) => {
        event.preventDefault();

        const url = 'https://engine-staging.viame.ae/assessment/users';
        const data = {users: { email: this.state.email, password: this.state.password }}
        fetch(url, { 
            method: 'POST',
            body: JSON.stringify(data),
            headers:{ 'Content-Type': 'application/json' } 
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(response => {
            console.log('Success:', response);
            this.props.changeForm();
        }) 
    }

    render() {
        let enabledReg = this.state.email.length > 0 && this.state.password.length > 0;
        return (
            <Form onSubmit={this.submitForm} className="text-center loginForm">
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
                <Button className="submitBtn" disabled={!enabledReg} variant="primary" type="submit">Submit</Button>
                <Link className="redirectBtn" onClick={this.props.changeForm} to="/">Already have an account? So, login</Link>
            </Form>
        )
    }
}

export default register;