'use strict';

var express = require('express');
var app = express();
require('dotenv').config({ silent: true });
var multer  = require('multer');
var fileSizeLimit = 2000000;
var upload = multer({
    limits: { fileSize: fileSizeLimit, files: 1 }
}).single('mks-upload');

app.set('view options', {layout: false});
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 8080;

app.post('/get-file-size', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                return res.send({
                    'error': 'The maximum file size limit for uploads is ' + fileSizeLimit,
                    'details': err
                });
            }
            return res.send({ 'error': err });
        }

        res.json({ 'size': req.file.size });
    });
});

app.listen(port);

