import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestLogin, setToken, requestData } from '../services/request';
import css from '../css/style.css';

function Login() {
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(false);
  const [failedTryLogin, setFailedTryLogin] = useState(false);
  const [roleData, setRoleData] = useState('');
  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  const loginValidateToken = async (event) => {
    event.preventDefault();
    try {
      const { token, role, name, email, id } = await requestLogin('/login', { ...input });
      const dataSeller = await requestData('/customer/seller');
      setToken(token);
      setRoleData(role);
      localStorage.setItem('user', JSON.stringify({ token, role, name, email, id }));
      localStorage.setItem('seller', JSON.stringify(dataSeller));
      setIsLogged(true);
    } catch (error) {
      console.log(error);
      setFailedTryLogin(true);
      setIsLogged(false);
    }
  };

  useEffect(() => {
    setFailedTryLogin(false);
  }, [input.email, input.password]);

  useEffect(() => {
    if (isLogged) {
      switch (roleData) {
      case 'administrator':
        navigate('/admin/manage');
        break;
      case 'seller':
        navigate('/seller/orders');
        break;
      case 'customer':
        navigate('/customer/products');
        break;
      default:
        break;
      }
    }
  }, [roleData, navigate, isLogged]);

  const handleInputChange = ({ target }) => {
    setInput({
      ...input,
      [target.name]: target.value,
    });
  };

  const isLoginValid = () => {
    const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PW_MINIMUM_LENGTH = 6;
    const { email, password } = input;
    return EMAIL_VALIDATION_REGEX.test(email) && password.length >= PW_MINIMUM_LENGTH;
  };

  return (
    <section style={ css } className="container">
      <h2 className="title">Fuguetão Brabo Delivery</h2>
      <div className="login-content">
        <form>
          <label htmlFor="email-input" className="input-div one">
            <input
              data-testid="common_login__input-email"
              type="email"
              name="email"
              id="email-input"
              value={ input.email }
              onChange={ handleInputChange }
              placeholder="Login"
              className="input"
            />
          </label>
          <label htmlFor="password-input" className="input-div pass">
            <input
              data-testid="common_login__input-password"
              type="password"
              name="password"
              id="password-input"
              value={ input.password }
              onChange={ handleInputChange }
              placeholder="Senha"
              className="input"
            />
          </label>
          <button
            type="button"
            data-testid="common_login__button-login"
            disabled={ !isLoginValid() }
            onClick={ (event) => loginValidateToken(event) }
            className="btn"
          >
            Enter
          </button>
          {
            (failedTryLogin)
              ? (
                <p
                  data-testid="common_login__element-invalid-email"
                >
                  {
                    `O endereço de e-mail ou a senha não estão corretos.
                    Por favor, tente novamente.`
                  }
                </p>
              )
              : null
          }
          <button
            type="button"
            data-testid="common_login__button-register"
            className="btn"
            onClick={ () => navigate('/register') }
          >
            Ainda não tenho conta
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
