import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { Button, Container, Box, } from "@mui/material";
import { styled } from "@mui/system";
import { Resetpassword } from "../../service/Authen.Service";
import { getPatient } from "../../service/Patient.Service";
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
function ResetpasswordModal(props) {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        const storedIsLoggedIn = storedUserData ? true : false;
        setIsLoggedIn(storedIsLoggedIn);
        if (storedIsLoggedIn) {
            const userDataFromLocalStorage = JSON.parse(storedUserData);
            setUserData(userDataFromLocalStorage);
            getPatient(userDataFromLocalStorage.data.id_card)
             .then((response) => {
 console.log("Response data:", response.data);

const matchedUser = response.data.find(
                        (user) => user.id_card === userDataFromLocalStorage.data.id_card);
                    if (matchedUser) {
                        const { users_id, prefix_name, first_name, last_name, id_card } =
                            matchedUser;
                        setUserData({
                            ...userData,
                            users_id: users_id,
                            id_card,
                            prefix_name,
                            first_name,
                            last_name,
                            id_card,
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);



    const handleResetPassword = async () => {
        try {
            const id_card = document.getElementById('id_card').value;
            const new_password = document.getElementById('new_password').value;
            if (!id_card) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกหมายเลขบัตรประชาชน',
                });
                return;
            }

            const response = await Resetpassword(id_card, new_password);
            const data = response.data;
            console.log(data)
            if (data.success) {

                console.log()
                Swal.fire({
                    icon: 'success',
                    title: 'รีเซ็ตรหัสผ่านสำเร็จ!',

                    showConfirmButton: true,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน',
                });
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error);
        }
    };

    return (

        <Modal show={props.show} onHide={() => props.setShow(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ width: "100%", textAlign: "center" }}>
                    เปลี่ยนรหัสผ่าน
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>
                    {isLoggedIn && userData && (
                        <div className="col-12">

                            <Form.Group className="mb-3">

                                <Form.Label>บัตรประชาชน</Form.Label>
                                <label className="red">*</label>
                                <Form.Control
                                    id="id_card"
                                    type="text"
                                    name="id_card"
                                    value={userData.id_card}
                                    className="form-control"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">

                                <Form.Label>รหัสผ่านใหม่</Form.Label>
                                <label className="red">*</label>
                                <Form.Control
                                    id="new_password"
                                    type="password"
                                    name="new_password"
                                    className="form-control"
                                />

                            </Form.Group>
                            <button
                                id="ResetPassword"
                                type="button"
                                className="btn btn-primary"
                                onClick={handleResetPassword} // เรียกใช้ handleResetPassword เมื่อคลิกปุ่ม "รีเซ็ตรหัสผ่าน"
                            >
                                เปลี่ยนรหัสผ่าน
                            </button>
                        </div>
                    )}

                </Form>

            </Modal.Body>
        </Modal>

    )
}

export default ResetpasswordModal