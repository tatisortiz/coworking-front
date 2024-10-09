import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

const RoomModal = ({ open, assistants = [], handleClose }) => {
  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Información de la sala</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {assistants.length === 0 && <p>Sin asistentes</p>}
            <ListGroup>
                {assistants.map((item, index) => (
                    <ListGroup.Item key={index}>
                    {item.Person.firstName} {item.Person.lastName} ({item.Person.email})
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomModal;