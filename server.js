const express = require('express');
const datamuse = require('datamuse');
const functions = require('./public/functions.js')
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(express.json());
app.use(express.static('public'));
app.use(limiter);

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World! from Backend' });
});

app.post('/api/meansLike', (req, res) => {
  const text = req.body.text;
  console.log(req.body.text);

  if (typeof text !== 'string' || text.length === 0 || text.length > 100) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  text_scrub = text.replace(/[^a-zA-Z\s]/g, '');
  datamuse.words({
    ml: text_scrub
  })
    .then(result => {
      res.json({ result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Datamuse API failed', details: err.message });
    });
});

app.post('/api/soundsLike', (req, res) => {
  const text = req.body.text;
  console.log(req.body.text);

  if (typeof text !== 'string' || text.length === 0 || text.length > 100) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  text_scrub = text.replace(/[^a-zA-Z\s]/g, '');
  datamuse.words({
    sl: text_scrub
  })
    .then(result => {
      res.json({ result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Datamuse API failed', details: err.message });
    });
});

app.post('/api/adjectiveThatDescribes', (req, res) => {
  const text = req.body.text;
  console.log(req.body.text);

  if (typeof text !== 'string' || text.length === 0 || text.length > 100) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  text_scrub = text.replace(/[^a-zA-Z\s]/g, '');
  datamuse.words({
    rel_jjb: text_scrub
  })
    .then(result => {
      res.json({ result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Datamuse API failed', details: err.message });
    });
});

app.post('/api/nounsThatAreDescribedBy', (req, res) => {
  const text = req.body.text;
  console.log(req.body.text);

  if (typeof text !== 'string' || text.length === 0 || text.length > 100) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  text_scrub = text.replace(/[^a-zA-Z\s]/g, '');
  datamuse.words({
    rel_jja: text_scrub
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

  if (typeof word !== 'string' || word.length === 0 || word.length > 100) {
    return res.status(400).json({ error: 'Invalid word input' });
  }

  word_scrub = word.replace(/[^a-zA-Z\s]/g, '');
  const dictionary_api_url  = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word_scrub)}`;
  const wordnik_api_url = `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word_scrub)}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${process.env.WORDNIK_API_KEY}`;

  fetch(dictionary_api_url)
      .then(r => {
        if (!r.ok) throw new Error('Dictionary API request failed');
        return r.json();
      })
      .then(data => {
        // Check if Dictionary API returned "No Definitions Found" (dictionary api returned but no definition)
        if (data.title === 'No Definitions Found') {
          throw new Error('No definitions found in Dictionary API');
        }
        return data;
      })
      .catch(() => {
        // Fallback to Wordnik API
        return fetch(wordnik_api_url).then(r2 => {
          if (!r2.ok) throw new Error('Wordnik API request failed');
          return r2.json();
        });
      })
      .then(entries => {
        const entry = entries[0] || {};
        // Handle api response
        const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || '';
        const definition = entry.meanings?.[0]?.definitions?.[0]?.definition || entry.text || '';
        res.json({ word, phonetic, definition });
      })
      .catch(err => {
        console.error('Dictionary proxy error:', err);
        res.status(502).json({ error: 'Dictionary fetch failed' });
      });
});



if (require.main === module) {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

module.exports = app;