import { actions, types } from '../exampleAppService';

describe('actions', () => {

  it('creates new contact action', () => {
    const COUNT = 2;

    expect(actions.addNewContact(COUNT)).toEqual({
      type: types.ADD_CONTACT,
      payload: COUNT
    });
  });


  // ...


})