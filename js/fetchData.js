const fetchData = async () => {
    const restable = await fetch('http://localhost:5000/tables');
    const datatables = await restable.json();

    const resorder = await fetch('http://localhost:5000/orders');
    const dataorders = await resorder.json();
    const tables = datatables;
    const orders = dataorders;
    return { tables, orders };
}

export default fetchData;