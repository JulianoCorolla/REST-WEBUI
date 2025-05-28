const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');

const addProductDescription = document.querySelector('#add-product-form textarea[name="description"]');
const updateProductDescription = document.querySelector('#update-product-form textarea[name="description"]');

const cancelUpdateButton = document.querySelector('#cancel-update-button');

const API_BASE_URL = 'http://3.17.142.244:3000/products';

async function fetchProducts() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();

    productList.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${product.name} - $${product.price}
        <span class="product-description">${product.description || ''}</span>
      `;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
      });
      li.appendChild(deleteButton);

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.addEventListener('click', () => {
        if (updateProductForm) {
            updateProductId.value = product.id;
            updateProductName.value = product.name;
            updateProductPrice.value = product.price;
            if(updateProductDescription) {
                updateProductDescription.value = product.description || '';
            }
            updateProductForm.style.display = 'block'; 
            updateProductForm.scrollIntoView({ behavior: 'smooth' });
        }
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productList.innerHTML = '<li>Error loading products. See console for details.</li>';
  }
}

if (addProductForm) {
  addProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = addProductForm.elements['name'].value;
    const price = addProductForm.elements['price'].value;
    const description = addProductForm.elements['description'].value; 
    
    await addProduct(name, price, description);
    addProductForm.reset();
    await fetchProducts();
  });
}

async function addProduct(name, price, description) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add product:", error);
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}

if (updateProductForm) {
  updateProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = updateProductId.value;
    const name = updateProductName.value;
    const price = updateProductPrice.value;
    const description = updateProductDescription ? updateProductDescription.value : '';

    if (!id) {
      alert('Please select a product to update first.');
      return;
    }

    await updateProduct(id, name, price, description);
    updateProductForm.reset();
    updateProductId.value = ''; 
    updateProductForm.style.display = 'none';
    await fetchProducts();
  });
}

// Event listener para o botão Cancelar no formulário de atualização
if (cancelUpdateButton && updateProductForm) {
    cancelUpdateButton.addEventListener('click', () => {
        updateProductForm.style.display = 'none'; // Oculta o formulário
        updateProductForm.reset(); // Limpa os campos do formulário
        updateProductId.value = ''; // Garante que o ID oculto seja limpo
    });
}

async function updateProduct(id, name, price, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

if (typeof fetchProducts === 'function') {
    fetchProducts();
}