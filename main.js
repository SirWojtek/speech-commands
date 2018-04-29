#!/bin/env node

const { SpeechClient } = require('@google-cloud/speech');
const record = require('node-record-lpcm16');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false,
};

app.get('/', (req, res) => {
  const client = new SpeechClient({ keyFilename: 'gcloud.pass.json' });
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      res.json({ data });
    });

  record.start({ sampleRate: sampleRateHertz })
  .on('error', console.error)
  .pipe(recognizeStream);
});

app.listen(3000, () => console.log('Listening on port 3000!'))
