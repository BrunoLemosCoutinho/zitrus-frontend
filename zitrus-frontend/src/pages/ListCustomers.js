import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import { Menu } from '../components';
import { Customer } from "../components";


function ListCustomers() {

    const [customers, setCustomers] = useState([]);
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const getCustomers = async () => {
            const response = await fetch('/api/customers');
            const result = await response.json();
            console.log("getCustomers", result);
            console.log("result.customers", result.customers);
            setCustomers([...result.customers]);
            setIsFetching(false);
        }

        getCustomers();
    }, []);


    return (
        <section>
            <Menu />
            <h1>Clientes</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {!isFetching && customers.map((customer) => (
                        <tr key={customer.id}>
                            <th scope="row">{customer.id}</th>
                            <td><Link to={`/clientes/${customer.id}`}>{customer.nome}</Link></td>
                            <td>{customer.email}</td>
                            <td>DETALHES | EDITAR | EXCLUIR</td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </section>
    );
}

export default ListCustomers;
