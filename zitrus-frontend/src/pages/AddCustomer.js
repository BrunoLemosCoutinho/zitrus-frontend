import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import { useForm } from 'react-hook-form';
import { Loading } from '../components';
import fetchCEP from '../services/apiServices';
import { Menu } from '../components';
import './AddCustomer.css';


function AddCustomer() {
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm();
    const [status, setStatus] = useState('');
    const [askAddress, setAskAddress] = useState(false);
    const [askCEP, setAskCEP] = useState(false);
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

    useEffect(() => {
        setValue('nome', nome);
        setValue('email', email);
        setValue('cep', cep);
    }, [formData]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        clearErrors(name);
        
        setFormData({
            ...formData,
            [name]: value,
        });

    }

    const handleCepChange = () => {
        resetAddressInputs();
        setRetrievedAddress(false);
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
            fillAddressInputs(address);
            setRetrievedAddress(true);
        } else {
            setHasAddressError(true);
            resetAddressInputs();
        }
    }


    const saveCustomer = () => {
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
                setStatus('error');
            });
    }


    const onSubmit = async data => {
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
                                {...register('nome', { required: { value: true, message: "Nome ?? obrigat??rio" } })}
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
                                {...register('email', { required: { value: true, message: "Email ?? obrigat??rio" } })}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                CEP
                            </span>
                            {errors.cep && <p className="error-msg">{errors.cep.message}</p>}
                            {(askAddress || askCEP || hasAddressError) && <p className="error-msg">Busque um CEP v??lido para preencher o endere??o</p>}
                            <input
                                type="text"
                                placeholder="CEP"
                                name="cep"
                                value={cep}
                                {...register('cep', { required: { value: true, message: "Busque um CEP v??lido para preencher o endere??o" } })}
                                onChange={handleInputChange}
                                onKeyDown={handleCepChange}
                            />
                        </label>
                        <Button
                            className="btn buscar-cep"
                            variant="secondary"
                            size="sm"
                            onClick={() => getAddress()}
                        >
                            BUSCAR ENDERE??O
                        </Button>
                    </div>
                    <div className='form-item'>
                        <label>
                            <span className='label-text'>
                                Logradouro
                            </span>
                            {hasAddressError && <p className="error-msg">Erro de endere??o</p>}
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
                            {hasAddressError && <p className="error-msg">Erro de endere??o</p>}
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
                            {hasAddressError && <p className="error-msg">Erro de endere??o</p>}
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
                            {hasAddressError && <p className="error-msg">Erro de endere??o</p>}
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
                        <Button className="btn cadastrar" variant="primary" type="submit">CADASTRAR CLIENTE</Button>
                    </div>
                </form>
            </div>

        </section>
    );
}

export default AddCustomer;
