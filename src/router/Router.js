import React, { Fragment } from "react";
import { connect } from "react-redux";
import { AUTHEN, USERINFO, AUTHORITIES } from "../actions/Authen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/public/PublicLayout";
import PrivateLayout from '../layout/private/PrivateLayout'
import Redirect from "../view/error/Redirect";
import AuthoritiesLayout from "../layout/authorities/AuthoritiesLayout";

//private

import MainDoctor from "../view/private/setting/doctor/MainDoctor";
import FormDoctor from "../view/private/setting/doctor/form/FormDoctor";
import MainOpenSchedule from "../view/private/openSchedule/MainOpenSchedule";
import FormOpenSchedule from "../view/private/openSchedule/form/FormOpenSchedule";
import MainUser from "../../src/view/private/setting/user/MainUser";
import FormCreateUser from "../view/private/setting/user/form/FormCreateUser";
import MainHospital from "../view/private/openSchedule/form/DataHospital/MainHospital";
import FormHospital from "../view/private/openSchedule/form/DataHospital/FormHospital";
import MainAuthorities from "../view/private/setting/authorities/MainAuthorities";
import FormAuthorities from "../view/private/setting/authorities/form/FormAuthorities";
import EditAuthorities from "../view/private/setting/authorities/form/EditAuthorities"
import HomePrivate from "../layout/private/HomePrivate";
import FormCreateDoctor from "../view/private/setting/doctor/form/FormCreateDoctor";
import FormUpdateUser from "../view/private/setting/user/form/FormUpdateUser";
import MainDepartmentType from "../view/private/setting/departmentType/MainDepartmentType";
import FormDepartment from "../view/private/setting/departmentType/form/FormDepartment";
import EditDepartment from "../view/private/setting/departmentType/form/EditDepartment";

// public
import Register from "../components/Register/Register";
import MainBook from "../view/public/book/MainBook";
import EditProfile from "../view/public/Profile/EditProfile";
import Queue from "../view/public/queue/Queue";
import TableBooking from "../view/public/history/TableBooking";
import Home from "../layout/public/Home";
import CheckQueue from "../view/public/queue/CheckQueue";
import Questionaire from "../view/public/questionnaire/Questionnaire";
import Calendars from "../view/public/Calendars"; 
import ShowDepartmentAll from "../view/public/Department/ShowDepartmentAll";
import Dental from "../view/public/Department/DetailDepartment/dental/Dental";
import LoginModal from "../components/Login/LoginModal";
import Profile from "../view/public/Profile/Profile"
import DepartmentQueue from "../view/public/AllQueue/DepartmentQueue";
import DesktopQueue from  "../view/public/DesktopQueue/DesktopQueue";
import Newsdentalservice from "../view/public/News/Newsdentalservice";
import Newsfluvaccine from "../view/public/News/Newsfluvaccine";
import NewsModernaBivalent from "../view/public/News/NewsModernaBivalent";
import Newsfood from "../view/public/News/Newsfood";

//Authorities
import MainBookAuthor from "../view/authorities/book/MainBookAuthor";
import MainHistoryAuthor from "../view/authorities/history/MainHistoryAuthor";
import ManageBook from '../view/authorities/Main/ManageBook'
import ViewQuestion from "../view/authorities/view_questionnaire/ViewQuestion";
import HomeAuthorities from "../layout/authorities/HomeAuthorities";
import OpenQueue from "../view/authorities/open-queue/OpenSchedule";
import BookingWalkin from "../view/authorities/Walkin/BookingWalkin";






function Router(props) {
  const role = props.auth.role_id ? parseInt(props.auth.role_id) :  1; // 3 = admin, 1= user, 2= authorities

  return (
    <Fragment>
      <BrowserRouter>
        {role === 1 ? (
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/book-an-appointment/:users_id" element={<MainBook/>} />  
              <Route path="/DesktopQueue" element={<DesktopQueue/>} />  
              <Route path="/history/:users_id" element={<TableBooking/>}/>
              <Route path="/register" element={<Register />} />
              <Route path="/calendar" element={<Calendars/>} />
              <Route path="/edit-profile/:users_id" element={<EditProfile />} />
              <Route path="/AllQueue" element={<DepartmentQueue/>} />
              <Route path="/check-queue" element={<CheckQueue />} />
              <Route path="/Q_user" element={<Queue />} />
              <Route path="/questionnaire" element={<Questionaire/>} />
              <Route path="/Newsdentalservice" element={<Newsdentalservice/>} />
              <Route path="/Newsfluvaccine" element={<Newsfluvaccine/>} />
              <Route path="/NewsModernaBivalent" element={<NewsModernaBivalent/>} />
              <Route path="/Newsfood" element={<Newsfood/>} />
          
              
             
              <Route path="/showdepartmentAll" element={<ShowDepartmentAll/>} />
             
              <Route path="/detaildental" element={<Dental/>} />
              <Route path="/detaildental/:DId" element={<Dental/>} /> 
              <Route path="/login" element={<LoginModal/>} /> 
              <Route path="/Profile" element={<Profile/>} /> 

              <Route path="*" element={<Redirect />} />
              
            </Routes>
          </PublicLayout>



        ) : role === 3 ? (
          <PrivateLayout>
            <Routes>
              <Route path="/" element={<HomePrivate/>} />
              <Route path="/admin/data-hospital" element={<MainHospital />}/>
              <Route path="/admin/hospital/form" element={<FormHospital />}/>
              <Route path="/admin/hospital/form/:FId" element={<FormHospital />}/>
              <Route path="/admin/open-schedule"element={<MainOpenSchedule />}/>
              <Route path="/admin/open-schedule/form" element={<FormOpenSchedule />}/>
              
              <Route path="/admin/doctor" element={<MainDoctor />} />
              <Route path="/admin/doctor/form/:doctors_id" element={<FormDoctor />} />
              <Route path="/admin/user" element={<MainUser />} />
              <Route path="/admin/user/create/form" element={<FormCreateUser/>} />
              <Route path="/admin/authorities" element={<MainAuthorities />} />
              <Route path="/admin/form-authorities" element={<FormAuthorities />} />
              <Route path="/admin/edit-authorities/:users_id" element={<EditAuthorities />} />
              
              <Route path="/admin/form-authorities" element={<FormAuthorities/>} />
              <Route path="/admin/doctor/create/form/" element={<FormCreateDoctor />} />
              <Route path="/admin/user/form/:users_id" element={<FormUpdateUser />} />
              <Route path="/admin/department-type"element={<MainDepartmentType />}/>
              <Route path="/admin/department/form/" element={<FormDepartment />} />
              <Route path="/admin/edit-department/form/:department_id" element={<EditDepartment />} />

              <Route path="*" element={<Redirect />} />
            </Routes>
          </PrivateLayout>



        ) : (
          <AuthoritiesLayout>
            <Routes>
            <Route path="/author/book-an-appointment"element={<MainBookAuthor/>}/>
            <Route path="/" element={<HomeAuthorities/>} />
            <Route path="/author/Home_authorities" element={<HomeAuthorities/>} />
              <Route path="/author/history"element={<MainHistoryAuthor />}/>
              <Route path="/view/Question" element={<ViewQuestion />} />
              <Route path="/author/Manage" element={<ManageBook />} />
              {/* <Route path="/author/Main/View" element={<ViewAssessment/>} /> */}
              <Route path="/author/Bookingwalkin" element={<BookingWalkin/>}/> 
              
      
              <Route path="/author/open-queue" element={<OpenQueue/>} />
            </Routes>
          </AuthoritiesLayout>



        )}
      </BrowserRouter>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  auth: state.Authentication,
});

const mapDispatchToProps = (dispatch) => {
  return {
    AUTHEN: (users_id, id_card, first_name,last_name, role_id) =>
      dispatch(AUTHEN(users_id, id_card, first_name,last_name, role_id)),
    USERINFO: () => dispatch(USERINFO()),
    AUTHORITIES: (users_id, id_card, first_name,last_name, role_id) =>
      dispatch(AUTHORITIES(users_id, id_card, first_name,last_name, role_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
