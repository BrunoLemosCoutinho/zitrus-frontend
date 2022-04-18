import React from "react";
import './Customer.css';

function Customer(props) {
    const { customer } = props;
    console.log("prop customer ", customer);
    return (
        <div className="customer">
            <div className="customer_item"><span>{customer.id}</span></div>
            <div className="customer_item"><span>{customer.nome}</span></div>
            <div className="customer_item"><span>{customer.email}</span></div>
        </div>
    );
}

export default Customer;
