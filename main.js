// Требования:
// Пользователь должен иметь возможность добавлять новые товары в таблицу с помощью формы.

// Все поля ввода должны быть валидированы, и пользователь должен быть предупрежден об ошибках 
// в случае некорректного ввода данных(например, отрицательная цена или количество).

// Пользователь должен иметь возможность удалять товары из таблицы.

// При изменении цены или количества товара в таблице, общая стоимость товара для данной строки должна 
// автоматически пересчитываться и отображаться.

// Внизу таблицы должна отображаться общая сумма всех товаров в наличии на складе.

// Бонусные задания:
// Реализовать возможность редактирования уже существующих записей о товарах в таблице.
// Добавить сортировку товаров по различным столбцам(название, цена, количество, общая стоимость).
// Добавить фильтрацию товаров по категориям или диапазону цен.

const name = document.querySelector('#product-name'),
    category = document.querySelector('#product-category'),
    price = document.querySelector('#product-price'),
    quantity = document.querySelector('#product-quantity'),
    tableWrap = document.querySelector('.table-body'),
    form = document.querySelector('#product-form');

localStorage.setItem('products', []);
let storage = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
let counter = 1;
//добавление продукта 
form.addEventListener('submit', function (e) {
    e.preventDefault()

    let product = {
        id: counter++,
        name: name.value,
        category: category.value,
        price: price.value,
        quantity: quantity.value
    };

    if (name.value === '') {
        alert('Пожалуйста, введите название продукта.');
        return;
    }

    // Проверка, что цена - положительное число
    if (parseInt(price.value) <= 0) {
        alert('Пожалуйста, введите корректную цену (положительное число, с двумя знаками после запятой).');
        return;
    }

    // Проверка, что количество - положительное число
    if (parseInt(quantity.value) <= 0) {
        alert('Пожалуйста, введите корректное количество (положительное число).');
        return;
    }

    storage.push(product)

    localStorage.setItem('products', JSON.stringify(storage))

    renderProduct(product)
    productSum()

    name.value = '';
    category.value = '';
    price.value = '';
    quantity.value = '';
});

function createTableCell(className, textContent, dataset) {

    const cell = document.createElement('div');
    if (textContent) {
        cell.textContent = textContent;
    }
    if (dataset) {
        for (const key in dataset) {
            if (dataset.hasOwnProperty(key)) {
                cell.setAttribute(`data-${key}`, dataset[key]);
            }
        }
    }
    cell.classList.add(className);

    return cell;
}

function renderProduct(product) {
    const dataset = {
        productId: product.id,
    };

    let sumProduct = +product.price * +product.quantity

    const name = createTableCell('table-item__name', product.name),
        category = createTableCell('table-item__category', product.category),
        price = createTableCell('table-item__price', product.price),
        quantity = createTableCell('table-item__quantity', product.quantity),
        sum = createTableCell('table-item__sum', sumProduct),
        wrapBtn = createTableCell('table-item__wrap'),
        edit = createTableCell('table-item__edit', 'Редактировать'),
        btn = createTableCell('table-item__delete', 'УДАЛИТЬ', dataset),
        wraper = createTableCell('table-item', 0, dataset);

    const body = document.querySelector('.table-body')

    body.append(wraper)

    wraper.append(name);
    wraper.append(category);
    wraper.append(price);
    wraper.append(quantity);
    wraper.append(sum);
    wraper.append(wrapBtn);
    wrapBtn.append(btn);
    wrapBtn.append(edit);
}
//удаление продукта

tableWrap.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('table-item__delete')) {
        const productId = +e.target.closest('.table-item').dataset.productid;
        deleteProduct(productId)
        productSum()
    }

});

function deleteProduct(id) {
    const index = storage.findIndex(product => product.id == id);

    if (index !== -1) {
        // Удалить продукт из массива storage
        storage.splice(index, 1);
    }

    // Удалить соответствующий элемент из таблицы
    const productElement = document.querySelector(`[data-productid="${id}"]`);
    if (productElement) {
        productElement.remove();
    }
}
//функция подсчета общей сумы

function productSum() {
    let allSum = 0
    storage.forEach(product => {
        let sumProduct = +product.price * +product.quantity;
        allSum = sumProduct + allSum
    });

    const totalAmount = document.querySelector('#total-amount');
    totalAmount.textContent = allSum
}
// редактирование продукта

tableWrap.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('table-item__edit')) {
        const productId = +e.target.closest('.table-item').dataset.productid;

        editProduct(productId);
    };
});

function editProduct(id) {

    const productToEdit = storage.find(product => product.id === id);

    if (!productToEdit) {
        alert('Товар не найден.');
        return;
    }

    // Заполнить форму данными для редактирования
    name.value = productToEdit.name;
    category.value = productToEdit.category;
    price.value = productToEdit.price;
    quantity.value = productToEdit.quantity;

    // Создать кнопку "Сохранить" и обработчик для нее
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    form.append(saveButton);

    // Добавить обработчик для кнопки "Сохранить", который обновит данные товара
    saveButton.addEventListener('click', function () {
        // Обновить данные товара
        productToEdit.name = name.value;
        productToEdit.category = category.value;
        productToEdit.price = price.value;
        productToEdit.quantity = quantity.value;

        // Обновить отображение в таблице

        updateTable()

        // Удалить кнопку "Сохранить" и очистить поля формы

        saveButton.remove();
        name.value = '';
        category.value = '';
        price.value = '';
        quantity.value = '';

        // Обновить данные в localStorage
        localStorage.setItem('products', JSON.stringify(storage));
    });
}

function updateTable() {

    tableWrap.innerHTML = '';

    storage.forEach(product => {
        renderProduct(product);
    });
    productSum()
}