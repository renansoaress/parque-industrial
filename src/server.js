const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://parqueindustri01:01020304@mongo71-farm76.kinghost.net/parqueindustri01', { useNewUrlParser: true })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

/*mongoose.connect('mongodb://localhost/parque_industrial')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));*/

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
