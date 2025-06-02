const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const db = require('./data/database');
const routes = require('./routes');


dotenv.config();
const app = express();

app.use(express.json());




app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/',routes);



app.get('/', (req, res) => {
    res.send('Welcome to the Book Review API');
});



app.use('/', require('./routes/index'));

const port = process.env.PORT || 3000;

db.initdb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});