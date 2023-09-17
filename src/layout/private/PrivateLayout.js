import React, { Fragment } from 'react';
import SideBarAdmin from '../../components/Private/SideBarAdmin';
import NavBar from '../../components/Private/NavBar';

import '../../style/private.css';

function PrivateLayout(props) {
  return (
    <Fragment>
      <SideBarAdmin />
      <div className="main-private-layout">
        <NavBar />
        <div className="main-content-private-layout w-full p-4">{props.children}</div>
      
      </div>  
    
    </Fragment>
  );
}

export default PrivateLayout;
