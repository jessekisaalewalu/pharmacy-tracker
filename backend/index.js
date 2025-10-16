const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, init } = require('./db');
const pharmaciesRouter = require('./routes/pharmacies');


const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());


init();


app.use('/api/pharmacies', pharmaciesRouter);


app.get('/', (req, res) => res.send('Pharmacy backend is running'));


app.listen(PORT, () => console.log(`Backend listening at http://localhost:${PORT}`));