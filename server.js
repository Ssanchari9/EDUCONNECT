import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';
import { AdaptiveLearningService } from './src/ml/services/AdaptiveLearningService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend URL
  credentials: true
}));

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the Adaptive Learning Service
const learningService = new AdaptiveLearningService(10, 64, 5);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Proxy endpoint for attendance data
app.post('/api/attendance/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Make request to institutional portal
    const response = await axios.post('https://academia.institution.edu/student', 
      new URLSearchParams({
        username: email,
        password: password,
        submit: 'Login'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      }
    );
    
    // Return the HTML response
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
});

// Proxy endpoint for attendance data with token
app.get('/api/attendance/token', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Make request to institutional portal with token
    const response = await axios.get('https://academia.institution.edu/student/attendance', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    // Return the HTML response
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching attendance data with token:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
});

// Proxy endpoint for timetable data
app.get('/api/timetable', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Make request to institutional portal with token
    const response = await axios.get('https://academia.institution.edu/student/timetable', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    // Return the HTML response
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching timetable data:', error);
    res.status(500).json({ error: 'Failed to fetch timetable data' });
  }
});

// API Endpoints
app.post('/api/learning/initialize', async (req, res) => {
  try {
    const { classifierPath, sequentialData } = req.body;
    await learningService.initialize(classifierPath, sequentialData);
    res.json({ message: 'Learning system initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/learning/path', async (req, res) => {
  try {
    const { studentData } = req.body;
    const personalizedPath = await learningService.getPersonalizedPath(studentData);
    res.json(personalizedPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/learning/update', async (req, res) => {
  try {
    const { studentData, newInteraction } = req.body;
    await learningService.updateStudentModel(studentData, newInteraction);
    res.json({ message: 'Student model updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 