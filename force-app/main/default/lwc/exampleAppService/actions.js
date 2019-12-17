import * as types from './types';

export const addNewContact = (count) => {
  return {
    type: types.ADD_CONTACT,
    payload: count,
  }
}