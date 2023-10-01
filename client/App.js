import { Provider } from 'react-redux';
import configureStore from 'utils/store';
import Initialize from 'pages/Initialize';

export default function App() {
  //for setting utils/reducer variables
  const store = configureStore();
  return (
    <Provider store={store}>
      <Initialize/>
    </Provider>
  );
}
