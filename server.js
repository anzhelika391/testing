const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));



app.get('/get-questions', (req, res) => {
    const filePath = path.join(__dirname, 'questions.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading questions file:', err);
            return res.status(500).json({ message: 'Error reading questions file' });
        }
        res.json(JSON.parse(data));  // Return the questions as a JSON response
    });
});





// Endpoint to get previous results from results.json
app.get('/get-prev-result', (req, res) => {
    const filePath = path.join(__dirname, 'result.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading results file:', err);
            return res.status(500).json({ message: 'Error reading result.json file' });
        }
        res.json(JSON.parse(data));  // Return the previous results as a JSON response
    });
});




// API endpoint to save test results
app.post('/save-results', (req, res) => {
    const resultData = req.body;  // This is the current test result

    const filePath = path.join(__dirname, 'result.json');

    // Write the current result to results.json, overwriting the file
    fs.writeFileSync(filePath, JSON.stringify([resultData], null, 2));  // Overwriting with only the current result

    // Send a success response
    res.status(200).json({ message: 'Results saved successfully' });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
