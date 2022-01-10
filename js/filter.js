import { fillTablesInTables, fillOrdersInMenu, clear } from './fillData.js';
import fetchData from './fetchData.js';
const { tables, orders } = await fetchData();
const searchBar = document.getElementsByClassName('search-bar');
const tableSearch = searchBar[0];
const menuSearch = searchBar[1];


const filterTables = (e) => {
    const tableNo = e.currentTarget.value;
    const filteredTables = tables.filter(table => (String(table.tableNo).includes(tableNo)));
    clear('tables');
    fillTablesInTables(filteredTables.length > 0 ? filteredTables : undefined);
}

const filterOrders = (e) => {
    const fieldValue = e.currentTarget.value;
    const filteredOrders = orders.filter(order => (order.dishName.includes(fieldValue) || order.type.includes(fieldValue)));
    clear('orders');
    fillOrdersInMenu(filteredOrders.length > 0 ? filteredOrders : undefined);
}

tableSearch.addEventListener('input', filterTables);
menuSearch.addEventListener('input', filterOrders);