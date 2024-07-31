const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const stepsFilePath = path.join(__dirname, 'steps.json');
const resultsFilePath = path.join(__dirname, 'results.json');

const readFromFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeToFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/steps', (req, res) => {
    try {
        const steps = readFromFile(stepsFilePath);
        res.json(steps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/steps', (req, res) => {
    try {
        const steps = readFromFile(stepsFilePath);
        steps.push(req.body);
        writeToFile(stepsFilePath, steps);
        res.status(201).json(req.body);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/results', (req, res) => {
    try {
        const results = readFromFile(resultsFilePath);
        results.push(req.body);
        writeToFile(resultsFilePath, results);
        res.status(201).json(req.body);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
