export const TOGGLE_THEME = 'TOGGLE_THEME';
export const UPDATE_USER = 'UPDATE_USER';
export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const INITIAL_USERS = 'INITIAL_USERS';

export const toggleMode = (mode) => {
  return {
    type: TOGGLE_THEME,
    value: mode
  }
};

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    value: user
  }
};

export const addUser = (user) => {
  return {
    type: ADD_USER,
    value: user
  }
};

export const removeUser = (user) => {
  return {
    type: REMOVE_USER,
    value: user
  }
};

export const initialUsers = (users) => {
  return {
    type: INITIAL_USERS,
    value: users
  }
};
