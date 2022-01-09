const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const mongoose = require('mongoose');
const AuthApi = require('./routes/api.auth.js');
const schemas = require('./schemas/schemas');
const cors = require('cors');

mongoose.connect(config.get("mongoLink"), {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.setMaxListeners(10);
db.once('open', async() => {console.error('Connected to Database')});

const router = express.Router();
const port = 3600;
const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthApi);

router.get('/ping', (res, req)=>{
    return req.send("pong");
});

app.listen(port, ()=>{
    console.log('Auth backend started on http://localhost:3600');
});