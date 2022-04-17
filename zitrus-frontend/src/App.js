
import { Route, Switch } from 'react-router-dom';
import { Login, AddCustomer, ListCustomers } from './pages';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/cadastro-cliente" component={ AddCustomer } />
      <Route exact path="/clientes" component={ ListCustomers } />
    </Switch>

  );
}

export default App;
