import React, { useEffect, useState, useCallback } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { Menu, Loading } from '../components';
import './ListCustomers.css';


function ListCustomers() {

    const [customers, setCustomers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [updateState, setUpdateState] = useState();
    const forceUpdate = useCallback(() => setUpdateState({}), []);

    useEffect(() => {
        const getCustomers = async () => {
            const response = await fetch('/api/customers');
            const result = await response.json();
            setCustomers([...result.customers]);
            setIsFetching(false);
        }

        getCustomers();
    }, [updateState]);

    const handleDelete = (customerId) => {
        fetch(`/api/customers/${customerId}`, {
            method: 'DELETE',
        }).then(() => forceUpdate());
    }

    return (
        <section className="customers-list">
            <Menu />
            <h1>Clientes</h1>
            {isFetching && <Loading />}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col" className="actions-header">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {!isFetching && customers.map((customer) => (
                        <tr key={customer.id}>
                            <th scope="row">{customer.id}</th>
                            <td><Link to={`/clientes/${customer.id}`}>{customer.nome}</Link></td>
                            <td>{customer.email}</td>
                            <td>
                                <div className="actions">
                                    <Link to={`/clientes/${customer.id}`}><Button variant="primary">DETALHES</Button></Link>
                                    <Link to={`/editar-cliente/${customer.id}`}><Button variant="secondary">EDITAR</Button></Link>
                                    <Button onClick={() => handleDelete(customer.id)} variant="danger">EXCLUIR</Button>
                                </div>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </section>
    );
}

export default ListCustomers;
