
import './App.css';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import ArticlesList from './components/ArticlesList';
const store =configureStore();

function App() {
  return (
    <Provider store={store}>

      <ArticlesList />
    </Provider>
  );
}

export default App;
