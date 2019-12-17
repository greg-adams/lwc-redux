export const initialState = {
  contacts: [
    {
      id: '1',
      name: 'Jane Doe'
    },
    {
      id: '2',
      name: 'John Doe',
    },
  ],
}



function uiReducer(state = initialState, action) {
  switch (action.type) {

    case 'ADD_CONTACT': {
      return {
        ...state,
        contacts: [
          {
            id: `${action.payload}`,
            name: 'New Contact ' + action.payload,
          },
          ...state.contacts
        ]
      };
    }

    default: {
      return state;
    }
  }
}



function otherReducer(state = {}, action) {
  switch (action.type) {

    case 'ADD_USER_ID': {
      return {
        ...state,
        userId: Math.random()
      };
    }

    default: {
      return state;
    }
  }
}




export default {
  ui: uiReducer,
  other: otherReducer
}