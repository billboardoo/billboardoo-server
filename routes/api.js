const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/static.db');


router.get('/', (req, res) => {
    res.sendStatus(200);
});

router.get('/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY time DESC', (err, rows) => {
        return res.json(rows);
    });
});

router.get('/albums/:artist', (req, res) => {
    db.get(`SELECT * FROM albums WHERE artist = "${req.params.artist}"`, (err, rows) => {
        if (!rows) return null;
        const chart = new sqlite3.Database('./database/chart.db');
        chart.all(`SELECT * FROM total WHERE id IN ("${rows.ids.split(',').join('","')}") ORDER BY date DESC`, (err, rows) => {
            res.json(rows);
        });
    });
});

router.get('/news', (req, res) => {
    db.all(`SELECT * FROM news ORDER BY time DESC`, (err, rows) => {
        return res.json(rows);
    });
});

router.get('/artist/:artist', (req, res) => {
    db.get(`SELECT * FROM artists WHERE id = "${req.params.artist}"`, (err, rows) => {
        return res.json(rows);
    });
});

router.get('/artists', (req, res) => {
    db.all('SELECT * FROM artists', (err, rows) => {
        return res.json(rows);
    });
});

module.exports = router;
