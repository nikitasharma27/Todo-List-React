import React, {Component} from 'react';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import './todo.scss';

class ToDo extends Component {
    state = {
        title: "",
        description: "",
        status: "",
        show : false,
        tasks: []
    }

    refreshTasks = () => {
        const url = 'https://engine-staging.viame.ae/assessment/user/list';
        const tokk = localStorage.getItem("token");
        fetch(url, { 
            method: 'GET',
            headers:{ 'x-access-token': tokk } 
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(response => {
            console.log('Success:', response);
            this.setState({tasks: response});
        });
    }

    componentDidMount = () => {
        this.refreshTasks();
    }

    renderStatus(param) {
        switch(param) {
          case 1:
            return "Created";
          case 2:
            return "Working";
          case 3:
            return "Finished";
          case 4:
            return "Cancelled";
          default:
            return "Created";
        }
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleModalChange = event => {this.setState({ [event.target.name]:event.target.value })}

    addNewTask = () => {
        const url = 'https://engine-staging.viame.ae/assessment/user/task';
        const tokk = localStorage.getItem("token");
        const data = {todolist: { title: this.state.title, description: this.state.description, status:1 }}
        fetch(url, { 
            method: 'POST',
            body: JSON.stringify(data),
            headers:{ 'Content-Type': 'application/json', 'x-access-token': tokk }
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(response => {
            console.log('Success:', response);
            this.handleClose();
            this.refreshTasks();
        });
    }

    deleteTask = (id) => {
        const url = 'https://engine-staging.viame.ae/assessment/user/task/'+ id;
        const tokk = localStorage.getItem("token");
        fetch(url, { 
            method: 'DELETE',
            headers:{'x-access-token': tokk} 
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(response => {
            console.log('Success:', response);
            this.refreshTasks();
        });
    }

    updateTask = (task, status) => {
        const url = 'https://engine-staging.viame.ae/assessment/user/task/'+ task._id;
        const data = {todolist: { title: task.title, description: task.description, status:status }}
        fetch(url, { 
            method: 'PUT',
            body: JSON.stringify(data),
            headers:{ 'Content-Type': 'application/json', 'x-access-token': 'ca7fe1db6188a235dabc9c1457d82e636b11a543' } 
        }).then(res => res.json()
        ).catch(error => console.error('Error:', error)
        ).then(response => {
            console.log('Success:', response);
            this.refreshTasks();
        });
    }

    logOut = () => {
        localStorage.removeItem("token");
        this.props.userLoggedOut();
    }

    render() {
        const tasks = this.state.tasks;
        const show = this.state.show;
        return (
            <Container className="todoList">
                <Row>
                    <Col className="alignBtn">
                        <Button id="logOut" variant="secondary" type="button" onClick={this.logOut}>Logout</Button>
                        <Button id="newTask" variant="primary" onClick={this.handleShow} type="button"> + New Task</Button>  
                    </Col>
                </Row>
                <Row className="todoBox">
                    {tasks.length === 0 && <h3>No tasks found!</h3>}
                    {tasks.length>0 && <Table responsive>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{this.renderStatus(task.status)}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">Actions </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={ () => {this.updateTask(task, 3)} }>Finished</Dropdown.Item>
                                                <Dropdown.Item onClick={ () => {this.updateTask(task, 2)} }>Working</Dropdown.Item>
                                                <Dropdown.Item onClick={ () => {this.updateTask(task, 4)} }>Cancel Task</Dropdown.Item>
                                                <Dropdown.Item onClick={ () => {this.deleteTask(task._id)} }>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
                </Row>
                <Modal show={show} onHide={this.handleClose} className="newModal">
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="text-center newTaskForm">
                            <Form.Group controlId="title">
                                <InputGroup>
                                    <Form.Control type="text" name="title" placeholder="Enter task title" maxlength="30" onChange={this.handleModalChange} required />
                                    <Form.Control.Feedback type="invalid">Please enter title for the task</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="description">
                                <InputGroup>
                                    <Form.Control as="textarea" type="text" name="description" placeholder="Enter task description" onChange={this.handleModalChange} />
                                    <Form.Control.Feedback type="invalid">Please enter a valid description for the task</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.addNewTask}>Add Task</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        )
    }
}

export default ToDo;