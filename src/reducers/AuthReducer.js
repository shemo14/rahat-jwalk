const INITIAL_STATE = {user: null, loading: false, message: ''};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case ('login_user') :
            return ({...state, loading: true});
        case ('login_failed') :
            return ({...state, loading: false, message: action.error});
        case ('login_success') :
            return ({...state, loading: false, user: action.data, message: action.message});
        default :
            return state;
    }
}