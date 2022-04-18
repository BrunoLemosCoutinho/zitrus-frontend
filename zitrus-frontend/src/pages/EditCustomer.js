import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import { Menu, Loading } from "../components";

function EditCustomer({ match }) {
    const customerId = match.params.customerId;
    const [customer, setCustomer] = useState();
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetch(`/api/customers/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                setCustomer(data.customers);
                setIsFetching(false);
            });
    }, []);

    const handleInputChange = event => {
        console.log("Inupt change: ", event.target.value);
        const { name, value } = event.target;
        setCustomer({
            ...customer,
            [name]: value
        });
    }

    return (
        <section>
            <Menu />
            <h1>Editar Cliente</h1>
            <p>Id do cliente: {customerId}</p>
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
                                <td>
                                    <input
                                        name="nome"
                                        value={customer.nome}
                                        onChange={handleInputChange}
                                    />
                                </td>
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
                    <Link to={`/editar-cliente/${customer.id}`}>Editar Cliente</Link>
                </div>
            }
        </section>
    );
}

export default EditCustomer;
