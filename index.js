// index.js
// where your node app starts

// init project
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const multer = require('multer');
// file size rounded in megabytes
const fileSizeLimitInMB = process.env.FILE_SIZE_LIMIT_IN_MB || 2;
const fileSizeLimitInBytes = fileSizeLimitInMB * 1024 * 1024;
const fileUpload = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'public')
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, file.originalname)
  //   }
  // }),
  limits: {
    fileSize: fileSizeLimitInBytes,
    files: 1,
  },
}).single('upfile');

app.use(cors());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function(req, res) {
  fileUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.send({
          'error': 'Sorry, the file you\'re trying to upload exceeds the maximum allowed size of ' + fileSizeLimitInMB + ' MB.'
        });
      }

      return res.send({'error': err});
    }

    // When you submit a file, you receive the file `name`, `type`,
    // and `size` in bytes within the JSON response.
    res.json({
      'name': req.file.originalname,
      'type': req.file.mimetype,
      'size': req.file.size,
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port);
});
