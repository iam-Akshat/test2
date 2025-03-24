import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';

const ImageCarousel = ({ images, autoplayInterval = 3000, onIntervalChange }) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayRef = useRef(null);

  useEffect(() => {
    if (isPlaying && images.length > 1) {
      autoplayRef.current = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoplayInterval);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPlaying, autoplayInterval, images.length]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (images.length === 0) {
    return (
      <div className="text-center p-5 bg-light rounded">
        <p>No images available. Add some images to get started.</p>
      </div>
    );
  }

  return (
    <div className="carousel-container container-fluid">
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect}
        interval={null}
        indicators={true}
        controls={true}
        className="w-100" // Ensure full width
      >
        {images.map((image) => (
          <Carousel.Item key={image._id} className="text-center">
            <div 
              className="d-flex justify-content-center align-items-center" 
              style={{ 
                height: '400px', 
                width: '100%',   
                overflow: 'hidden' 
              }}
            >
              <img
                className="img-fluid" 
                src={image.imageData}
                alt={image.title}
                style={{ 
                  maxHeight: '100%', 
                  maxWidth: '100%', 
                  objectFit: 'contain' 
                }}
              />
            </div>
            <Carousel.Caption>
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      
      <div className="carousel-controls mt-2 d-flex justify-content-center">
        <button 
          className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'} mx-2`}
          onClick={togglePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;