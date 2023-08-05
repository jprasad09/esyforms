import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from "uuid"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Question from '../components/createForm/Question'
import axios from "../api/axios"

const CreateForm = () => {

  const { allQuestions, questionsValid, status } = useSelector(state => state.formBuilder)

  const [ formTitle, setFormTitle ] = useState('')
  const [ error, setError ] = useState(false)
  const [ questions, setQuestions ] = useState([{
      _id: uuidv4(),
      type: 'Categorize', // Default question type
    },
  ])

  const navigate = useNavigate()
  const questionsContainerRef = useRef(null)

  const addQuestionBelow = (index) => {
    const newQuestion = {
      _id: uuidv4(),
      type: 'Categorize', // Set the default type for the new question
    }

    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]
      updatedQuestions.splice(index + 1, 0, newQuestion)
      return updatedQuestions
    })
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions]
        updatedQuestions.splice(index, 1)
        return updatedQuestions
      })
    }
  }

  const handleCreateForm = async() => {

    if(!formTitle){
      setError(prevState => true)
      return
    }

    const allQuestionsComplete = Object.values(questionsValid).every(
      (status) => status === true
    )

    if(!allQuestionsComplete) return

    let fields = []
     questions.forEach((question) => {
      allQuestions.forEach((field) => {
        if(question._id === field.id) fields.push(field.updatedCategorizeField)
      })
    })

    const data = {
      title: formTitle,
      fields
    }

    try{
      const res = await axios.post(`/forms`, data)
      if(res.status === 201) {
        alert('Form created successfully')
        navigate('/')
      }
    }catch(error){
      alert('Error creating form')
    }

  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      <section className='flex flex-col items-center justify-center mx-2 my-7'>

        <div className='flex w-full flex-col gap-y-5 items-center border-gray-200 border-b-2'>
          <div className='w-1/2 flex flex-col gap-y-2'>
            <input 
              className='input-bottom' 
              type="text" 
              name="formTitle" 
              placeholder='Add form title here...(required)' 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />

            { error && <p className='text-pink-500'>Title is required</p> }

          </div>
          <div className='flex items-center gap-x-5 w-1/2 py-5'>
            <label>Header Image (optional)</label>
            <input type="file" name="formImg" className='input-file'/>
          </div>
        </div>

        <div className='w-full my-5' ref={questionsContainerRef}>

          {questions.map((question, index) => (
            <Question
              key={question._id}
              uniqueId={question._id}
              question={question}
              index={index}
              onAddQuestion={addQuestionBelow}
              onDeleteQuestion={deleteQuestion}
              disableDelete={questions.length === 1}
            />
          ))} 
                 
        </div>

        <div>
          <button 
            className='btn-primary'
            onClick={handleCreateForm}
            >
              Create Form
            </button>
        </div>

      </section>
    </>
  )
}

export default CreateForm