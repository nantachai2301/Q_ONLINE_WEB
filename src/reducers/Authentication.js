var initialState = {
  users_id: localStorage.getItem('users_id'),
        id_Card: localStorage.getItem('id_card'),
        first_name: localStorage.getItem('first_name'),
        last_name: localStorage.getItem('last_name'),
        role_id: localStorage.getItem('role_id'),
};

export default function Authentication(state = initialState, action) {
  switch (action.type) {
    case 'AUTHEN':
      localStorage.setItem('users_id', action.users_id);
      localStorage.setItem('id_card', action.id_card);
      localStorage.setItem('first_name', action.first_name);
      localStorage.setItem('last_name', action.last_name);
      localStorage.setItem('role_id', action.role_id);
      return {
        ...state,
        users_id: localStorage.getItem('users_id'),
        id_Card: localStorage.getItem('id_card'),
        first_name: localStorage.getItem('first_name'),
        last_name: localStorage.getItem('last_name'),
        role_id: localStorage.getItem('role_id'),
      };
    case 'UAUTHEN':
      localStorage.removeItem('users_id', action.users_id);
      localStorage.removeItem('id_card', action.id_card);
      localStorage.removeItem('first_name', action.first_name);
      localStorage.removeItem('last_name', action.last_name);
      localStorage.removeItem('role_id', action.role_id);
    
      return {
        ...state,
        users_id: localStorage.getItem('users_id'),
        id_Card: localStorage.getItem('id_card'),
        first_name: localStorage.getItem('first_name'),
        last_name: localStorage.getItem('last_name'),
        role_id: localStorage.getItem('role_id'),
      };
    case 'USERINFO':
      return {
        ...state,
        users_id: localStorage.getItem('users_id'),
        id_Card: localStorage.getItem('id_card'),
        first_name: localStorage.getItem('first_name'),
        last_name: localStorage.getItem('last_name'),
        role_id: localStorage.getItem('role_id'),
      };
    default:
      return {
        ...state,
        users_id: localStorage.getItem('users_id'),
        id_Card: localStorage.getItem('id_card'),
        first_name: localStorage.getItem('first_name'),
        last_name: localStorage.getItem('last_name'),
        role_id: localStorage.getItem('role_id'),
      };
  }
}
