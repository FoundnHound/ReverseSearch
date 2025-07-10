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
    console.log(text)
    clearTextArea()
    fetch('/api/meansLike', {
      method: 'POST', 
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({ text })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Result: ', data.result);
      const result = data.result
      const output = document.getElementById("results");
      output.innerText = '';
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
        output.appendChild(wordEl);

        output.appendChild(defineDiv);


      });
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

  function clearTextArea(){
    document.getElementById('description').value = ""
  }
