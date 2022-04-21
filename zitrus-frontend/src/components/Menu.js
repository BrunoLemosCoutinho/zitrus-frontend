import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import './Menu.css';


function Menu() {
    const history = useHistory();

    return (
        <header>
            <nav>
                <Navbar bg="primary" variant="dark">
                    <Container>
                        <Navbar.Brand href="#">Loja do Arnaldo</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => history.push('/clientes')}>Clientes</Nav.Link>
                            <Nav.Link href="/cadastro-cliente">Cadastrar</Nav.Link>
                            <Nav.Link href="/">Sair</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </nav>
        </header>
    );
}

export default Menu;
