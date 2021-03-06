import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import { Menu, Loading } from "../components";
import fetchCEP from '../services/apiServices';
import './EditCustomer.css';

function EditCustomer({ match }) {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm();
    const customerId = match.params.customerId;
    const [isFetching, setIsFetching] = useState(true);
    const [status, setStatus] = useState('');
    const [askAddress, setAskAddress] = useState(false);
    const [retrievedAddress, setRetrievedAddress] = useState(true);
    const [hasAddressError, setHasAddressError] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cep: '',
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: '',
    });


    useEffect(() => {
        fetch(`/api/customers/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData(data.customers);
                setIsFetching(false);
            });
    }, [customerId]);

    useEffect(() => {
        setValue('nome', formData.nome);
        setValue('email', formData.email);
        setValue('cep', formData.cep);
    }, [formData]);

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


    const isValidAddress = address => {
        if (address.error) return false;
        return true;
    }


    const isCEPEmpty = () => {
        return formData.cep.length === 0;
    }


    const getAddress = async () => {
        if (isCEPEmpty()) {
            return;
        }

        setAskAddress(false);
        const address = await fetchCEP(formData.cep);

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
        fetch(`/api/customers/${formData.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...formData })
        })
            .then(() => setStatus('success'))
            .then(() => {
                setTimeout(() => setStatus(''), 3000);
            })
            .catch(error => {
                setStatus('error');
            });
    }


    const onSubmit = async data => {
        getAddress();
        if (retrievedAddress) {
            saveCustomer();
        } else {
            setAskAddress(true);
        }

    }


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

    const handleCepChange = () => {
        resetAddressInputs();
        setRetrievedAddress(false);
    }


    return (
        <section className='edit-customer'>
            <Menu />
            <div className="title-container">
                <h1>Editar Cliente</h1>
                {status === 'success' && <Alert variant="success">Cliente editado com sucesso!</Alert>}
                {status === 'delete' && <Alert variant="danger">Cliente exclu??do!</Alert>}
                {status === 'error' && <p>Ocorreu um erro na edi????o do cliente...</p>}
                {isFetching && <Loading />}

            </div>
            {!isFetching &&
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
                                    value={formData.nome}
                                    {...register('nome', { required: { value: true, message: "Nome ?? obrigat??rio" } })}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
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
                                    value={formData.email}
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
                                {errors.cep && <span className="error-msg">{errors.cep.message}</span>}
                                {askAddress && <span className="error-msg">Preencha um CEP v??lido</span>}
                                <input
                                    type="text"
                                    placeholder="CEP"
                                    name="cep"
                                    value={formData.cep}
                                    {...register('cep', { required: { value: true, message: "CEP ?? obrigat??rio" } })}
                                    onChange={handleInputChange}
                                    onKeyDown={handleCepChange}
                                />
                            </label>
                            <Button className="btn buscar-cep" variant="secondary" size="sm" onClick={() => getAddress()}>Buscar Endere??o</Button>
                        </div>
                        <div className='form-item'>
                            <label>
                                <span className='label-text'>
                                    Logradouro
                                </span>
                                {hasAddressError && <span className="error-msg">Erro de endere??o</span>}
                                <input
                                    disabled
                                    type="text"
                                    placeholder="Logradouro"
                                    name="logradouro"
                                    value={formData.logradouro}
                                />
                            </label>
                        </div>
                        <div className='form-item'>
                            <label>
                                <span className='label-text'>
                                    Bairro
                                </span>
                                {hasAddressError && <span className="error-msg">Erro de endere??o</span>}
                                <input
                                    disabled
                                    type="text"
                                    placeholder="Bairro"
                                    name="bairro"
                                    value={formData.bairro}
                                />
                            </label>
                        </div>
                        <div className='form-item'>
                            <label>
                                <span className='label-text'>
                                    Localidade
                                </span>
                                {hasAddressError && <span className="error-msg">Erro de endere??o</span>}
                                <input
                                    disabled
                                    type="text"
                                    placeholder="Localidade"
                                    name="localidade"
                                    value={formData.localidade}
                                />
                            </label>
                        </div>
                        <div className='form-item'>
                            <label>
                                <span className='label-text'>
                                    UF
                                </span>
                                {hasAddressError && <span className="error-msg">Erro de endere??o</span>}
                                <input
                                    disabled
                                    type="text"
                                    placeholder="UF"
                                    name="uf"
                                    value={formData.uf}
                                />
                            </label>
                        </div>
                        <div className="register-container">
                            <Button className="btn cadastrar" variant="success" type="submit">SALVAR</Button>
                            <Button className="btn excluir" onClick={() => handleDelete(formData.id)} variant="danger">EXCLUIR</Button>
                            <Button className="btn cancelar" onClick={() => history.push('/clientes')} variant="warning">CANCELAR</Button>
                        </div>
                    </form>
                </div>
            }
        </section>
    );
}
export default EditCustomer;
