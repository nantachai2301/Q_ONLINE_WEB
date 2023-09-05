import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from './Menu';
import { checkActive } from '../../helper/Check';

function SideBarAdmin() {
  const ref = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState('');
  const [overMenu, setOverMenu] = useState('');

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (key && ref.current && !ref.current.contains(e.target)) {
        setKey('');
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [key, setKey]);

  return (
    <div className="d-flex" ref={ref}>
      <div className="sidebar-nav1">
        <div className="py-3">
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-bars-staggered text-white fs-4"></i>
              <h4 className="text-white px-2">Menu</h4>
            </div>
          </div>
          <div className="w-full text-white mt-3">
            {Menu.map((item, index) => (
              <Fragment key={item.id}>
                <div className={`d-flex align-items-center justify-content-between py-1`}>
                  <div className={`content-menu-side h-menu1 ${checkActive(location, item.pathname) ? 'content-menu-side-active1' : ''}`}>
                    <div
                      ref={ref}
                      className="d-flex align-items-center justify-content-center w-full h-menu cursor-pointer1"
                      onClick={() => {
                        navigate(item.pathname);
                        overMenu === item.id ? setOverMenu('') : setOverMenu(item.id);
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="w-full d-flex flex-wrap">
                          <div className="text-center w-full">
                            <div className="d-flex justify-content-center">
                              <i className={`${item.icon} fs-3 font-bold`}></i>
                            </div>
                            <div className="w-full mt-1 text-center">
                              {item.title} {item.type === 2 ? <i className="fas fa-angle-right"></i> : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`h-14 w-1 ${checkActive(location, item.pathname) ? 'h-14 w-1 menu-side-active1' : ''}`}></div>
                </div>

                {item.type === 2
                  ? overMenu === item.id && (
                      <div className="sub-menu-box1" ref={ref}>
                        {item.subMenu.map((sub, inx) => (
                          <div
                            key={inx}
                            className={`d-flex justify-content-start align-items-center w-full cursor-pointer1 ${checkActive(location, sub.pathname) ? 'active-sub-menu1' : 'text-black'} `}
                            onClick={() => {
                              navigate(sub.pathname);
                              setOverMenu('');
                            }}
                          >
                            <div className="w-full py-1" style={{ whiteSpace: 'nowrap' }}>
                              {sub.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBarAdmin;
