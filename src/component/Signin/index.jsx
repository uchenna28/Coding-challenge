/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Spin } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';



import './signin.css';
// import { login } from '../../../redux/actions';

/**
 * @author
 * @function Signin
 * */

const Signin = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
//   const loading = useSelector((state) => state.auth.loading);
//   const antIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;
//   const [togglePassword, setTogglePassword] = React.useState(false);
  // const [error, setError] = useState("");
  // const [checked, setChecked] = useState(true);
//   const authenticate = useSelector((state) => state.auth.authenticate);

//   const dispatch = useDispatch();
  const userLogin = (e) => {
    
    e.preventDefault();

    const user = {
      password,
      email,
    };

    // dispatch(login(user));
    // console.log(authenticate);
  };

//   if (authenticate) {
//     return <Redirect to="/dashboard" />;
//   }
  return (
    <div className="container">
      <div className="row my-2">
        <div className="col-md-6 col-sm-12">
          <form onSubmit={userLogin}>
            <div className="row">
              <div className="col-md-11 mx-auto my-5 border rounded h-100 userSignin p-4">
                <div className="col-12 mb-2 d-flex justify-content-center">
                  <p className="createText">Login to keep your account secured</p>
                </div>
                <div className="col-12 my-2">
                  <p>Enter Your Email to get started</p>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label bold"
                  >
                    Password
                  </label>
                  <input
                    className="form-control createText"
                    id="exampleFormControlInput1"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-12 d-flex justify-content-center">
                  <button type="submit" className="signinBtn d-flex">
                      Login
                    {/* {loading ? (<Spin indicator={antIcon} />) : 'Login' } */}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
