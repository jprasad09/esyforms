import { createSlice } from "@reduxjs/toolkit"

const formBuilderSlice = createSlice({
    name: 'formBuilder',

    initialState: {
        allQuestions: [],
        questionsValid: {},
    },

    reducers: {
        addQuestion: (state, action) => {
            const updatedQuestion = action.payload
            const existingIndex = state.allQuestions.findIndex((question) => question.id === updatedQuestion.id)

            if(existingIndex !== -1){
                state.allQuestions[existingIndex] = updatedQuestion
            }else{
                state.allQuestions = [...state.allQuestions, updatedQuestion]
            }
        },
        setQuestionsValidity: (state, action) => {
            state.questionsValid = {
                ...state.questionsValid,
                [action.payload.id] : action.payload.status
            }
        },
    },
})

export const { addQuestion, setQuestionsValidity } = formBuilderSlice.actions
export default formBuilderSlice.reducer