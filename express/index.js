const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const AuthApi = require('./routes/api.auth.js');
const cors = require('cors');

mongoose.connect(config.get("mongoLink"), {useNewUrlParser: true, useUnifiedTopology: true}); // mongodb connection
const db = mongoose.connection;

db.setMaxListeners(10);
db.once('open', async() => {console.error('Connected to Database')});

const router = express.Router();
const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthApi);

router.get('/ping', (res, req)=>{
    return req.send("pong");
});

app.listen(port, '0.0.0.0', ()=>{
    console.log('Auth backend started on http://109.234.37.59:4000/'); // started on my own server
});