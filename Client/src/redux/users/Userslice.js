import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
}


export const Userslice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
         state.loading=true,
         state.error=null
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.error=null
        },
        signInFailure:(state,action)=>{
         state.loading=false,
         state.error=action.payload
        },
        updateStart:(state)=>{
        state.loading=true,
        state.error=null
        },

        updateSuccess:(state,action)=>{
            state.loading=false,
            state.currentUser=action.payload,
            state.error=null
        },

        updateFailure:(state,action)=>{
          state.loading=false,
          state.error=action.payload
        },

        userDeleteStart:(state)=>{
            state.loading=true,
            state.error=null
        },

        userDeleteSuccess:(state)=>{
            state.loading=false,
            state.currentUser=null,
            state.error=null
        },

        userDeleteFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload

        
        },

        signOutSuccess:(state)=>{
            state.currentUser=null,
            state.error=null,
            state.loading=false
        }


    }

    

})

export const {signInStart,signInSuccess,signInFailure,updateStart,updateFailure,updateSuccess,userDeleteStart,userDeleteSuccess,userDeleteFailure,signOutSuccess}=Userslice.actions

export default Userslice.reducer;