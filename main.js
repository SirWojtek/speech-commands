#!/bin/env node

const { SpeechClient } = require('@google-cloud/speech');
const record = require('node-record-lpcm16');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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

app.post('/', (req, res) => {
  const client = new SpeechClient({ keyFilename: 'gcloud.pass.json' });
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data =>
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : `\n\nReached transcription time limit, press Ctrl+C\n`
      )
    );

  record.start({ sampleRate: sampleRateHertz })
  .on('error', console.error)
  .pipe(recognizeStream);

  res.end();
});

app.listen(3000, () => console.log('Listening on port 3000!'))
