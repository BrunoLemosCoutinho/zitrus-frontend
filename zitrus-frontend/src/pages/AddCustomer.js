import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import { useForm } from 'react-hook-form';
import { Loading } from '../components';
import fetchCEP from '../services/apiServices';
import { Menu } from '../components';
import './AddCustomer.css';


function AddCustomer() {
    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
    const [status, setStatus] = useState('');
    const [askCEP, setAskCEP] = useState(false);
    const [askAddress, setAskAddress] = useState(false);
    const [retrievedAddress, setRetrievedAddress] = useState(false);
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

    const { nome, email, cep, logradouro, bairro, localidade, uf } = formData;

    const handleInputChange = event => {
        const { name, value } = event.target;
        clearErrors(name);
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

    const resetAllInputs = () => {
        setFormData({
            nome: '',
            email: '',
            cep: '',
            logradouro: '',
            bairro: '',
            localidade: '',
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
            .then(() => {
                setTimeout(() => {
                    resetAllInputs();
                    setStatus('');
                }, 3000);
            })
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


    return (
        <section className='cadastro-cliente'>
            <Menu />
            <div className="title-container">
                <h1>Cadastro de Cliente</h1>
                {status === 'success' && <Alert variant="success">Cliente cadastrado com sucesso!</Alert>}
                {status === 'error' && <p>Ocorreu um erro no cadastro do cliente...</p>}
                {fetchingCEP && <Loading />}
            </div>
            <div className="form-container">
                <form name="register" onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Nome
                            </span>
                            {errors.nome && <span className="error-msg">{errors.nome.message}</span>}
                            <input
                                type="text"
                                placeholder="Nome"
                                name="nome"
                                value={nome}
                                {...register('nome', { required: { value: true, message: "Nome é obrigatório" } })}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    {/* {errors.nome && <span className="error-msg">{errors.nome.message}</span>} */}
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Email
                            </span>
                            {errors.email && <span className="error-msg">{errors.email.message}</span>}
                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={email}
                                {...register('email', { required: { value: true, message: "Email é obrigatório" } })}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                CEP
                            </span>
                            {errors.cep && <span className="error-msg">{errors.cep.message}</span>}
                            {hasAddressError && <span className="error-msg">Erro de endereço</span>}
                            {askCEP && <span className="error-msg">Preencha um CEP válido</span>}
                            {askAddress && <span className="error-msg">Preencha um CEP válido</span>}
                            <input
                                type="text"
                                placeholder="CEP"
                                name="cep"
                                value={cep}
                                {...register('cep', { required: { value: true, message: "Preencha um CEP válido" } })}
                                onChange={handleInputChange}
                            // onBlur={() => getAddress()}
                            // onFocus={() => clearErrors('cep')}
                            />
                        </label>
                        <Button className="btn buscar-cep" variant="secondary" size="sm" onClick={() => getAddress()}>Buscar Endereço</Button>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Logradouro
                            </span>
                            <input
                                disabled
                                type="text"
                                placeholder="Logradouro"
                                name="logradouro"
                                value={logradouro}
                            />
                        </label>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Bairro
                            </span>
                            <input
                                disabled
                                type="text"
                                placeholder="Bairro"
                                name="bairro"
                                value={bairro}
                            />
                        </label>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Localidade
                            </span>
                            <input
                                disabled
                                type="text"
                                placeholder="Localidade"
                                name="localidade"
                                value={localidade}
                            />
                        </label>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                UF
                            </span>
                            <input
                                disabled
                                type="text"
                                placeholder="UF"
                                name="uf"
                                value={uf}
                            />
                        </label>
                    </div>
                    <div className="register-container">
                        <Button className="btn cadastrar" variant="primary" type="submit">Cadastrar Cliente</Button>
                    </div>
                </form>
            </div>

        </section>
    );
}

export default AddCustomer;
