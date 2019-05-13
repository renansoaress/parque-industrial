const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://renan:hUCr7HGpcd7weEr@cluster0-6fh2o.mongodb.net/parque_industrial')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Apis
app.use('/api/machines', require('./apis/apiMachine'));
app.use('/api/status', require('./apis/apiStatus'));
app.use('/api/cron', require('./apis/apiCron'));

// Static files
app.use(express.static(__dirname + '/public'));

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});