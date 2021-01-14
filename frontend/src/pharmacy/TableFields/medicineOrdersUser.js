const medicine_orders_user_fields = [
    { key: 'id', _style: { width: '5%'} , label: 'Number'},
    { key: 'created', _style: { width: '10%'} , label: 'Date'},
    { key: 'customer', _style: { width: '15%'} , label: 'Customer'},
    { key: 'total_price', _style: { width: '10%'} , label: 'Total'},
    { key: 'orderStatus', _style: { width: '10%'} , label: 'Status'},
    {key: 'show_details', label: '', _style: { width: '5%' }, sorter: false, filter: false}
];

export default medicine_orders_user_fields;