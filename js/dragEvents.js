const postNewOrder = async (id, name, price) => {

    const res = await fetch(`http://localhost:5000/tables/${id}`);
    const table = await res.json();

    let found = false;
    table.orders.forEach(order => {
        if (order.name === name) {
            order.qty += 1;
            found = true;
        }
    });
    if (!found) {
        table.orders.push({ name, price, qty: 1 });
    }
    table.amount += Number(price);
    table.totalItems += 1;

    const config = {
        method: 'PUT',
        body: JSON.stringify(table),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    }
    const response = await fetch(`http://localhost:5000/tables/${id}`, config);
    const data = await response.json();
    console.log(data);
    document.location.reload(true);

}

export const drag = (e) => {
    const value = e.path[0].childNodes[1].childNodes[0].innerHTML;
    e.dataTransfer.setData('price', value);
    e.dataTransfer.setData('name', e.path[0].childNodes[0].innerHTML);
}

export const allowDrop = (e) => {
    e.preventDefault();
}


export const drop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('price');
    const price = Number(data.split(' ')[1]);
    const name = e.dataTransfer.getData('name');
    const id = e.currentTarget.id.split('-')[1];
    await postNewOrder(id, name, price);
}