import axios from 'axios';
import { AsyncStorage } from 'react-native';
import CONST from '../consts';

export const userLogin = ({phone, password}) => {
    return (dispatch) => {
        dispatch({type: 'user_login'});

        axios.post( CONST.url + 'login', {phone, password, device_id: Expo.Constants.deviceId})
            .then(response => handelLogin(dispatch, response.data))
            .catch(error => console.warn(error.data));
    };
};


const handelLogin = (dispatch, data) => {
    if (data.key === 0){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {
    AsyncStorage.multiSet([['user_id', JSON.stringify(data.id)], ['user', JSON.stringify(data)]])
        .then(() => dispatch({type: 'login_success', data}));

    dispatch({type: 'login_success', data});
};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
};