import axios from 'axios'
// import jwt_decode from 'jwt-decode'
// import setAuthToken from '../utils/setAuthToken'
import { 
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'


//LOAD USER

//login funtion
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })

        
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/v1/users/login', {email, password}, config)
        const data = res.data
    
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })
        

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message

        })
    }
}


//signup function
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/v1/users/signup', userData, config)
        //const data = res.data

        
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })


    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message

        })
    }
}


export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST })

        const res = await axios.get('/api/v1/users/me')
         const data = res.data
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message

        })
    }

}



//UPDATE PROFILE
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        //JSON.stringify(userData)
        const { data } = await axios.patch('/api/v1/users/me/updateMe', userData, config)
       // const data = res.data

        
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })


    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message

        })
    }
}

//UPDATE Password
export const updatePassword = (password, passwordComfirm) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.patch('/api/v1/users/updateMyPassword', {password, passwordComfirm}, config)
        const data = res.data

        
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })


    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message

        })
    }
}

//FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/v1/users/forgotPassword', email, config)
        const data = res.data

        
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })


    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message

        })
    }
}

//FORGOT PASSWORD
export const resetPassword = (token, password) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.patch(`/api/v1/users/resetPassword/:${token}`, password, config)
        const data = res.data

        
        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        })


    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message

        })
    }
}

//LOGOUT
export const logout = () => async (dispatch) => {
    try {

        await axios.get('/api/v1/users/logout')
        
        dispatch({
            type: LOGOUT_SUCCESS
        })


    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message

        })
    }
}

// Get all users
export const allUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/api/v1/users/')
        //const data = res.data
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST })


        const { data } = await axios.get(`/api/v1/users/${id}`)
        //const data = res.data

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)
        //const data = res.data

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/users/${id}`)
        //const data = res.data
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () =>  (disptach) => {
    disptach({
        type: CLEAR_ERRORS
    })
}