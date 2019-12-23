import { types, reducer } from '../exampleAppService';
import { initialState } from '../reducer';

describe('ui reducer', () => {
  const uiReducer = reducer.ui;

  it('should return initial state', () => {
    expect(uiReducer(undefined, {})).toEqual(initialState);
  });


  it('should handle Add Contact', () => {
    const contacts = [
      {
        id: '1',
        name: 'Jane Doe'
      },
    ];

    expect(
      uiReducer({ contacts },
        {
          type: types.ADD_CONTACT,
          payload: 2
        }
      )).toEqual({
        contacts: [
          {
            id: '2',
            name: 'New Contact 2'
          },
          {
            id: '1',
            name: 'Jane Doe'
          }
        ]
      });
  });


  // ....
})

