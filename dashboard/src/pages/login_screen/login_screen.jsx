import React, { useState } from 'react';
import { Button, Form, Col, Container, Row } from 'react-bootstrap';
import style from './loginscreen.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username,setusername]=useState()
  const [password,setpassword]=useState()

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const logincall = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });
      if (response.data.success) {
        navigate('/dashboard')
      } else {
        console.log('Invalid username or password');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-content-center align-items-center ">
        <img src="" alt="" />
        <h1>Company Name</h1>
      </div>
      <div className={`d-flex justify-content-center align-items-center ${style.signup_bg}`}>
        <Container className={`${style.signup_container}`}>
          <Row className="p-3 h-100 bg-white rounded-4 d-flex justify-content-center align-items-center shadow-sm">
            <Col lg={6} className="px-4">
              <center>
                <h5 className={`${style.signupheading}`}>Admin Login</h5>
              </center>
              <div className="form-group py-1">
                <label>User Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control py-2 ${style.input_field}`}
                  placeholder="Enter your name"
                  onChange={(e) => {
                    setusername(e.target.value);
                  }}
                />
              </div>

              <div className="form-group py-1">
                <label>Password</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className={`form-control py-2  ${style.input_field}`}
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />
              </div>
              <div className="form-check py-1 mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onClick={togglePasswordVisibility}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Show Password
                </label>
              </div>
              <Button
                variant="primary"
                className="w-100 mb-1 mt-2"
                onClick={logincall}
              >
                Login In
              </Button>

              <a href="http://localhost:3000/auth/google">log with google</a>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoginScreen;
