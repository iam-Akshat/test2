import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { fetchImages, reorderImages } from './api/image';
import ImageCarousel from './components/ImageCarousel';
import ImageUploadForm from './components/ImageUploadForm';
import ImageManager from './components/ImageManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(5000); 

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await fetchImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorderImages = async (reorderedImages) => {
    try {
      setLoading(true);
      const imageOrders = reorderedImages.map((img, index) => ({
        id: img._id,
        sequence: index
      }));
      await reorderImages(imageOrders);
      setImages(reorderedImages);
    } catch (err) {
      setError('Failed to reorder images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIntervalChange = (newInterval) => {
    setAutoplayInterval(newInterval);
  };

  return (
    <Container className="py-5" style={{width:'1000px'}}>
      <h1 className="text-center mb-4">Image Carousel</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <ImageCarousel 
            images={images} 
            autoplayInterval={autoplayInterval} 
            onIntervalChange={handleIntervalChange}
          />
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            Add New Image
          </Button>
          
          <div className="d-flex align-items-center">
            <span className="me-2">Autoplay Interval (ms):</span>
            <input 
              type="number" 
              min="1000" 
              step="1000" 
              value={autoplayInterval} 
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="form-control" 
              style={{width: '100px'}} 
            />
          </div>
        </Col>
      </Row>
      
      <ImageManager 
        images={images} 
        onReorder={handleReorderImages}
        onImagesChanged={loadImages}
        loading={loading}
      />
      
      <ImageUploadForm 
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onImageUploaded={loadImages}
      />
    </Container>
  );
}

export default App;