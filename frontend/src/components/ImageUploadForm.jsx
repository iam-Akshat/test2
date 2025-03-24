import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { uploadImage } from '../api/image';

const ImageUploadForm = ({ show, onHide, onImageUploaded }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files && files[0]) {
      setForm({
        ...form,
        file: files[0]
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.file) {
      setError('Please select an image file');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', form.file);
      formData.append('title', form.title);
      formData.append('description', form.description);
      
      await uploadImage(formData);
      
      setForm({ title: '', description: '', file: null });
      setPreview(null);
      onHide();
      
      if (onImageUploaded) {
        onImageUploaded();
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ title: '', description: '', file: null });
    setPreview(null);
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload New Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter image title"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter image description"
              rows={3}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </Form.Group>
          
          {preview && (
            <div className="text-center mb-3">
              <p className="mb-1">Preview:</p>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
                className="border rounded"
              />
            </div>
          )}
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImageUploadForm;