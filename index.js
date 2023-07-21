const express = require('express');
const path = require('path');
const { readFile } = require('fs').promises;

const app = express();


app.use(express.static(path.join(__dirname, 'my-react-app/build')));

//API endpoints go here


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/build', 'index.html'));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port ${port}');
});
