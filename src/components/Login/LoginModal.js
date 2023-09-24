import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik, ErrorMessage } from "formik";

import Schema from "./Validation";

import Swal from "sweetalert2";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTHEN, USERINFO } from "../../actions/Authen";
import { Sendlogin } from "../../service/Authen.Service";
const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;
const LoginModal = (props) => {
  const [id_card, setIdCard] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); // เพิ่มตัวแปรเพื่อควบคุมสถานะการแสดง Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const handleLogin = async () => {
    setIsButtonClicked(true);
    if (password.length < 6 || id_card.length < 13) {
      // แจ้งเตือนให้กรอกข้อมูลครบถ้วน
      Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "warning");
      return;
    }

    try {
      const response = await Sendlogin(id_card, password);

      if (response.data && response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(response.data));
        const data = response.data.data;
        props.AUTHEN(
          data.id,
          data.id_card,
          data.first_name,
          data.last_name,
          data.role_id
        );
        props.USERINFO();
        setShow(false);

        Swal.fire({
          title: "เข้าสู่ระบบสำเร็จ",
          text: "ยินดีต้อนรับ!",
          icon: "success",
          showConfirmButton: true,
          timer: 2000,
        }).then(() => {
          setShow(false);
          window.location.href = "/";
        });
      } else {
        Swal.fire(
          "เข้าสู่ระบบไม่สำเร็จ",
          "รหัสผ่านหรือรหัสบัตรประชาชนไม่ถูกต้อง",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        Swal.fire(
          "เข้าสู่ระบบไม่สำเร็จ",
          "รหัสผ่านหรือรหัสบัตรประชาชนไม่ถูกต้อง",
          "error"
        );
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้", "error");
      }
    }
    props.setShow(false);
  };
  const handleForgetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };

  const handleResetPassword = () => {
    // Handle reset password logic here
    console.log("Reset password");
    setShowResetPasswordModal(false); // Close the reset password modal
  };
  const handlecloseLogin = () => {
    navigate("/");
  };
  return (
    <>
      <Modal show={props.show} onHide={() => props.setShow(false)} centered>
        <Modal.Header onClick={handlecloseLogin} closeButton>
          <Modal.Title style={{ width: "100%", textAlign: "center" }}>
            เข้าสู่ระบบ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            validationSchema={Schema}
            initialValues={{
              id_card:"",
              password:"",
            }}
            onSubmit={handleLogin}
          >
            {({  errors, touched }) => (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสประจำตัวประชาชน</Form.Label>
                  <Form.Control
                    id="LoginID_Card"
                    type="text"
                    name="id_card"
                    placeholder="Enter ID number"
                    value={id_card}
                    className={`form-control ${(!id_card && isButtonClicked) ? "is-invalid" : ""}`}
                    onChange={(e) => setIdCard(e.target.value)}
                  />
                  <ErrorMessage
                  
                    name="id_card"
                    component="div"
                    className="error-message"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <Form.Control
                    id="LoginPassword"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    className={`form-control ${(!password && isButtonClicked) ? "is-invalid" : ""}`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </Form.Group>
              
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <button
            id="Login"
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.Authentication,
});

const mapDispatchToProps = (dispatch) => {
  return {
    AUTHEN: (users_id, id_card, first_name, last_name, role_id) =>
      dispatch(AUTHEN(users_id, id_card, first_name, last_name, role_id)),
    USERINFO: () => dispatch(USERINFO()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
