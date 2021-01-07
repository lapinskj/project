const medicine_orders_user_fields = [
    { key: 'id', _style: { width: '5%'} , label: 'Numer'},
    { key: 'created', _style: { width: '10%'} , label: 'Data'},
    { key: 'customer', _style: { width: '15%'} , label: 'Klient'},
    { key: 'total_price', _style: { width: '10%'} , label: 'Kwota'},
    { key: 'orderStatus', _style: { width: '10%'} , label: 'Status'},
    { key: 'delete', _style: { width: '5%'} , label: '', sorter: false, filter: false},
    {key: 'show_details', label: '', _style: { width: '5%' }, sorter: false, filter: false}
];

export default medicine_orders_user_fields;