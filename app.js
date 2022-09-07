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
//app1.use('/api/waklon/', waklonRouter);
app1.use('/news/thumbnail', express.static('./src/images'));
app1.use('/artist/image/card', express.static('./src/images/artist/card'));
app1.use('/artist/image/big', express.static('./src/images/artist/big'));
app1.use('/lyrics', express.static('./src/lyrics'));
app1.use('/', authRouter);

app1.use(express.static(path.join(__dirname, 'build/billboardoo')));
app1.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/billboardoo/index.html'));
})

/*const app2 = express();
app2.use(bodyParser.urlencoded({extended: false}));
app2.use(bodyParser.json());
app2.use('/api/waklon/', waklonRouter);
app2.use(express.static(path.join(__dirname, 'build/waklon')));
app2.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/waklon/index.html'));
})*/

const app = express();
app.use(vhost('localhost', app1));


app.listen(80, () => console.log('Running'));
