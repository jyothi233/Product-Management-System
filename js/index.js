'use strict';

const productName = document.getElementById('productName');
const productNumber = document.getElementById('productNumber');
const productCategory = document.getElementById('productCategory');
const productDescription = document.getElementById('productDescription');
const tableBody = document.getElementById("tableBody"); 
const addBtn = document.getElementById('add');
const deleteBtn = document.getElementById("delete");
const editBtn = document.getElementById('edit');
const updateBtn = document.getElementById('update');
const searchInput = document.getElementById('search');
const productForm = document.getElementById('product-form');
let indexFlag = 0;
let productList = [];

localStorage.getItem("products") != null ? productList = JSON.parse(localStorage.getItem("products")) : productList = [];

document.onload = retrieveProduct();

function showAlert(message, className) {

  const div = document.createElement('div');
  const container = document.querySelector('.container');
  const main = document.querySelector('.main');

  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message))
  container.insertBefore(div, main);

  setTimeout(() => document.querySelector('.alert').remove(), 3000);

}

function addProduct() {

  const product = {
    name: productName.value,
    number: productNumber.value,
    category: productCategory.value,
    description: productDescription.value
  }

  productList.push(product);
  localStorage.setItem("products", JSON.stringify(productList));
}

function resetInputs() {
  productCategory.value = '';
  productName.value = '';
  productNumber.value = '';
  productDescription.value = '';
}

function displayProduct() {
  let product = '';

  for (let i = 0; i < productList.length; i++){

    product += ` <tr class='product text-center'>
          <td>${i + 1}</td>
          <td>${productList[i].name}</td>
          <td>${productList[i].number}</td>
          <td>${productList[i].category}</td>
          <td>${productList[i].description}</td>
          <td>
            <button id='edit' onclick='editProduct(${i})' type="button" class="me-1 btn btn-outline-tertiary ">Edit</button>
            <button id='delete' onclick='deleteProduct(${i})' type="button" class="btn btn-outline-secondary">Delete</button>
          </td>
        </tr>`;
  }

  tableBody.innerHTML = product;
}


function retrieveProduct() {
  displayProduct();
}

function createProduct() {
  addProduct();
  resetInputs();
  displayProduct();
  showAlert('Product has been added successfully', 'success')
}

function deleteProduct(index) {

  productList.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  displayProduct();
  showAlert('Product has been deleted successfully', 'danger');

}

function editProduct(index) {
  indexFlag = index;

  updateBtn.classList.remove('d-none');
  addBtn.classList.add('d-none');

  productCategory.value = productList[index].category;
  productName.value = productList[index].name;
  productNumber.value = productList[index].number;
  productDescription.value = productList[index].description;

}

function updateProduct() {

  const newProduct = {
    name: productName.value,
    number: productNumber.value,
    category: productCategory.value,
    description: productDescription.value,
  };

  productList.splice(indexFlag,1,newProduct);
  localStorage.setItem("products", JSON.stringify(productList));
  resetInputs();
  displayProduct();
  
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");

  showAlert("Product has been updated successfully", "primary");

  document
    .querySelectorAll(".input")
    .forEach((input) => input.classList.remove("success"));
}

function searchProduct() {
  const query = searchInput.value;
  let product = "";

  for (let i = 0; i < productList.length; i++) {
      
    if (productList[i].name.toLowerCase().includes(query.toLowerCase())) {
      product += ` <tr class='product text-center'>
        <td>${i + 1}</td>
        <td>${productList[i].name}</td>
        <td>${productList[i].number}</td>
        <td>${productList[i].category}</td>
        <td>${productList[i].description}</td>
        <td>
          <button id='edit' onclick='editProduct(${i})' type="button" class="me-1 btn btn-outline-tertiary ">Edit</button>
          <button id='delete' onclick='deleteProduct(${i})' type="button" class="btn btn-outline-secondary">Delete</button>
        </td>
      </tr>`;
      }
    }

    tableBody.innerHTML = product;
}

// validation
function setSuccessFor(input) {
  const inputForm = input.parentElement;
  inputForm.className = 'input-form success'
  input.className = 'input success';
}

function setErrorFor(input,message) {
  const inputForm = input.parentElement;
  const small = inputForm.querySelector('small');
  inputForm.className = "input-form error";
  input.className = 'input error';
  small.innerText = message;
}

function containsSpecialCharacters(inputString) {
  const specialCharacterRegex = /[^a-zA-Z ?0-9]/;

  return specialCharacterRegex.test(inputString);
}

function validateProductName() {
  const productNameValue = document
    .getElementById("productName")
    .value.trim();

  if (productNameValue === '') {
    setErrorFor(productName, 'Product name is required *')
  } else if (productNameValue.length < 4) {
    setErrorFor(productName, "Product name must be at least 4 characters");
  } else if (containsSpecialCharacters(productNameValue)) {
    setErrorFor(productName, "Product name must not contain special characters such as: @,-,_,*,^,$,!,#,&");  
  } else{
    setSuccessFor(productName)
  }
}

function validateProductNumber() {
  const productNumberValue = document
    .getElementById("productNumber")
    .value.trim();

    if (productNumberValue === '') {
      setErrorFor(productNumber, 'Product number is required *')
    } else if (productNumberValue < 0) {
      setErrorFor(productNumber, "Product number must be a positive number");
    } else if (productNumberValue.length > 6) {
      setErrorFor(productNumber, "Product number must not exceed 6 numbers");
    } else {
      setSuccessFor(productNumber);
    }
}

function validateProductCategory() {
  const productCategoryValue = document
    .getElementById("productCategory")
    .value.trim();

    if (productCategoryValue === "") {
      setErrorFor(productCategory, "Product category is required *");
    } else if (productCategoryValue.length > 20) {
      setErrorFor(
        productCategory,
        "Product description must not exceedt 20 characters"
      );
    } else {
      setSuccessFor(productCategory);
    }
}

function validateProductDescription() {
  const productDescriptionValue = document
    .getElementById("productDescription")
    .value.trim();

    if (productDescriptionValue === '') {
      setErrorFor(productDescription, 'Product description is required *');
    } else if (productDescriptionValue.length > 20) {
      setErrorFor(productDescription, "Product description must not exceed 20 characters");
    } else{
      setSuccessFor(productDescription)
    }
}



productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (
    productCategory.value === "" ||
    productDescription.value === "" ||
    productName.value === "" ||
    productNumber.value === ""
  ) {
    setErrorFor(productCategory, 'Please fill all fields*')
    setErrorFor(productDescription, 'Please fill all fields*')
    setErrorFor(productName, 'Please fill all fields*')
    setErrorFor(productNumber, 'Please fill all fields*')
    showAlert('Please fill all fields', 'danger');
    return;
  } else if (productName.value.length < 4 || containsSpecialCharacters(productName.value) ) {
    return;
  } else if (productNumber.value < 0 || productNumber.value.length > 6) {
    return;
  } else if (productCategory.value.length > 20) {
    return;
  } else if (productDescription.value.length > 20) {
    return;
  }

  createProduct();

  document
    .querySelectorAll(".input")
    .forEach((input) => input.classList.remove("success"));
})


