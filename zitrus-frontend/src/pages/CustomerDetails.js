import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import { Link, useHistory } from "react-router-dom";
import { Loading, Menu } from "../components";
import './CustomerDetails.css';

function CustomerDetails({ match }) {
    const history = useHistory();
    const customerId = match.params.customerId;
    const [customer, setCustomer] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch(`/api/customers/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("data edit", data);
                setCustomer(data.customers);
                setIsFetching(false);
            });
    }, [customerId]);


    const handleDelete = (customerId) => {
        fetch(`/api/customers/${customerId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setTimeout(() => {
                    setStatus('delete');
                    setTimeout(() => history.push('/clientes'), 3000);
                }, 3000);
            })
            .catch(error => {
                setStatus('error');
            });
    }


    return (
        <section className="details">
            <Menu />
            <div className="title-container">
                <h1>Detalhes do Cliente</h1>
                {status === 'delete' && <Alert variant="danger">Cliente excluído!</Alert>}
            </div>
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
                    <div className="register-container">
                        <Link to={`/editar-cliente/${customer.id}`}><Button variant="secondary">EDITAR</Button></Link>
                        <Button className="btn detalhes-excluir" onClick={() => handleDelete(customer.id)} variant="danger">EXCLUIR</Button>
                    </div>
                </div>
            }
        </section>
    );
}

export default CustomerDetails;
