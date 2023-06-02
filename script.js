// Function to add a block
function addBlock() {
  const blockDataInput = document.getElementById('blockDataInput');
  const data = blockDataInput.value;

  if (data) {
    const requestBody = { data };
    fetch('http://localhost:5500/add-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(block => {
        console.log('New block added:', block);
        blockDataInput.value = '';
        getBlocks(); // Trigger getBlocks() after adding a new block
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}


// Function to get and display blocks
// Function to get and display blocks
function getBlocks() {
  fetch('http://localhost:5500/get-block')
    .then(response => response.json())
    .then(blocks => {
      const blockContainer = document.getElementById('blockContainer');
      blockContainer.innerHTML = '';

      blocks.forEach((block, index) => {
        const blockItem = document.createElement('div');
        blockItem.classList.add('block');

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <p>Block ${block.index}</p>
          <input class="editable" type="text" value="${block.data}">
          <p>Nonce: ${block.nonce}</p>
          <div class="line-break"></div>
          <p>Hash:</p>
          <div class="multiline">${block.hash}</div>
          <div class="line-break"></div>
          <p>Previous Hash:</p>
          <div class="multiline">${block.previousHash}</div>
          <div class="line-break"></div>
          <p>Timestamp: ${block.timestamp}</p>
          <div class="invalid-indicator"></div>
          <button class="mine-button">Mine</button>
          <button class="save-button">Save</button>
        `;

        blockItem.appendChild(card);
        blockContainer.appendChild(blockItem);

        // Set border color based on validity
        const invalidIndicator = blockItem.querySelector('.card');
        if (block.valid) {
          invalidIndicator.style.borderColor = 'green';
        } else {
          invalidIndicator.style.borderColor = 'red';
        }

        // Event listener for data input changes
        const editableInput = blockItem.querySelector('.editable');
        editableInput.addEventListener('input', function(event) {
          const updatedData = event.target.value;
          block.data = updatedData;
          block.valid = false; // Mark the block as not valid
        });

        // Event listener for Save button click
        const saveButton = blockItem.querySelector('.save-button');
        saveButton.addEventListener('click', function() {
          fetch('http://localhost:5500/not-valid', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ block })
          })
            .then(response => response.json())
            .then(updatedBlock => {
              console.log('Block marked as not valid:', updatedBlock);
              getBlocks(); // Refresh the displayed blocks after saving
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });

        // Event listener for Mine button click
        const mineButton = blockItem.querySelector('.mine-button');
        mineButton.addEventListener('click', function() {
          fetch('http://localhost:5500/mine-block', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ block })
          })
            .then(response => response.json())
            .then(minedBlock => {
              console.log('Block mined:', minedBlock);
              getBlocks(); // Refresh the displayed blocks after mining
            })
            .catch(error => {
              console.error('Error:', error);
            });
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

