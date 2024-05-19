import { configureStore, } from "@reduxjs/toolkit";
import Userslice from "./users/Userslice";
import storage from 'redux-persist/lib/storage'
import {persistReducer,} from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";




const persistConfig={
key:"root",
version:1,
storage
}

const reducer=combineReducers({
  user:Userslice
})


const persistedReducer=persistReducer(persistConfig,reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
 
  
  
});
