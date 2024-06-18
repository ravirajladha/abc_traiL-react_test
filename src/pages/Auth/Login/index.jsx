import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

import { authService } from '@/utils/services';
import { setAuthData } from '@/store/authSlice';
import { USERS } from '@/utils/constants';

import Logo from '@/assets/images/logo-transparent.png';

function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate() || loading) return;

    try {
      setLoading(true);

      const response = await authService.login({
        username: email,
        password: password,
      });

      if (response) {
        const { user, user_type: userType, access_token: userToken } = response;
        dispatch(
          setAuthData({
            isAuthenticated: true,
            user,
            userType,
            userToken,
          })
        );

        toast.success('Login Successful');

        setTimeout(() => {
          if (USERS[user.type] && USERS[user.type].value === user.type) {
            const dashboardPath = USERS[user.type].path || '/';
            navigate(dashboardPath);
          } else {
            toast.error('Invalid user type or no matching user found.');
          }
        }, 600);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!email || !password) {
      toast.warning('Please Verify Email/User ID or Password');
      return false;
    }
    return true;
  };

  return (
    <Fragment>
      <div className="main-wrap card  overflow-hidden vh-100">
        <ToastContainer autoClose={3000} closeOnClick />
        <div className="row justify-content-center align-items-center">
          <div
            className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
            style={{
              backgroundImage: `url(/assets/images/classroom1.jpg)`,
              backgroundColor: '#f2f2f2',
              transition: '0.5s ease-in-out',
            }}
          ></div>

          <div className="col-xl-7 vh-100 align-items-center d-flex rounded-lg overflow-hidden">
            <div className="card shadow-none border-0 ml-auto mr-auto login-card">
              <div className="card-body rounded-0 text-left">
                <img
                  src={Logo}
                  alt="logo"
                  className="inline-center flex center my-3"
                  width={100}
                />
                <br />
                <h2 className="fw-700 display1-size display2-md-size mb-3">
                  Login into <br />
                  your account
                </h2>
                <form onSubmit={handleLogin}>
                  <div className="form-group icon-input mb-3">
                    <i className="font-sm ti-email text-grey-500 pr-0"></i>
                    <input
                      type="text"
                      className="style2-input pl-5 form-control text-grey-900 font-xssss fw-600"
                      placeholder="Email Address/User ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group icon-input mb-1">
                    <input
                      type="Password"
                      className="style2-input pl-5 form-control text-grey-900 font-xssss ls-3"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i className="font-sm ti-lock text-grey-500 pr-0"></i>
                  </div>
                  <div className="col-sm-12 p-0 text-left mt-3">
                    <div className="form-group mb-1">
                      <button
                        type="submit"
                        className={`form-control btn text-center style2-input text-white fw-600 bg-dark border-0 p-0 ${
                          loading ? 'disabled' : ''
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                          />
                        ) : (
                          'Login'
                        )}
                      </button>
                      <h6 className="text-grey-500 font-xssss fw-500 mt-0 mb-0 lh-32">
                        Don&apos;t have account{' '}
                        <Link to="/register" className="fw-700 ml-1">
                          Register for Parents
                        </Link>
                      </h6>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
