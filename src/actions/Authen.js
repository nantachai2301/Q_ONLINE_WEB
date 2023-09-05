export function AUTHEN( users_id, id_card, first_name,last_name, role_id) {
  return { type: 'AUTHEN', users_id, id_card, first_name,last_name, role_id };
}

export function UAUTHEN() {
  return { type: 'UAUTHEN' };
}
export function AUTHORITIES(){
  return { type: 'AUTHORITIES'};
}

export function USERINFO() {
  return { type: 'USERINFO' };
}

