const shopArray = [
  {
    category: 'Something',
    productsList: [
      { name: 'asd', info: 'qwerty' },
      { name: 'asd1', info: 'qwerty1' },
      { name: 'asd2', info: 'qwerty2' }
    ]
  },
  {
    category: 'Something cool',
    productsList: [
      { name: 'zxc', info: 'asdfgh' },
      { name: 'zxc1', info: 'asdfgh1' },
      { name: 'zxc2', info: 'asdfgh2' }
    ]
  },
  {
    category: 'Something not cool',
    productsList: [
      { name: 'qwe', info: 'zxcvbn' },
      { name: 'qwe1', info: 'zxcvbn1' },
      { name: 'qwe2', info: 'zxcvbn2' }
    ]
  }
];

const block = document.querySelector('.block');
const categoryList = document.querySelector('.category-list');
const productList = document.querySelector('.product-list');
const productInfo = document.querySelector('.product-info');
const form = document.querySelector('form');
const myOrdersBtn = document.querySelector('.my-orders-btn');
const orderList = document.querySelector('.order-list');

renderCategories();

function renderCategories() {
  categoryList.innerHTML = '';
  productList.innerHTML = '';
  productInfo.innerHTML = '';
  shopArray.forEach((category) => {
    const li = document.createElement('li');
    li.textContent = category.category;
    li.addEventListener('click', () => renderProducts(category.productsList));
    categoryList.appendChild(li);
  });
}

function renderProducts(productsList) {
  productList.innerHTML = '';
  productInfo.innerHTML = '';
  productsList.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = product.name;
    li.addEventListener('click', () => renderProductInfo(product));
    productList.appendChild(li);
  });
}

let nameProduct = '';
let infoProduct = '';

function renderProductInfo(product) {
  productInfo.textContent = '';
  const name = document.createElement('li');
  nameProduct = name.textContent = 'Name: ' + product.name;
  const info = document.createElement('li');
  infoProduct = info.textContent = 'Info: ' + product.info;
  const button = document.createElement('button');
  button.textContent = 'Press to buy';
  button.addEventListener('click', () => {
    form.style.display = 'block';
  });

  productInfo.appendChild(name);
  productInfo.appendChild(info);
  productInfo.appendChild(button);
}

/////////////////////////////////////////////////////////


function formValidate() {
  for (let i = 0; i < form.elements.length - 2; i++) {
    if (form.elements[i].value === '') {
      alert(`Fill all fields`);

      return false;
    }
  }

  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!formValidate()) {
    return;
  }

  const formData = new FormData(e.target);
  const order = Object.fromEntries(formData.entries());
  order.name = nameProduct;
  order.info = infoProduct;
  order.date = String(Date());

  function generateRandomName() {
    return 'order' + Math.floor(Math.random() * 10000000);
  }

  localStorage.setItem(generateRandomName(), JSON.stringify(order));

  const orderWhithoutTrash = JSON.stringify(order).replace(/[\[\]{}"]/g, '');
  alert(orderWhithoutTrash);
  form.reset();
});

/////////////////////////////////////////////////////////

myOrdersBtn.addEventListener('click', orderBtnClicked);

function orderItemClicked(i) {
  const key = localStorage.key(i);
  const value = JSON.parse(localStorage.getItem(key));

  const existingOrderItemInfo = document.querySelector(`.order-item-info-${i}`);
  if (existingOrderItemInfo) {
    existingOrderItemInfo.remove();
  }

  const orderItemInfo = document.createElement('p');
  orderItemInfo.textContent = `${value.name}, ${value.info}, ${value.fullname}, ${value.city}, q:${value.quantity}, ${value.payment} `;
  orderItemInfo.setAttribute('class', `order-item-info-${i}`);

  const orderItem = document.querySelector(`.para${i}`);
  orderItem.appendChild(orderItemInfo);

  console.log('Clicked');
}

function deleteOrderItem(i) {
  const key = localStorage.key(i);
  localStorage.removeItem(key);

  const orderItem = document.querySelector(`.para${i}`);
  orderItem.remove();

  const existingOrderItemInfo = document.querySelector(`.order-item-info-${i}`);
  if (existingOrderItemInfo) {
    existingOrderItemInfo.remove();
  }
}

function orderBtnClicked() {
  block.style.display = 'none';
  form.style.display = 'none';
  orderList.innerHTML = '';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));

    const orderItem = document.createElement('p');
    orderItem.setAttribute('class', `para${i}`);
    orderItem.setAttribute('onclick', `orderItemClicked(${i})`);
    orderItem.textContent = `${key}, ${value.date}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', () => deleteOrderItem(i));

    orderItem.appendChild(deleteBtn);
    orderList.appendChild(orderItem);
  }
}
