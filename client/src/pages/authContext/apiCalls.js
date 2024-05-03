import axios from 'axios'
import { loginFailure, loginSuccess, loginStart } from './AuthActions'

export const login = async(user, dispatch) => {
    dispatch(loginStart());
    try {
        console.log(user);
        const res = await axios.post(`${proccess.env.REACT_APP_URL}/api/auth/login`, user);
        
        dispatch(loginSuccess(res.data));
        console.log(res.data);
    } catch(err) {
        dispatch(loginFailure());
    }
}
