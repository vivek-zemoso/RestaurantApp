import { drag, allowDrop, drop } from './dragEvents.js';
import { openModal } from './modal.js';
import fetchData from './fetchData.js';

const { tables, orders } = await fetchData();

const tablesElement = document.getElementById('tables');
const ordersElement = document.getElementById('orders');

export const clear = (field) => {
    if (field === 'tables')
        tablesElement.innerHTML = '';
    else
        ordersElement.innerHTML = '';
}

export const fillTablesInTables = (filteredTables) => {
    const tablesArray = filteredTables || tables;

    tablesArray.forEach(item => {
        const { id, tableNo, amount, totalItems } = item;
        const table = document.createElement('div');
        table.classList.add('item', 'shadow', 'table');
        table.id = `t-${id}`;
        table.ondragover = allowDrop;
        table.ondrop = drop;
        table.addEventListener('click', (e) => { openModal(e, item) });

        const tableHeader = document.createElement('div');
        tableHeader.classList.add('item-header');
        tableHeader.innerHTML = `Table - ${tableNo}`;

        const tableInfo = document.createElement('div');
        tableInfo.classList.add('item-info');

        const price = document.createElement('span');
        price.classList.add('item-price');
        price.innerHTML = `Rs. ${amount.toFixed(2)}`;

        const partition = document.createElement('span');
        partition.innerHTML = ' | ';

        const total = document.createElement('span');
        total.classList.add('table-items');
        total.innerHTML = `Total Items: ${totalItems}`;

        // table info populated
        tableInfo.appendChild(price);
        tableInfo.appendChild(partition);
        tableInfo.appendChild(total);

        // table populated
        table.appendChild(tableHeader);
        table.appendChild(tableInfo);

        // mounted on DOM
        tablesElement.appendChild(table);
    });
}


export const fillOrdersInMenu = (filteredOrders) => {
    const ordersArray = filteredOrders || orders;

    ordersArray.forEach(item => {
        const { dishName, price, type } = item;
        const order = document.createElement('div');
        order.classList.add('item', 'shadow', 'menu-item');
        order.setAttribute('draggable', 'true');
        order.ondragstart = drag;

        const orderHeader = document.createElement('div');
        orderHeader.classList.add('item-header');
        orderHeader.innerHTML = `${dishName}`;

        const orderInfo = document.createElement('div');
        orderInfo.classList.add('item-info');

        const itemPrice = document.createElement('span');
        itemPrice.classList.add('item-price');
        itemPrice.innerHTML = `Rs. ${price.toFixed(2)}`;

        // order info populated
        orderInfo.appendChild(itemPrice);

        // order populated
        order.appendChild(orderHeader);
        order.appendChild(orderInfo);

        // mounted on DOM
        ordersElement.appendChild(order);
    });
}

fillTablesInTables();
fillOrdersInMenu();