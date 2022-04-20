import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { Loading, Menu } from "../components";
import './CustomerDetails.css';

function CustomerDetails({ match }) {
    const customerId = match.params.customerId;
    const [customer, setCustomer] = useState();
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetch(`/api/customers/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                setCustomer(data.customer);
                setIsFetching(false);
            });
    }, []);

    return (
        <section>
            <Menu />
            <h1>Detalhes do Cliente</h1>
            {isFetching && <Loading />}
            {!isFetching &&
                <div className="customer-details-container">
                    <Table className="customer-details" striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Id</th>
                                <td>{customer.id}</td>
                            </tr>
                            <tr>
                                <th>Nome</th>
                                <td>{customer.nome}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{customer.email}</td>
                            </tr>
                            <tr>
                                <th>CEP</th>
                                <td>{customer.cep}</td>
                            </tr>
                            <tr>
                                <th>Localidade</th>
                                <td>{customer.localidade}</td>
                            </tr>
                            <tr>
                                <th>UF</th>
                                <td>{customer.uf}</td>
                            </tr>
                            <tr>
                                <th>Logradouro</th>
                                <td>{customer.logradouro}</td>
                            </tr>
                            <tr>
                                <th>Bairro</th>
                                <td>{customer.bairro}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Link to={`/editar-cliente/${customer.id}`}><Button variant="secondary">EDITAR</Button></Link>
                </div>
            }
        </section>
    );
}

export default CustomerDetails;
