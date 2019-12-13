import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const ModalLogin = () => {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <Button variant="warning" className="loginButton" onClick={handleShow}>
              Login / Register
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                    Login form will be implemented sometime in the future
                    </div>
                    <Button variant="warning" onClick={handleClose}>
                    Close
                    </Button>
                    <p>Don't have an account? <Link as={Link} to="/register">Register</Link> for free:)</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ModalLogin;