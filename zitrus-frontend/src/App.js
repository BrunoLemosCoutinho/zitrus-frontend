
import { Route, Switch } from 'react-router-dom';
import { Login, AddCustomer, ListCustomers, CustomerDetails, EditCustomer } from './pages';


function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/cadastro-cliente" component={ AddCustomer } />
        <Route exact path="/clientes" component={ ListCustomers } />
        <Route exact path="/clientes/:customerId" component={ CustomerDetails } />
        <Route exact path="/editar-cliente/:customerId" component={ EditCustomer } />
      </Switch>
    </div>

  );
}

export default App;
