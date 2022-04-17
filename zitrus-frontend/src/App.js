
import { Route, Switch } from 'react-router-dom';
import { Login, CadastroUsuario } from './pages';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/cadastro-usuario" component={ CadastroUsuario } />
    </Switch>

  );
}

export default App;
