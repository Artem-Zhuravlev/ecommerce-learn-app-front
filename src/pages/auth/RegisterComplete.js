import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateUser } from '../../utils/auth';

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForRegistration'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email & password is required');
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
    }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href);

      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
              dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id
                }
              })
            }
          )
          .catch(err => console.log(err))
        navigate('/');
      }
    } catch(err) {
      toast.error(err.message);
    }
  }

  const completeRegistrationForm = () => (
    <form onSubmit={ handleSubmit }>
      <input
        type="email"
        className="form-control"
        value={email}
        disabled
      />

      <input
        type="password"
        className="form-control mt-4"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
      />
      <button
        type="submit"
        className="mt-4 btn btn-raised"
      >
        Complete Registration
      </button>
    </form>
  )

  return (
    <div className='container pt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register Complete</h4>
          { completeRegistrationForm () }
        </div>
      </div>
    </div>
  )
}

export default RegisterComplete;
