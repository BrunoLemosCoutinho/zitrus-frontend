import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import { Menu, Loading } from "../components";
import fetchCEP from '../services/apiServices';

function EditCustomer({ match }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const customerId = match.params.customerId;
    const [isFetching, setIsFetching] = useState(true);
    const [status, setStatus] = useState('');
    const [askCEP, setAskCEP] = useState(false);
    const [askAddress, setAskAddress] = useState(false);
    const [retrievedAddress, setRetrievedAddress] = useState(true);
    const [hasAddressError, setHasAddressError] = useState(false);
    const [fetchingCEP, setFetchingCEP] = useState(false);
    const [formData, setFormData] = useState();

    // const { nome, email, cep, logradouro, bairro, localidade, uf } = formData;

    useEffect(() => {
        fetch(`/api/customers/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData(data.customers);
                setIsFetching(false);
            });
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }


    const fillAddressInputs = address => {
        setFormData({
            ...formData,
            bairro: address.bairro,
            localidade: address.localidade,
            logradouro: address.logradouro,
            uf: address.uf,
        });
    }


    const resetAddressInputs = () => {
        setFormData({
            ...formData,
            bairro: '',
            localidade: '',
            logradouro: '',
            uf: '',
        });
    }


    const isValidAddress = address => {
        if (address.error) return false;
        return true;
    }


    const isCEPEmpty = () => {
        return formData.cep.length === 0;
    }


    const getAddress = async () => {
        if (isCEPEmpty()) {
            setAskCEP(true);
            return;
        } else {
            setAskCEP(false);
        }
        setFetchingCEP(true);
        setAskAddress(false);
        const address = await fetchCEP(formData.cep);

        setFetchingCEP(false);
        if (isValidAddress(address)) {
            setHasAddressError(false);
            console.log(address);
            fillAddressInputs(address);
            setRetrievedAddress(true);
        } else {
            console.log('erro de cep', address);
            setHasAddressError(true);
            resetAddressInputs();
        }
    }


    const saveCustomer = () => {
        console.log("saveCustomer");
        console.log(formData);
        fetch('/api/customers', {
            method: 'POST',
            body: JSON.stringify({ ...formData })
        })
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error.message);
                setStatus('error');
            });
    }


    const onSubmit = async data => {
        console.log(data);
        if (retrievedAddress) {
            saveCustomer();
        } else {
            setAskAddress(true);
        }

    }

    const getCustomers = async () => {
        const requestResponse = await fetch('/api/customers');
        const data = await requestResponse.json();
        console.log("getCustomers", data);
    }

    return (
        <section className='cadastro-cliente'>
            <Menu />
            <button onClick={() => getCustomers()}>CLientes</button>
            <h1>Cadastro de Cliente</h1>
            {!isFetching &&
                <form name="register" onSubmit={handleSubmit(onSubmit)}>
                    <label>
                        Nome
                        <input
                            type="text"
                            placeholder="Nome"
                            name="nome"
                            value={formData.nome}
                            {...register('nome', { required: { value: true, message: "Nome é obrigatório" } })}
                            onChange={handleInputChange}
                        />
                    </label>
                    {errors.nome && <p>{errors.nome.message}</p>}
                    <label>
                        Email
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            {...register('email', { required: { value: true, message: "Email é obrigatório" } })}
                            onChange={handleInputChange}
                        />
                    </label>
                    {errors.email && <p>{errors.email.message}</p>}
                    <label>
                        CEP
                        <input
                            type="text"
                            placeholder="CEP"
                            name="cep"
                            value={formData.cep}
                            {...register('cep', { required: { value: true, message: "CEP é obrigatório" } })}
                            onChange={handleInputChange}
                        />
                    </label>
                    <input type="button" value="Buscar Endereço" onClick={() => getAddress()} />
                    {errors.cep && <p>{errors.cep.message}</p>}
                    <label>
                        Logradouro
                        <input
                            disabled
                            type="text"
                            placeholder="Logradouro"
                            name="logradouro"
                            value={formData.logradouro}
                        />
                    </label>
                    <label>
                        Bairro
                        <input
                            disabled
                            type="text"
                            placeholder="Bairro"
                            name="bairro"
                            value={formData.bairro}
                        />
                    </label>
                    <label>
                        Localidade
                        <input
                            disabled
                            type="text"
                            placeholder="Localidade"
                            name="localidade"
                            value={formData.localidade}
                        />
                    </label>
                    <label>
                        UF
                        <input
                            disabled
                            type="text"
                            placeholder="UF"
                            name="uf"
                            value={formData.uf}
                        />
                    </label>
                    <input type="submit" />
                </form>

            }
            {fetchingCEP && <Loading />}
            {hasAddressError && <p>Erro de endereço</p>}
            {askCEP && <p>CEP vazio</p>}
            {askAddress && <p>Busque o endereço pelo CEP</p>}
            {status === 'success' && <p>Cliente editado.</p>}
            {status === 'error' && <p>Ocorreu um erro no cadastro do cliente...</p>}

        </section>
    );
}
export default EditCustomer;
