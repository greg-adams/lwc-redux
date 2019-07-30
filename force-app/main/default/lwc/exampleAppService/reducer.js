const initialState = {
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



export default function (state = initialState, action) {
  switch (action.type) {

    case 'ADD_CONTACT': {
      return {
        ...state,
        contacts: [
          {
            id: Math.random(),
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