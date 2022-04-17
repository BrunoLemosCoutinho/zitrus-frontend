import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loading } from '../components';
import fetchCEP from '../services/apiServices';
import './AddCustomer.css';


function AddCustomer() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [status, setStatus] = useState('');
    const [askCEP, setAskCEP] = useState(false);
    const [hasAddressError, setHasAddressError] = useState(false);
    const [fetchingCEP, setFetchingCEP] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cep: '',
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: '',
    });

    const { logradouro, bairro, localidade, uf } = formData;

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
        const address = await fetchCEP(formData.cep);

        setFetchingCEP(false);
        if (!isValidAddress(address)) {
            console.log('erro de cep', address);
            setHasAddressError(true);
            resetAddressInputs();
        } else {
            setHasAddressError(false);
            console.log(address);
            fillAddressInputs(address);
        }
    }

    const pegaClientes = () => {
        fetch('/api/customers')
            .then(response => response.json())
            .then(json => console.log(json));
    }
    const saveCustomer = () => {
        console.log("saveCustomer");
        console.log(formData);
        fetch('/api/salva', {
            method: 'POST',
            body: JSON.stringify({...formData})
        })
            .then(() => setStatus('success'))
            .catch(error => {
                console.log(error.message);
                setStatus('error');
            });
    }


    const onSubmit = async data => {
        console.log(data);
        saveCustomer();

    }

    return (
        <section className='cadastrar-usuario'>
            <h1>Cadastro de Usuário</h1>
            <form name="register" onSubmit={ handleSubmit(onSubmit) }>
                <label>
                    Nome
                    <input
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        onKeyUp={ (event) => handleInputChange(event) }
                        { ...register('nome', {required: {value: true, message: "Nome é obrigatório"}}) }
                    />
                </label>
                { errors.nome && <p>{errors.nome.message}</p> }
                <label>
                    Email
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onKeyUp={ (event) => handleInputChange(event) }
                        { ...register('email', { required: {value: true, message: "Email é obrigatório"}}) }
                    />
                </label>
                { errors.email && <p>{errors.email.message}</p> }
                <label>
                    CEP
                    <input
                        type="text"
                        placeholder="CEP"
                        name="cep"
                        onKeyUp={ (event) => handleInputChange(event) }
                        { ...register('cep', { required: {value: true, message: "CEP é obrigatório"}}) }
                    />
                </label>
                <input type="button" value="Buscar Endereço" onClick={ () => getAddress()}/>
                { errors.cep && <p>{errors.cep.message}</p> }
                <label>
                    Logradouro
                    <input
                        disabled
                        type="text"
                        placeholder="Logradouro"
                        name="logradouro"
                        value={ logradouro }
                    />
                </label>
                <label>
                    Bairro
                    <input
                        disabled
                        type="text"
                        placeholder="Bairro"
                        name="bairro"
                        value={ bairro }
                    />
                </label>
                <label>
                    Localidade
                    <input
                        disabled
                        type="text"
                        placeholder="Localidade"
                        name="localidade"
                        value={ localidade }
                    />
                </label>
                <label>
                    UF
                    <input
                        disabled
                        type="text"
                        placeholder="UF"
                        name="uf"
                        value={ uf }
                    />
                </label>
                <input type="submit" />
            </form>
            { fetchingCEP && <Loading /> }
            { hasAddressError && <p>Erro de endereço</p> }
            { askCEP && <p>CEP vazio</p> }
            <button onClick={() => pegaClientes()}>Pega clientes</button>
        </section>
    );
}

export default AddCustomer;
