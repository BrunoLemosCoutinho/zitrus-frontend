import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loading } from '../components';
import fetchCEP from '../services/apiServices';
import './AddCustomer.css';


function AddCustomer() {
    const { register, handleSubmit, formState: { errors } } = useForm();
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
        console.log("handleInputChange");
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

    

    const isValidAddress = address => {
        if (address.error) return false;
        return true;
    }

    const onSubmit = async data => {
        console.log(data);
        setFetchingCEP(true);
        const address = await fetchCEP(data.cep);
        setFetchingCEP(false);
        if (!isValidAddress(address)) {
            setHasAddressError(true);
            console.log(address);
        } else {
            setHasAddressError(false);
            console.log(address);
            fillAddressInputs(address);
        }

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
            
        </section>
    );
}

export default AddCustomer;
