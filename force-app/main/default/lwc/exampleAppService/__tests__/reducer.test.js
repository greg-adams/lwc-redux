import { types, reducer as reducers } from '../exampleAppService';
import { initialState } from '../reducer';


describe('ui reducer', () => {
  const reducer = reducers.ui;

  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });


  it('should handle Add Contact', () => {

    const contacts = [
      {
        id: '1',
        name: 'Jane Doe'
      },
    ];

    expect(reducer({
      contacts
    },
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

