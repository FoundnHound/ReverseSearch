function getBackendMessage() {
    fetch('/api/hello')
      .then(res => res.text())
      .then(data => {
        document.getElementById('backend-message').innerText = data;
      });
    //backend-message is the ID for the message used for when calling the backend (Unsued)
  }

function meansLikeSearch(){
  const text = document.getElementById('description').value //description is the textarea ID
  clearTextArea()

  fetch('/api/meansLike', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerHTML = `<p style="font-size: 0.9em; color: #666;">Click a word below to see its definition</p>`
      output.innerText = `Similar words:`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      const word = document.createElement('div');
      word.className = 'word';
      word.innerHTML = `<strong>${item.word}</strong>`;
      wordEl.appendChild(word);

      const defineDiv = document.createElement('div')
      defineDiv.className = 'definition';

      wordEl.addEventListener('click', () => {
        output.querySelectorAll('.definition').forEach(el => el.innerHTML = '');
        fetchDefinition(item.word, defineDiv);
      });
      wordEl.title = 'Click to define';

      output.appendChild(wordEl)

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(defineDiv);
    });
    // Auto-scroll after appending all results
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function soundsLikeSearch(){
  const text = document.getElementById('description').value //description is the textarea ID
  const error = document.getElementById('error-message');
  error.textContent = ''; // Clear any previous error message
  clearTextArea()

  fetch('/api/soundsLike', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = "Did you mean: ";
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      const word = document.createElement('div');
      word.className = 'word';
      word.innerHTML = `<strong>${item.word}</strong>`;
      wordEl.appendChild(word);

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(wordEl)

    });
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function adjectiveSearch(){
  const text = document.getElementById('description').value //description is the textarea ID
  const error = document.getElementById('error-message');
  error.textContent = ''; // Clear any previous error message
  if (text.split(/\s+/).length > 1) {
    error.textContent = "Please enter only a single adjective for this search.";
    return;
  }

  clearTextArea()

  fetch('/api/adjectiveThatDescribes', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = `Common adjectives used to describe "${text}":`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      const word = document.createElement('div');
      word.className = 'word';
      word.innerHTML = `<strong>${item.word}</strong>`;
      wordEl.appendChild(word);

      const defineDiv = document.createElement('div')
      defineDiv.className = 'definition';

      wordEl.addEventListener('click', () => {
        output.querySelectorAll('.definition').forEach(el => el.innerHTML = '');
        fetchDefinition(item.word, defineDiv);
      });

      wordEl.title = 'Click to define';

      output.appendChild(wordEl)

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(defineDiv);
    });
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function nounSearch(){
  const text = document.getElementById('description').value //description is the textarea ID
  const error = document.getElementById('error-message');
  error.textContent = ''; // Clear any previous error message
  if (text.split(/\s+/).length > 1) {
    error.textContent = "Please enter only a single adjective for this search.";
    return;
  }

  clearTextArea()

  fetch('/api/nounsThatAreDescribedBy', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = `Nouns that are described by by the adjective "${text}":`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      const word = document.createElement('div');
      word.className = 'word';
      word.innerHTML = `<strong>${item.word}</strong>`;
      wordEl.appendChild(word);

      const defineDiv = document.createElement('div')
      defineDiv.className = 'definition';

      wordEl.addEventListener('click', () => {
        output.querySelectorAll('.definition').forEach(el => el.innerHTML = '');
        fetchDefinition(item.word, defineDiv);
      });
      wordEl.title = 'Click to define';

      output.appendChild(wordEl)

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(defineDiv);
    });
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function fetchDefinition(word, container) {
  container.innerHTML = 'Loading...';

  fetch('/api/defineWord', { 
    method: 'POST',
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ word })
    })
    .then(res => res.json())
    .then(data => {

      const defText = document.createElement('p');
      defText.innerHTML = `<strong>Definition:</strong> ${data.definition || 'No definition found'}<br><strong>Phonetic:</strong> ${data.phonetic || 'N/A'}`;
      container.innerHTML = '';

      container.appendChild(defText);
    })
    .catch(err => {
      container.innerHTML = `<em>Failed to fetch definition. Too many requests please wait</em>`;
    });
}

function defineWord() {
  const text = document.getElementById('description').value; // textarea input
  const error = document.getElementById('error-message');
  error.textContent = ''; // Clear previous error message
  if (text.split(/\s+/).length > 1) {
    error.textContent = "Please enter only a single word for this search.";
    return;
  }
  else if (text.length === 0) {
    error.textContent = " ";
    return;
  }
  clearTextArea();

  fetch('/api/defineWord', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: text }) // Send as { word: text } to match previously defined structure
  })
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById("results");
      output.innerHTML = '';

      if (data.error) {
        error.textContent = data.error;
        return;
      }
      const defintion = data.definition.replace(/<xref>(.*?)<\/xref>/g, "$1");

      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      const word = document.createElement('div');
      word.className = 'word';
      word.innerHTML = `<strong>${data.word}</strong>`;
      wordEl.appendChild(word);

      const defineDiv = document.createElement('div');
      defineDiv.className = 'definition';
      defineDiv.innerText = defintion || 'No definition available';

      if (data.phonetic) {
        const phoneticDiv = document.createElement('div');
        phoneticDiv.className = 'phonetic';
        phoneticDiv.innerText = `Phonetic: ${data.phonetic}`;
        wordEl.appendChild(phoneticDiv);
      }

      wordEl.appendChild(defineDiv);
      output.appendChild(wordEl);

      // Auto-scroll to results
      output.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
      error.textContent = 'Failed to fetch definition';
    });
}


function clearResults() {
  const output = document.getElementById("results");
  output.innerHTML = '';
}

function clearTextArea(){
  document.getElementById('description').value = ""
}

function updateInputHint(type) {
  const textarea = document.getElementById('description');
  const hint = document.getElementById('input-hint');

  switch(type) {
    case 'meansLike':
      textarea.placeholder = "e.g., 'ringing in the ears', 'feeling of sadness', etc.";
      hint.textContent = "Enter a short description or definition. Multi-word inputs are OK.";
      break;
    case 'soundsLike':
      textarea.placeholder = "e.g., 'nife' for 'knife', 'fone' for 'phone'";
      hint.textContent = "Enter a phonetic attempt at the word you're trying to find.";
      break;
    case 'adjective':
      textarea.placeholder = "e.g., 'ocean'";
      hint.textContent = "Enter a single noun. The search will return adjectives used to describe it.";
      break;
    case 'noun':
      textarea.placeholder = "e.g., 'fluffy'";
      hint.textContent = "Enter a single adjective. The search will return nouns often described that way.";
      break;
    case 'defineWord':
      textarea.placeholder = "e.g., 'acouasm'";
      hint.textContent = "Enter a single word to get its definition.";
      break;
    case 'clearResults':
      textarea.placeholder = "Enter your description here...";
      hint.textContent = "Click a search button to see examples.";
      break;
    default:
      textarea.placeholder = "Enter your description here...";
      hint.textContent = "";
  }
}