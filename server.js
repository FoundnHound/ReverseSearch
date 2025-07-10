const express = require('express');
const datamuse = require('datamuse');
const functions = require('./public/functions.js')
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World! from Backend' });
    });

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});

app.post('/api/meansLike', (req, res) => {
  const text = req.body.text;
  console.log(req.body.text);
  datamuse.words({
    ml: text
  })
    .then(result => {
      res.json({ result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Datamuse API failed', details: err.message });
    });
});

app.post('/api/defineWord', (req, res) => {
  const word = req.body.word;
  console.log('https://api.dictionaryapi.dev/api/v2/entries/en/');
  const url  = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    })
    .then(entries => {
      const entry = entries[0] || {};
      const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || '';
      const definition = entry.meanings?.[0]?.definitions?.[0]?.definition || '';
      res.json({ word, phonetic, definition });
    })
    .catch(err => {
      console.error('Dictionary proxy error:', err);
      res.status(502).json({ error: 'Dictionary fetch failed' });
    });
});