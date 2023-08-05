import { configureStore } from '@reduxjs/toolkit'

import formReducer from './formSlice'
import formBuilderReducer from './formBuilderSlice'

const store = configureStore({
    reducer: {
        form: formReducer,
        formBuilder: formBuilderReducer
    },
})

export default store