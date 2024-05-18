import { configureStore } from "@reduxjs/toolkit";
import Userslice from "./users/Userslice";

export const store=configureStore({
    reducer:{
        user:Userslice
    }
})