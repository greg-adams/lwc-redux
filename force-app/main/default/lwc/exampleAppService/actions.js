let count = 0;

export const addNewContact = () => {
  count++;
  return {
    type: 'ADD_CONTACT',
    payload: count,
  }
}