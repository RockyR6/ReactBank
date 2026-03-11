import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import accountReducer from "../features/accounts/account.slice"
import transactionReducer from "../features/transction/transctionSlice"



export const store = configureStore({
  reducer: {
    user: userReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
  },
})