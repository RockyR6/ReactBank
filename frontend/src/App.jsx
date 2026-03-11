import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { useEffect } from 'react'
import TransactionsPage from './pages/TransctionHistory'
import TransferMoney from './pages/TransferMoney'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LogoutPage from './pages/LogoutPage'
import LoadingComponent from './components/LoadingComponent'

const App = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <>
      <Routes>

        {/* Home route */}
        <Route
          path="/"
          element={
            user ? <HomePage /> : <Navigate to="/login" replace />
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/" replace /> : <SignUpPage />
          }
        />

        {/* Transaction History */}
        <Route
          path="/transactions/:accountId"
          element={
            user ? <TransactionsPage /> : <Navigate to="/login" replace />
          }
        />

        {/* Transfer */}
        <Route
          path="/transfer"
          element={
            user ? <TransferMoney /> : <Navigate to="/login" replace />
          }
        />
        {/* Logout */}
        <Route
          path="/logout"
          element={user ? <LogoutPage /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />

      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </>
  )
}

export default App