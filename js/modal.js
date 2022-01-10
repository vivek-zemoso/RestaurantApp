const modal = document.getElementById('modal');
const modalHeading = document.getElementsByClassName('modal-heading')[0];
const modalTable = document.getElementsByClassName('modal-table')[0];
const modalBody = document.getElementsByClassName('modal-data')[0];
const modalTotal = document.getElementsByClassName('modal-total')[0];
const span = document.getElementsByClassName('close')[0];
const btn = document.getElementsByClassName('close-btn')[0];
let tableClicked;

const changeData = async (tableInfo, orderInfo, o, n) => {
    let res = await fetch(`http://localhost:5000/tables/${tableInfo.id}`);
    const table = await res.json();
    table.orders.forEach(order => {
        if (order.name === orderInfo.name) {
            let oldPrice = Number(modalTotal.innerHTML.split(':')[1]);
            let newPrice = oldPrice + (order.price * (n - o));
            modalTotal.innerHTML = `Total: ${newPrice.toFixed(2)}`;

            const tableTotalElement = tableClicked.children[1].children[0];
            const totalItemsElement = tableClicked.children[1].children[2];

            let totalItems = totalItemsElement.innerHTML.split(':')[1];

            tableTotalElement.innerHTML = `Rs. ${newPrice}`;
            totalItemsElement.innerHTML = `Total Items: ${Number(totalItems) + (n - o)}`;

        }
    })

}

const deleteOrderFromTable = (e) => {
    const node = e.path[2];
    const pricefor1 = node.children[2].innerHTML;
    const qty = node.children[3].children[0].value;

    const totalItemsElement = tableClicked.children[1].children[2];
    const prevTotalItems = Number(totalItemsElement.innerHTML.split(':')[1]);
    totalItemsElement.innerHTML = `Total Items: ${prevTotalItems - qty}`;

    const prevAmount = Number(modalTotal.innerHTML.split(':')[1]);
    modalTotal.innerHTML = `Total: ${prevAmount - (pricefor1 * qty)}`;

    const tableTotalElement = tableClicked.children[1].children[0];
    tableTotalElement.innerHTML = `Rs. ${prevAmount - (pricefor1 * qty)}`;

    node.remove();
}

export const openModal = (e, info) => {
    tableClicked = e.currentTarget;
    const { tableNo, orders, amount } = info;
    modalHeading.innerHTML = `Table - ${tableNo} | Order Details`;

    orders.forEach(order => {

        const { name, price, qty } = order;

        const modalRow = document.createElement('tr');
        const sno = document.createElement('td');
        const dname = document.createElement('td');
        const dprice = document.createElement('td');
        const dqty = document.createElement('td');
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('min', 1);
        input.value = `${qty}`;

        let oldvalue = input.value;
        input.onchange = async function () {
            let newvalue = this.value;
            await changeData(info, order, oldvalue, newvalue);
            oldvalue = newvalue;
        };

        const deleteIcon = document.createElement('i')
        deleteIcon.classList.add('fa', 'fa-trash');
        deleteIcon.addEventListener('click', deleteOrderFromTable);

        sno.innerHTML = Number(modalTable.tBodies[0].rows.length) + 1;
        dname.innerHTML = `${name}`;
        dprice.innerHTML = `${price.toFixed(2)}`;
        dqty.appendChild(input);
        dqty.appendChild(deleteIcon);

        modalRow.id = `t${tableNo}row-${sno.innerHTML}`;
        modalRow.appendChild(sno);
        modalRow.appendChild(dname);
        modalRow.appendChild(dprice);
        modalRow.appendChild(dqty);

        modalBody.appendChild(modalRow);
    });

    modalTotal.innerHTML = `Total: ${amount.toFixed(2)}`;

    e.currentTarget.style.backgroundColor = '#ffcc00';
    modal.style.display = 'block';
}

const closeModal = async (e) => {
    tableClicked.style.backgroundColor = 'white';
    modal.style.display = 'none';
    modalBody.innerHTML = '';
}

const sendRequest = async (table) => {
    const config = {
        method: 'PATCH',
        body: JSON.stringify(table),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
    const id = tableClicked.id.split('-')[1];
    const res = await fetch(`http://localhost:5000/tables/${id}`, config);
    console.log(await res.json());
}

const clearAndCloseModal = async (e) => {
    const table = { amount: 0, totalItems: 0, orders: [] };
    await sendRequest(table);
    closeModal();
    window.location.reload();
    // alert('Thank You for choosing us !!');
}

const updateDBAndCloseModal = async () => {

    const totalItemsElement = tableClicked.children[1].children[2];
    const totalItems = Number(totalItemsElement.innerHTML.split(':')[1]);
    const amount = Number(modalTotal.innerHTML.split(':')[1]);
    let orders = [];

    let children = Array.from(modalBody.children);
    children.forEach(child => {
        let name = child.children[1].innerHTML;
        let price = Number(child.children[2].innerHTML);
        let qty = Number(child.children[3].children[0].value);
        const order = { name, price, qty };
        orders.push(order);
    })

    const table = { totalItems, amount, orders };
    await sendRequest(table);
    closeModal();
    window.location.reload();
}

span.addEventListener('click', updateDBAndCloseModal);
btn.addEventListener('click', clearAndCloseModal);
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        closeModal(e);
    }
})