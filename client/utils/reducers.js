import { Appearance } from 'react-native';

import {
  TOGGLE_THEME,
  UPDATE_USER, ADD_USER, REMOVE_USER,
  INITIAL_USERS, 
} from './actions';

const initialStateTheme = {
  mode: Appearance.getColorScheme(),
};

const initialStateUser = {
  id: null,
  username: '',
  loggedIn: false,
};

const initialStateRoom = {
  users: [],
};

export const themeReducer = (state = initialStateTheme, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        mode: action.value
      }
    default:
      return state;
  }
}

export const userReducer = (state = initialStateUser, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        id: action.value.id,
        username: action.value.username,
        loggedIn: action.value.loggedIn
      }
    default:
      return state;
  }
}

export const roomReducer = (state = initialStateRoom, action) => {
  switch (action.type) {
    case INITIAL_USERS:
      return {
        ...state,
        users: action.value
      }
    case ADD_USER:
      console.log(action.value);
      return {
        ...state,
        users: [...state.users, action.value]
      }
    case REMOVE_USER:
      return {
        ...state,
        users: [...state.users.splice(
          state.users.findIndex(i => i.id === action.value), 1
        )]
      }
    default:
      return state;
  }
}
