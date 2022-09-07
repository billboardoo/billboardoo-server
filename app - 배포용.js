const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const vhost = require('vhost');

const albumRouter = require('./routes/api');
const chartRouter = require('./routes/charts');
const chartNewRouter = require('./routes/chartsNew');
const waklonRouter = require('./routes/waklon');
const authRouter = require('./routes/auth');

const app1 = express();
app1.use(bodyParser.urlencoded({extended: false}));
app1.use(bodyParser.json());

app1.use('/api', albumRouter);
app1.use('/api/charts', chartRouter);
app1.use('/api/charts/new', chartNewRouter);
app1.use('/news/thumbnail', express.static('./images'));
app1.use('/lyrics', express.static('./lyrics'));
app1.use('/auth', authRouter);

app1.use(express.static(path.join(__dirname, 'build')));
app1.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
})

const app2 = express();
app2.use(bodyParser.urlencoded({extended: false}));
app2.use(bodyParser.json());
app2.use('/api/waklon/', waklonRouter);
app2.use(express.static(path.join(__dirname, 'waklon')));
app2.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'waklon/index.html'));
})

const app = express();
app.use(vhost('billboardoo.com', app1));
app.use(vhost('waklon.billboardoo.com', app2));


app.listen(80, () => console.log('Running'));
