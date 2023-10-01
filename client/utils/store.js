import { createStore, combineReducers } from 'redux';
import { themeReducer, userReducer, roomReducer } from './reducers';

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
  room: roomReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;
