const express = require('express');
const app = express();
const port = 3000;


const indexRoute = require('./routes/index.route');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRoute);

app.get('/', (req, res) => {
   res.status(200).send({
        message: 'Welcome to the MySQL Partitioning Lab!',
        status: 'Running on port ' + port
   });
});


app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});