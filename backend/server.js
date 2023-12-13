// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Use cors middleware to allow all origins (you might want to restrict this in production)
app.use(cors());
// Middleware to parse JSON
app.use(bodyParser.json());

const findHighestId = () => {
  const posts = require('./db.json').posts;
  const ids = posts.map((post) => parseInt(post.id, 10));
  return Math.max(...ids);
};

// Custom middleware to generate IDs based on the highest existing ID
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/posts') {
    const highestId = findHighestId();
    req.body.id = (highestId + 1).toString();
  }
  next();
});

// Use JSON server for API
const jsonServerRouter = jsonServer.router('db.json');
app.use('/api', jsonServerRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`API Server is listening on port ${PORT}`);
});
