// Utility functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showElement(elementId) {
    document.getElementById(elementId).classList.remove('hidden');
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '10px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s';
        notification.style.opacity = '0';
        document.body.appendChild(notification);
    }
    
    const notificationElement = document.getElementById('notification');
    
    // Set type-specific properties with updated colors
    if (type === 'success') {
        notificationElement.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notificationElement.style.backgroundColor = '#ef4444';
    } else {
        notificationElement.style.backgroundColor = '#6366f1';
    }
    
    // Update message and show
    notificationElement.textContent = message;
    notificationElement.style.opacity = '1';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notificationElement.style.opacity = '0';
    }, 3000);
}

function validateForm() {
    // Validate people
    const personInputs = document.querySelectorAll('.person-name');
    let validPeople = true;
    
    personInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444'; // Updated to new danger color
            validPeople = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!validPeople) {
        showNotification('Please enter names for all participants', 'error');
        return false;
    }
    
    // Validate payer
    const payer = document.getElementById('payer').value;
    if (!payer) {
        document.getElementById('payer-blocks').style.borderColor = '#ef4444';
        document.getElementById('payer-blocks').style.padding = '10px';
        document.getElementById('payer-blocks').style.borderWidth = '2px';
        document.getElementById('payer-blocks').style.borderStyle = 'solid';
        document.getElementById('payer-blocks').style.borderRadius = '8px';
        showNotification('Please select who paid the bill', 'error');
        
        // Reset styling after a delay
        setTimeout(() => {
            document.getElementById('payer-blocks').style.borderColor = '';
            document.getElementById('payer-blocks').style.padding = '';
            document.getElementById('payer-blocks').style.borderWidth = '';
            document.getElementById('payer-blocks').style.borderStyle = '';
            document.getElementById('payer-blocks').style.borderRadius = '';
        }, 3000);
        
        return false;
    }
    
    // Validate products
    const productInputs = document.querySelectorAll('.product-input');
    let validProducts = true;
    
    productInputs.forEach(product => {
        const nameInput = product.querySelector('.product-name');
        const priceInput = product.querySelector('.product-price');
        
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = '#ef4444';
            validProducts = false;
        } else {
            nameInput.style.borderColor = '';
        }
        
        if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            priceInput.style.borderColor = '#ef4444';
            validProducts = false;
        } else {
            priceInput.style.borderColor = '';
        }
    });
    
    if (!validProducts) {
        showNotification('Please enter valid product names and prices', 'error');
        return false;
    }
    
    return true;
}

function addProductInput() {
    const productInputsDiv = document.getElementById('product-inputs');
    const newProductInput = document.createElement('div');
    newProductInput.className = 'product-input';
    newProductInput.innerHTML = `
        <i class="remove-sign fas fa-minus-circle" onclick="removeProductInput(this)"></i>
        <div class="form-group">
            <label>Product:</label>
            <input type="text" class="product-name" placeholder="Item name" required>
        </div>
        <div class="form-group">
            <label>Price:</label>
            <input type="number" class="product-price" placeholder="0.00" step="0.01" min="0" required>
        </div>
    `;
    productInputsDiv.appendChild(newProductInput);
    
    // Focus new input
    setTimeout(() => {
        newProductInput.querySelector('.product-name').focus();
    }, 0);
}

function removeProductInput(element) {
    const productInput = element.parentElement;
    productInput.style.opacity = '0';
    setTimeout(() => {
        productInput.remove();
    }, 300);
}

function updatePayerBlocks() {
    const payerBlocksContainer = document.getElementById('payer-blocks');
    const hiddenPayerInput = document.getElementById('payer');
    const currentValue = hiddenPayerInput.value;
    const personInputs = document.querySelectorAll('.person-name');
    
    // Clear existing blocks
    payerBlocksContainer.innerHTML = '';
    
    // Add participants as blocks
    const participants = Array.from(personInputs)
        .map(input => input.value.trim())
        .filter(name => name);
    
    if (participants.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Add participants to select a payer';
        emptyMessage.style.color = '#9ca3af';
        emptyMessage.style.fontStyle = 'italic';
        payerBlocksContainer.appendChild(emptyMessage);
        return;
    }
    
    participants.forEach(name => {
        const block = document.createElement('div');
        block.className = 'payer-block';
        if (name === currentValue) {
            block.classList.add('selected');
        }
        
        block.innerHTML = `<i class="fas fa-user"></i> ${name}`;
        block.dataset.name = name;
        
        block.addEventListener('click', function() {
            // Deselect all blocks
            document.querySelectorAll('.payer-block').forEach(b => {
                b.classList.remove('selected');
            });
            
            // Select this block
            this.classList.add('selected');
            
            // Update hidden input value
            hiddenPayerInput.value = name;
        });
        
        payerBlocksContainer.appendChild(block);
    });
    
    // If no selection but participants exist, try to restore selection
    if (!currentValue && participants.length > 0) {
        // Select first participant by default
        const firstBlock = payerBlocksContainer.querySelector('.payer-block');
        if (firstBlock) {
            firstBlock.classList.add('selected');
            hiddenPayerInput.value = firstBlock.dataset.name;
        }
    } else if (currentValue && !participants.includes(currentValue)) {
        // If current selection no longer exists, reset
        hiddenPayerInput.value = '';
    }
}

function updatePayerDropdown() {
    updatePayerBlocks();
}

function addPersonInput() {
    const peopleDiv = document.getElementById('people-list');
    const newPersonInput = document.createElement('div');
    newPersonInput.className = 'person-input';
    newPersonInput.innerHTML = `
        <i class="remove-sign fas fa-minus-circle" onclick="removePersonInput(this)"></i>
        <input type="text" class="person-name" placeholder="Name" required onchange="updatePayerBlocks()">
    `;
    peopleDiv.appendChild(newPersonInput);
    
    // Focus new input
    setTimeout(() => {
        newPersonInput.querySelector('.person-name').focus();
    }, 0);
}

function removePersonInput(element) {
    const personInput = element.parentElement;
    
    // Check if it's the last one
    const totalInputs = document.querySelectorAll('.person-input').length;
    if (totalInputs <= 1) {
        showNotification('You need at least one person', 'error');
        return;
    }
    
    personInput.style.opacity = '0';
    setTimeout(() => {
        personInput.remove();
        updatePayerBlocks();
    }, 300);
}

function processPayment() {
    if (!validateForm()) return;
    
    showLoading();
    
    setTimeout(() => {
        try {
            const productInputs = document.querySelectorAll('.product-input');
            const products = Array.from(productInputs).map(input => {
                const productName = input.querySelector('.product-name').value.trim();
                const productPrice = parseFloat(input.querySelector('.product-price').value.trim());
                return { product: productName, price: productPrice };
            });
    
            const personInputs = document.querySelectorAll('.person-input');
            const people = Array.from(personInputs)
                .map(input => input.querySelector('.person-name').value.trim())
                .filter(name => name); // Remove empty names
    
            const productPayersDiv = document.getElementById('product-payers');
            productPayersDiv.innerHTML = '<h2><i class="fas fa-hand-holding-usd"></i> Who Pays What?</h2>';
    
            products.forEach((item, index) => {
                const productName = item.product;
                const productPrice = item.price;
    
                const div = document.createElement('div');
                div.className = 'expense-item';
                div.innerHTML = `
                    <div class="expense-header">
                        <h3>${productName}</h3>
                        <span class="expense-price">${productPrice.toFixed(2)}</span>
                    </div>
                    <p>Select who will pay for this item:</p>
                    <div id="product-payers-${index}" class="payer-buttons" data-price="${productPrice}">
                        ${people.map(person => `
                            <button type="button" class="payer-button" onclick="togglePayer(this, '${person}')">${person}</button>
                        `).join('')}
                    </div>
                    <button class="secondary-button select-all-btn" onclick="selectAllPayers(${index})">
                        <i class="fas fa-users"></i> Select All
                    </button>
                `;
                productPayersDiv.appendChild(div);
            });
    
            showElement('product-payers');
            hideLoading();
            showNotification('Now select who pays for each item', 'success');
            
            // Scroll to the payers section
            document.getElementById('product-payers').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } catch (error) {
            console.error('Error in processPayment:', error);
            hideLoading();
            showNotification('An error occurred. Please check your inputs.', 'error');
        }
    }, 500); // Simulating processing time
}

function selectAllPayers(productIndex) {
    const payerButtons = document.querySelectorAll(`#product-payers-${productIndex} .payer-button`);
    const allSelected = Array.from(payerButtons).every(btn => btn.classList.contains('selected'));
    
    payerButtons.forEach(button => {
        if (allSelected) {
            button.classList.remove('selected');
            button.removeAttribute('data-selected');
        } else {
            button.classList.add('selected');
            button.setAttribute('data-selected', 'true');
        }
    });
}

function togglePayer(button, person) {
    button.classList.toggle('selected');
    button.classList.contains('selected') ? 
        button.setAttribute('data-selected', 'true') : 
        button.removeAttribute('data-selected');
}

function calculateAmounts() {
    showLoading();
    
    setTimeout(() => {
        try {
            const personInputs = document.querySelectorAll('.person-input');
            const payer = document.getElementById('payer').value.trim();
            
            if (!payer) {
                showNotification('Please enter who paid the bill', 'error');
                hideLoading();
                return;
            }
            
            const people = Array.from(personInputs)
                .map(input => input.querySelector('.person-name').value.trim())
                .filter(name => name);
    
            const amounts = {};
            people.forEach(person => amounts[person] = 0.0);
    
            const productPayersDiv = document.getElementById('product-payers');
            const inputs = productPayersDiv.querySelectorAll('div[data-price]');
    
            let anySelected = false;
            
            inputs.forEach(input => {
                const productPrice = parseFloat(input.getAttribute('data-price'));
                const productPayers = Array.from(input.querySelectorAll('button[data-selected="true"]'))
                    .map(button => button.textContent);
                
                if (productPayers.length > 0) {
                    anySelected = true;
                    const share = productPrice / productPayers.length;
                    productPayers.forEach(p => amounts[p] += share);
                }
            });
            
            if (!anySelected) {
                showNotification('Please select who pays for each product', 'error');
                hideLoading();
                return;
            }
    
            const resultsDiv = document.getElementById('results');
            const resultsContent = resultsDiv.querySelector('.results-content');
            resultsContent.innerHTML = '';
            
            let hasToPay = false;
            
            for (const [person, amount] of Object.entries(amounts)) {
                if (person !== payer && amount > 0) {
                    hasToPay = true;
                    resultsContent.innerHTML += `
                        <p>
                            <span><i class="fas fa-user"></i> ${person}</span>
                            <span><i class="fas fa-arrow-right"></i> ${amount.toFixed(2)} to ${payer}</span>
                        </p>
                    `;
                }
            }
            
            if (!hasToPay) {
                resultsContent.innerHTML = `<p class="no-payments">No payments needed!</p>`;
            }
            
            showElement('results');
            hideLoading();
            
            // Scroll to results
            resultsDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            showNotification('Payment calculations complete!', 'success');
        } catch (error) {
            console.error('Error in calculateAmounts:', error);
            hideLoading();
            showNotification('An error occurred during calculation', 'error');
        }
    }, 800); // Simulating calculation time
}

function resetForm() {
    // Reset people
    const peopleDiv = document.getElementById('people-list');
    peopleDiv.innerHTML = `
        <label>Enter participants:</label>
        <div class="person-input">
            <i class="remove-sign fas fa-minus-circle" onclick="removePersonInput(this)"></i>
            <input type="text" class="person-name" placeholder="Name" required onchange="updatePayerBlocks()">
        </div>
    `;
    
    // Reset payer
    document.getElementById('payer').value = '';
    
    // Reset products
    const productsDiv = document.getElementById('product-inputs');
    productsDiv.innerHTML = `
        <div class="product-input">
            <i class="remove-sign fas fa-minus-circle" onclick="removeProductInput(this)"></i>
            <div class="form-group">
                <label>Product:</label>
                <input type="text" class="product-name" placeholder="Item name" required>
            </div>
            <div class="form-group">
                <label>Price:</label>
                <input type="number" class="product-price" placeholder="0.00" step="0.01" min="0" required>
            </div>
        </div>
    `;
    
    // Hide results and product payers
    hideElement('product-payers');
    hideElement('results');
    
    // Update payer blocks after reset
    updatePayerBlocks();
    
    showNotification('Form has been reset', 'info');
}

function saveResults() {
    const results = document.getElementById('results').querySelector('.results-content').innerHTML;
    const timestamp = new Date().toLocaleString();
    
    // Check if localStorage is available
    try {
        const savedData = localStorage.getItem('payShareHistory') || '[]';
        const history = JSON.parse(savedData);
        
        history.push({
            timestamp,
            results,
            payer: document.getElementById('payer').value.trim()
        });
        
        localStorage.setItem('payShareHistory', JSON.stringify(history));
        showNotification('Results saved successfully!', 'success');
    } catch (e) {
        console.error('Error saving results:', e);
        showNotification('Could not save results', 'error');
    }
}

function showPrivacyPolicy() {
    const content = `
        <h2>Privacy Policy</h2>
        <p>This app does not collect or store any personal data on our servers. All calculations are performed in your browser.</p>
        <p>If you choose to save your results, they are stored locally on your device using localStorage and are not transmitted to us.</p>
    `;
    
    showModal('Privacy Policy', content);
}

function showHelp() {
    const content = `
        <h2>How to Use PayShare</h2>
        <ol>
            <li>Enter all participants who were part of the expense</li>
            <li>Enter who paid the bill initially</li>
            <li>Add all products/expenses with their prices</li>
            <li>Click "Select Payers" to choose who participated in each expense</li>
            <li>Click "Calculate Shares" to see how much each person owes the payer</li>
        </ol>
        <p>Keyboard shortcuts:</p>
        <ul>
            <li>Ctrl+Y: Add a new person</li>
            <li>Ctrl+X: Add a new product</li>
        </ul>
    `;
    
    showModal('Help', content);
}

function showModal(title, content) {
    // Create modal if it doesn't exist
    if (!document.getElementById('modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.id = 'modal-content';
        modalContent.style.cssText = `
            background-color: #ffffff;
            padding: 25px;
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            transform: translateY(-20px);
            transition: transform 0.3s;
        `;
        
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        `;
        
        const modalTitle = document.createElement('h2');
        modalTitle.id = 'modal-title';
        modalTitle.style.margin = '0';
        modalTitle.style.color = '#6366f1';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #4b5563;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
        `;
        closeButton.onclick = closeModal;
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const modalBody = document.createElement('div');
        modalBody.id = 'modal-body';
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
    }
    
    // Update modal content
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    
    // Show modal with animation
    const modal = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Event listeners
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'x') {
        event.preventDefault();
        addProductInput();
    } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        addPersonInput();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved data
    try {
        const savedData = localStorage.getItem('payShareHistory');
        if (savedData && JSON.parse(savedData).length > 0) {
            showNotification('You have saved calculations', 'info');
        }
    } catch (e) {
        console.error('Error checking saved data:', e);
    }
    
    // Initialize the first person input to update the payer blocks when changed
    document.querySelector('.person-name').addEventListener('change', updatePayerBlocks);
    
    // Initialize the payer blocks
    updatePayerBlocks();
});