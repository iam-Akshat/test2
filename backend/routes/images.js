const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ sequence: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Get current maximum sequence number
    const maxSequenceImage = await Image.findOne().sort('-sequence');
    const newSequence = maxSequenceImage ? maxSequenceImage.sequence + 1 : 0;

    // Convert buffer to base64 string
    const base64Image = req.file.buffer.toString('base64');
    const base64ImageWithPrefix = `data:${req.file.mimetype};base64,${base64Image}`;

    const newImage = new Image({
      title: req.body.title,
      description: req.body.description || '',
      imageData: base64ImageWithPrefix,
      mimetype: req.file.mimetype,
      size: req.file.size,
      sequence: newSequence
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reorder', async (req, res) => {
    try {
      const { imageOrders } = req.body;
      
      if (!imageOrders || !Array.isArray(imageOrders)) {
        return res.status(400).json({ message: 'Invalid image order data' });
      }
      
      // Update sequence for each image
      for (const item of imageOrders) {
        await Image.findByIdAndUpdate(item.id, { sequence: item.sequence });
      }
      
      const updatedImages = await Image.find().sort({ sequence: 1 });
      res.json(updatedImages);
    } catch (error) {
      console.error('Error reordering images:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, sequence } = req.body;
    
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Update fields if provided
    if (title) image.title = title;
    if (description !== undefined) image.description = description;
    if (sequence !== undefined) image.sequence = sequence;

    await image.save();
    res.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from database
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;