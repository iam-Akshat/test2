import React, { useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { updateImageDetails, deleteImage } from '../api/image';

const ImageManager = ({ images, onReorder, onImagesChanged, loading }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', title: '', description: '' });
  const [error, setError] = useState(null);

  const handleEditClick = (image) => {
    setEditForm({
      id: image._id,
      title: image.title,
      description: image.description
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateImageDetails(editForm._id, {
        title: editForm.title,
        description: editForm.description
      });
      setShowEditModal(false);
      if (onImagesChanged) onImagesChanged();
    } catch (err) {
      setError('Failed to update image details. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id);
        if (onImagesChanged) onImagesChanged();
      } catch (err) {
        setError('Failed to delete image. Please try again.');
        console.error(err);
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);
    
    onReorder(reorderedImages);
  };

  return (
    <>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <h4 className="mb-3">Manage Images</h4>
      <p className="text-muted mb-3">Drag and drop to reorder images in the carousel</p>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="image-list" direction="horizontal">
          {(provided) => (
            <Row 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="image-list flex-nowrap overflow-auto"
            >
              {images.map((image, index) => (
                <Draggable key={image._id} draggableId={image._id?.toString()} index={index} >
                  {(provided) => (
                    <Col 
                      xs={6} md={4} lg={3}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-3"
                    >
                      <Card>
                        <Card.Img 
                          variant="top" 
                          src={image.imageData} 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title>{image.title}</Card.Title>
                          <Card.Text className="text-truncate">{image.description}</Card.Text>
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEditClick(image)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteImage(image._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                rows={3}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageManager;