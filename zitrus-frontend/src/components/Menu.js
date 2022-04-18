import React from "react";
import { Link } from "react-router-dom";
import './Menu.css';


function Menu() {
    return (
        <header>
            <nav>
                <ul className="links">
                    <li><Link to="/clientes">Clientes</Link></li>
                    <li><Link to="/cadastro-cliente">Cadastrar Cliente</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Menu;
