import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import './Login.css';

function Login() {
    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
    const [formData, setFormData] = useState({
        user: '',
        password: '',
    });

    const { user, password } = formData;

    const handleInputChange = event => {
        const { name, value } = event.target;
        clearErrors(name);
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const onSubmit = async data => {
        console.log(data);
    }


    return (
        <section className="login">
            <div className="login-container">
                <form
                    className="login-form"
                    name="register" onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        className="login-input-name"
                        type="text"
                        placeholder="Usuário"
                        name="user"
                        value={user}
                        {...register('user', { required: { value: true, message: "Nome do Usuário é obrigatório" } })}
                        onChange={handleInputChange}
                    />
                    <div className="error-validation">
                        {errors.user && <p className="error-msg">{errors.user.message}</p>}
                    </div>
                    <input
                        className="login-input-password"
                        type="password"
                        placeholder="Senha"
                        name="password"
                        value={password}
                        {...register('password', { required: { value: true, message: "Senha é obrigatória" } })}
                        onChange={handleInputChange}
                    />
                    <div className="error-validation">
                        {errors.password && <p className="error-msg">{errors.password.message}</p>}
                    </div>
                    <Button className="button-login" variant="primary" type="submit">LOGIN</Button>
                    <div className="error-login"></div>
                </form>
            </div>
        </section>
    );
}

export default Login;
