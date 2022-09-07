const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/chart.db');

function getDateStr(day){
    let yyyy = String(day.getFullYear()).slice(2, 4);
    let mm = Number(day.getMonth()) + 1;
    let dd = day.getDate();

    mm = String(mm).length === 1 ? '0' + mm : mm;
    dd = String(dd).length === 1 ? '0' + dd : dd;
    return parseInt(`${yyyy}${mm}${dd}`);
}

function convertDate(date) {
    let year = date.slice(0, 2);
    let month = date.slice(2, 4);
    let day = date.slice(4, 6);
    return `20${year}-${month}-${day}`;
}

function findDB(req, res, dateStart, dateEnd, datePrevious, dateNext) {
    if (dateStart < 150101) return res.sendStatus(400)
    db.all(`SELECT * FROM total WHERE date >= ${dateStart} AND date <= ${dateEnd} ORDER BY date DESC`, (err, rows) => {
        return res.json({
            'start': dateStart, 'end': dateEnd, 'previous': datePrevious, 'next': dateNext, 'data': rows
        });
    });
}

function getYearly(req, res) {
    let date = new Date();
    if (req.params.date) {
        date = new Date(convertDate(req.params.date));
    }
    let datePrevious = getDateStr(new Date(date.getFullYear() - 1, 0, 1));
    let dateNext = getDateStr(new Date(date.getFullYear() + 1, 0, 1));
    let dateStart = getDateStr(new Date(date.getFullYear(), 0, 1));
    let lastDay = new Date(date.getFullYear() + 1, 0, 0);
    let dateEnd = getDateStr(lastDay);
    findDB(req, res, dateStart, dateEnd, datePrevious, dateNext);
}

function getMonthly(req, res) {
    let date = new Date();
    if (req.params.date) {
        date = new Date(convertDate(req.params.date));
    }
    let datePrevious = getDateStr(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    let dateNext = getDateStr(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    let dateStart = getDateStr(new Date(date.getFullYear(), date.getMonth(), 1));
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let dateEnd = getDateStr(lastDay);
    findDB(req, res, dateStart, dateEnd, datePrevious, dateNext);
}

function getWeekStart(day) {
    let year = day.getFullYear();
    let month = day.getMonth();
    let date = day.getDate();
    switch (day.getDay()) {
        case 0:
            return new Date(year, month, date - 5);
        case 1:
            return day;
        case 2:
            return new Date(year, month, date - 1);
        case 3:
            return new Date(year, month, date - 2);
        case 4:
            return new Date(year, month, date - 3);
        case 5:
            return new Date(year, month, date - 4);
        case 6:
            return new Date(year, month, date - 5);
    }
}

function getWeekEnd(day) {
    let year = day.getFullYear();
    let month = day.getMonth();
    let date = day.getDate();
    switch (day.getDay()) {
        case 0:
            return day;
        case 1:
            return new Date(year, month, date + 6);
        case 2:
            return new Date(year, month, date + 5);
        case 3:
            return new Date(year, month, date + 4);
        case 4:
            return new Date(year, month, date + 3);
        case 5:
            return new Date(year, month, date + 2);
        case 6:
            return new Date(year, month, date + 1);
    }
}

function getWeekly(req, res) {
    let date = new Date();
    if (req.params.date) date = new Date(convertDate(req.params.date));

    let dateStart = getWeekStart(date);
    let dateEnd = getWeekEnd(date);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let datePrevious = getWeekStart(new Date(year, month, day - 6));
    let dateNext = getWeekStart(new Date(year, month, day + 7));
    findDB(req, res, getDateStr(dateStart), getDateStr(dateEnd), getDateStr(datePrevious), getDateStr(dateNext));
}

router.get('/yearly', (req, res) => {
    return getYearly(req, res);
});

router.get('/yearly/:date', (req, res) => {
    return getYearly(req, res);
});

router.get('/monthly', (req, res) => {
    return getMonthly(req, res);
});

router.get('/monthly/:date', (req, res) => {
    return getMonthly(req, res);
});

router.get('/weekly', (req, res) => {
    return getWeekly(req, res);
});

router.get('/weekly/:date', (req, res) => {
    return getWeekly(req, res);
});

module.exports = router;