import { createSlice } from '@reduxjs/toolkit'

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

const initialState = {
  role: localStorage.getItem('role'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: getInitialUser(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, token } = action.payload
      state.role = user.role
      state.isAuthenticated = true
      state.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout(state) {
      state.role = null
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
