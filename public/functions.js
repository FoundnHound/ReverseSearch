function getBackendMessage() {
    fetch('/api/hello')
      .then(res => res.text())
      .then(data => {
        document.getElementById('backend-message').innerText = data;
      });
    //backend-message is the ID for the message used for when calling the backend
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
    console.log('Result: ', data.result);
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = `Similar words":`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      wordEl.append(item.word + '\t');
      console.log('Word:', item.word);

      const defineButton = document.createElement('button');
      defineButton.textContent = 'define';
      defineButton.className = 'define-button';

      const defineDiv = document.createElement('div')
      defineDiv.className = 'definition';

      defineButton.addEventListener('click', () => {
        fetchDefinition(item.word, defineDiv);
      });

      wordEl.appendChild(defineButton);
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

  clearTextArea()

  fetch('/api/soundsLike', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Result: ', data.result);
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

      wordEl.append(item.word + '\t');
      console.log('Word:', item.word);

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(wordEl)

    });
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function adjectiveSearch(){
  const text = document.getElementById('description').value //description is the textarea ID

  clearTextArea()

  fetch('/api/adjectiveThatDescribes', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Result: ', data.result);
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = `Adjectives used to Describe "${text}":`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      wordEl.append(item.word + '\t');
      console.log('Word:', item.word);

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(wordEl)

    });
    output.scrollIntoView({ behavior: 'smooth' });
  });
}

function nounSearch(){
  const text = document.getElementById('description').value //description is the textarea ID

  clearTextArea()

  fetch('/api/nounsThatAreDescribedBy', {
    method: 'POST', 
    headers: { 'Content-Type' : 'application/json'},
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Result: ', data.result);
    const output = document.getElementById("results");
    if (data.result.length === 0) {
      output.innerText = '';
    }
    else{
      output.innerText = `Nouns that are described by "${text}":`;
    }

    data.result.forEach((item, index) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'result-item';

      wordEl.append(item.word + '\t');
      console.log('Word:', item.word);

      wordEl.style.animationDelay = `${index * 0.1}s`;

      output.appendChild(wordEl)

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
      console.log(`Definition for "${word}"`, data);

      const defText = document.createElement('p');
      defText.innerHTML = `<strong>Definition:</strong> ${data.definition || 'No definition found'}<br><strong>Phonetic:</strong> ${data.phonetic || 'N/A'}`;
      container.innerHTML = '';

      container.appendChild(defText);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<em>Failed to fetch definition</em>`;
    });
}

function getWordOfTheDay() {
  fetch('/api/wordOfTheDay')
    .then(res => res.json())
    .then(data => {
      const wordOfTheDay = document.getElementById('word-of-the-day');
      wordOfTheDay.innerText = `Word of the Day: ${data.word}`;

      const defineButton = document.createElement('button');
      defineButton.textContent = 'Define';
      defineButton.className = 'define-button';

      const resultDiv = document.createElement('div');
      resultDiv.className = 'definition';

      defineButton.addEventListener('click', () => {
        fetchDefinition(data.word, resultDiv);
      });
      wordOfTheDay.appendChild(defineButton);
      wordOfTheDay.appendChild(resultDiv);
    })
    .catch(err => {
      console.error('Error fetching word of the day:', err);
      const wordOfTheDay = document.getElementById('word-of-the-day');
      wordOfTheDay.innerText = 'Failed to fetch word of the day';
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
    default:
      textarea.placeholder = "Enter your description here...";
      hint.textContent = "";
  }
}