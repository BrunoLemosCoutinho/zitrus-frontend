
import { Route, Switch } from 'react-router-dom';
import { Login, AddCustomer } from './pages';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/cadastro-usuario" component={ AddCustomer } />
    </Switch>

  );
}

export default App;
