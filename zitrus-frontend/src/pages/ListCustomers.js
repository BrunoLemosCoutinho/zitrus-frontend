import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
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
            <h1>Clientes</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ver Detalhes</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {!isFetching && customers.map((customer, index) => (
                        <tr key={index}>
                            <th scope="row">{customer.id}</th>
                            <td>{customer.nome}</td>
                            <td>{customer.email}</td>
                            <td>lupa</td>
                            <td>editar</td>
                            <td>lixeira</td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </section>
    );
}

export default ListCustomers;
