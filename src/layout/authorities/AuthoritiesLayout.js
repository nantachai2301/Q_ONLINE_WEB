import React, { Fragment } from 'react';
import SideBar from '../../components/Authorities/SideBar';
import NavBar from '../../components/Authorities/NavBar';

import '../../style/author.css';

function AuthortitiesLayout(props) {
  return (
    <Fragment>
      <SideBar />
      <div className="main-author-layout">
        <NavBar />
        <div className="main-content-author-layout w-full p-4">{props.children}</div>
        
      </div>
    </Fragment>
  );
}

export default AuthortitiesLayout;
