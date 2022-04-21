import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Login.css';

function Login() {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm();
    const [errorLogin, setErrorLogin] = useState(false);
    const [formData, setFormData] = useState({
        inputUser: '',
        inputPassword: '',
    });

    const { inputUser, inputPassword } = formData;

    const correctUser = 'zitrino';
    const correctPassword = 'venhaserfeliz';

    useEffect(() => {
        setValue('inputUser', inputUser);
        setValue('inputPassword', inputPassword);
    }, [formData]);

    
    const handleInputChange = event => {
        const { name, value } = event.target;
        clearErrors(name);
        setErrorLogin(false);
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const isValidLogin = ({ inputUser, inputPassword }) => {
        if (inputUser === correctUser && inputPassword === correctPassword) {
            return true
        }
        return false;
    }

    const onSubmit = async (data, event) => {
        event.preventDefault();
        if (isValidLogin(data)) {
            history.push('/clientes');
        } else {
            setErrorLogin(true);
        }
    }


    return (
        <section className="login">
            <div className="login-container">
                <h1>Loja do Arnaldo</h1>
                <form
                    className="login-form"
                    name="register"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        className="login-input-name"
                        type="text"
                        placeholder="Usuário"
                        name="inputUser"
                        value={inputUser}
                        {...register('inputUser', { required: { value: true, message: "Nome do Usuário é obrigatório" } })}
                        onChange={handleInputChange}
                    />
                    <div className="error-validation">
                        {errors.inputUser && <p className="error-msg">{errors.inputUser.message}</p>}
                    </div>
                    <input
                        className="login-input-password"
                        type="password"
                        placeholder="Senha"
                        name="inputPassword"
                        value={inputPassword}
                        {...register('inputPassword', { required: { value: true, message: "Senha é obrigatória" } })}
                        onChange={handleInputChange}
                    />
                    <div className="error-validation">
                        {errors.inputPassword && <p className="error-msg">{errors.inputPassword.message}</p>}
                    </div>
                    <Button className="button-login" variant="primary" type="submit">LOGIN</Button>
                    <div className="error-login">
                        {errorLogin && <p className="error-msg">Usuário e / ou Senha inválidos</p>}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;
