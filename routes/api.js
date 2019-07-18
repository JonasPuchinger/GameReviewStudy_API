const express = require("express");
const router = express.Router();
const GoogleSpreadsheet = require("google-spreadsheet");
const creds = require("../helpers/config-creds.json");
const spreadsheetConfig = require("../helpers/spreadsheet-config.json");

const doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheetKey);
let sheet;
let reviewSheet;
let questionsSheet;
let emailSheet;

doc.useServiceAccountAuth(creds, setSheets);

function setSheets() {
    doc.getInfo(function(err, info) {
        sheet = info.worksheets[0];
        reviewSheet = info.worksheets[1];
        questionsSheet = info.worksheets[2];
        emailSheet = info.worksheets[3];
    });
}

router.get("/get-sheet", function(req, res, next) {
    res.json(sheet);
});

router.get("/get-backup-sheet", function(req, res, next) {
    res.json(backupSheet);
});

router.get("/get-email-sheet", function(req, res, next) {
    res.json(emailSheet);
});

router.get("/get-next-captcha", function(req, res, next) {
    reviewSheet.getRows(function(err, rows) {
        captchas = rows.map((row) => row["captchatype"]);
        captchaCounts = captchas.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
        captchaCountsSorted = Object.keys(captchaCounts).sort((a, b) => (captchaCounts[a] - captchaCounts[b]));
        res.json(captchaCountsSorted);
    });
});

router.post("/insert-row", function(req, res, next) {
    let data = req.body;
    console.log(data);
    sheet.addRow(data, function(err, row) {
        // console.log(row);
        res.send(row);
    });
});

router.post("/insert-review-backup", function(req, res, next) {
    let data = req.body;
    console.log(data);
    reviewSheet.addRow(data, function(err, row) {
        console.log(row);
        res.send(row);
    });
});

router.post("/insert-questions-backup", function(req, res, next) {
    let data = req.body;
    console.log(data);
    questionsSheet.addRow(data, function(err, row) {
        console.log(row);
        res.send(row);
    });
});

router.post("/insert-email", function(req, res, next) {
    let data = req.body;
    console.log(data);
    emailSheet.addRow(data, function(err, row) {
        console.log(row);
        res.send(row);
    });
});

module.exports = router;