const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// allow the frontend to send requests
app.use(cors({ origin: '*' }));
app.use(express.json());

// connect our routes files
app.use('/api/images',          require('./routes/images'));
app.use('/api/sessions',        require('./routes/sessions'));
app.use('/api/validate',        require('./routes/validate'));
app.use('/api/leaderboard',     require('./routes/leaderboard'));

// simple health check - visit this to confirm the server is running
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!'});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});