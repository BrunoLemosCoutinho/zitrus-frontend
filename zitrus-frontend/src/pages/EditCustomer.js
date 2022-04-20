import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
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
                setFormData(data.customer);
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
        fetch(`/api/customers/${formData.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...formData })
        })
            .then(() => setStatus('success'))
            .then(() => {
                setTimeout(() => setStatus(''), 3000);
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

    const getCustomers = async () => {
        const requestResponse = await fetch('/api/customers');
        const data = await requestResponse.json();
        console.log("getCustomers", data);
    }

    return (
        <section className='cadastro-cliente'>
            <Menu />
            <div className="title-container">
                <h1>Editar Cliente</h1>
                {status === 'success' && <Alert variant="success">Cliente editado com sucesso!</Alert>}
                {status === 'error' && <p>Ocorreu um erro na edição do cliente...</p>}
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
                                    {...register('nome', { required: { value: true, message: "Nome é obrigatório" } })}
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
                                {/* {errors.cep && <span className="error-msg">{errors.cep.message}</span>}
                                {hasAddressError && <span className="error-msg">Erro de endereço</span>}
                                {askCEP && <span className="error-msg">Preencha um CEP válido</span>}
                                {askAddress && <span className="error-msg">Preencha um CEP válido</span>} */}
                                <input
                                    type="text"
                                    placeholder="CEP"
                                    name="cep"
                                    value={formData.cep}
                                    {...register('cep', { required: { value: true, message: "CEP é obrigatório" } })}
                                    onChange={handleInputChange}
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
                                    value={formData.logradouro}
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
                                    value={formData.bairro}
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
                                    value={formData.localidade}
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
                                    value={formData.uf}
                                />
                            </label>
                        </div>
                        <div className="register-container">
                            <Button className="btn cadastrar" variant="primary" type="submit">Editar Cliente</Button>
                        </div>
                    </form>
                </div>
            }
        </section>
    );
}
export default EditCustomer;
