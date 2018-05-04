'use babel';

import { CompositeDisposable } from 'atom';
const request = require('request-promise');
const _ = require('lodash');

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'speech-commands:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
  },

  serialize() {
  },

  toggle() {
    const wordsList = getWordsList();

    requestVoiceInsert(wordsList)
    .then(res => atom.workspace.getActiveTextEditor().insertText(res.code));
  }
};

function getWordsList() {
  return _.uniq(
    atom.workspace.getTextEditors().reduce((res, editor) => (
      [ ...res, ...editor.getText().split(/\W/).filter(Boolean) ]
    ), [])
  );
}

function requestVoiceInsert(context) {
  return request({
    method: 'POST',
    uri: 'http://localhost:3000/',
    body: {
      context
    },
    json: true
  });
}

