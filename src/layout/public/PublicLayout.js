import React, { Fragment } from 'react';
import NavBar from '../../components/Public/NavBar';
import FetchFooterData from '../public/FetchFooterData'
import '../../style/public.css';

function PublicLayout(props) {
  return (
    <Fragment>
      <NavBar/>
      <div className="main-public-layout p-4">{props.children}</div>
      <FetchFooterData/>
    </Fragment>
  );
}

export default PublicLayout;
