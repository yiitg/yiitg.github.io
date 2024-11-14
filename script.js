function addProductInput() {
    const productInputsDiv = document.getElementById('product-inputs');
    const newProductInput = document.createElement('div');
    newProductInput.className = 'product-input';
    newProductInput.innerHTML = `
        <label>Product:</label>
        <input type="text" class="product-name">
        <label>Price:</label>
        <input type="number" class="product-price">
    `;
    productInputsDiv.appendChild(newProductInput);
}

function processPayment() {
    const productInputs = document.querySelectorAll('.product-input');
    const products = Array.from(productInputs).map(input => {
        const productName = input.querySelector('.product-name').value.trim();
        const productPrice = parseFloat(input.querySelector('.product-price').value.trim());
        return { product: productName, price: productPrice };
    });

    const peopleInput = document.getElementById('people').value;
    const people = peopleInput.split(',').map(person => person.trim());

    const productPayersDiv = document.getElementById('product-payers');
    productPayersDiv.innerHTML = '';

    products.forEach((item, index) => {
        const productName = item.product;
        const productPrice = item.price;

        const div = document.createElement('div');
        div.innerHTML = `
            <label for="product-payers-${index}">Who will pay for ${productName}:</label>
            <div id="product-payers-${index}" data-price="${productPrice}">
                ${people.map(person => `
                    <button type="button" onclick="togglePayer(this, '${person}')">${person}</button>
                `).join('')}
            </div>
        `;
        productPayersDiv.appendChild(div);
    });
}

function togglePayer(button, person) {
    button.classList.toggle('selected');
    button.classList.contains('selected') ? button.setAttribute('data-selected', 'true') : button.removeAttribute('data-selected');
}

function calculateAmounts() {
    const peopleInput = document.getElementById('people').value;
    const payer = document.getElementById('payer').value.trim();
    const people = peopleInput.split(',').map(person => person.trim());
    const amounts = {};
    people.forEach(person => amounts[person] = 0.0);

    const productPayersDiv = document.getElementById('product-payers');
    const inputs = productPayersDiv.querySelectorAll('div[data-price]');

    inputs.forEach(input => {
        const productPrice = parseFloat(input.getAttribute('data-price'));
        const productPayers = Array.from(input.querySelectorAll('button[data-selected="true"]')).map(button => button.textContent);
        const share = productPrice / productPayers.length;
        productPayers.forEach(p => amounts[p] += share);
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    for (const [person, amount] of Object.entries(amounts)) {
        if (person !== payer) {
            resultsDiv.innerHTML += `<p>${person} will send money ${amount.toFixed(2)} lira to ${payer}</p>`;
        }
    }
}