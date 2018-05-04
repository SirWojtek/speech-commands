# speech-commands

## Introduction

speech-commands is a simple attempt to convert a user (programmer) speech into phrase for text editor.

## How it works?

1. After start `atom-plugin` grabs list of words from all opened text editors and sends it for `listener`.
2. `listener` init a voice recording process and after it gets voice command send it to Google Cloud.
3. After `listerer` gets parsed text it tries to replace signs and guess correct words basing on context.
4. `listener` sends response to `atom-plugin` with its guess, plugin inserts it into current cursor position.


## Setup
* for `atom-plugin`: you'll need to `npm install` inside its directory and add plugin into Atom editor
* for `listener`: `npm install` and put file named `gcloud.pass.json` which contains API key for your Google Cloud account


## Note
This is a VERY primitive approach for the difficult topic of speech recognition and translation.
If you want to learn more or you are just an enthusiast, please feel free to e-mail me.
