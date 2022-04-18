
import { Route, Switch } from 'react-router-dom';
import { Login, AddCustomer, ListCustomers } from './pages';
import { Menu } from './components';


function App() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/cadastro-cliente" component={ AddCustomer } />
        <Route exact path="/clientes" component={ ListCustomers } />
      </Switch>
    </div>

  );
}

export default App;
