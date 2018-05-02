#!/bin/env node

const { SpeechClient } = require('@google-cloud/speech');
const record = require('node-record-lpcm16');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const client = new SpeechClient({ keyFilename: 'gcloud.pass.json' });
const notifier = require('node-notifier');

const { textToCode } = require('./text-to-code.js');

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
    model: 'command_and_search'
  },
  interimResults: false,
};

app.post('/', (req, res) => {
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      notifier.notify({
        title: 'speech-commands',
        message: 'Recording finished'
      });
      record.stop();
      res.json(textToCode({
        text: data.results[0].alternatives[0].transcript,
        context: req.body.context,
      }));
      res.end();
    });

  notifier.notify({
    title: 'speech-commands',
    message: 'Recording started'
  });
  record.start({ sampleRate: sampleRateHertz })
  .on('error', console.error)
  .pipe(recognizeStream);
});

app.listen(3000, () => console.log('Listening on port 3000!'))
