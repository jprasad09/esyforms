import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from "uuid"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Oval } from 'react-loader-spinner'

import Navbar from '../components/Navbar'
import Question from '../components/createForm/Question'
import axios from "../api/axios"

const CreateForm = () => {

  const { allQuestions, questionsValid } = useSelector(state => state.formBuilder)

  const [formTitle, setFormTitle] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formImg, setFormImg] = useState('')
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [imgUrl, setImgUrl] = useState('')
  const [questions, setQuestions] = useState([{
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

  useEffect(() => {
    if (formTitle) {
      setError(prevState => false)
    } else {
      setError(prevState => true)
    }
  }, [formTitle])

  const handleImageUpload = async () => {

    if (formImg) {

      setUploadStatus(prevState => 'loading')

      const imgData = new FormData()

      imgData.append('file', formImg)
      imgData.append('upload_preset', import.meta.env.VITE_REACT_APP_CLOUD_UPLOAD_PRESET)
      imgData.append('cloud_name', import.meta.env.VITE_REACT_APP_CLOUD_NAME)

      try {
        const cloudData = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUD_NAME}/image/upload`, imgData)

        if (cloudData?.data?.url) {
          setImgUrl(prevState => cloudData?.data?.url)
          setUploadStatus(prevState => 'idle')
          toast.success("Image uploaded successfully")
        }

      } catch (error) {
        setUploadStatus(prevState => 'idle')
        toast.error("Image upload failed")
      }

    }

  }

  const handleCreateForm = async () => {

    if (!formTitle) {
      setError(prevState => true)
      return
    }

    const allQuestionsComplete = Object.values(questionsValid).every(
      (status) => status === true
    )

    if (!allQuestionsComplete) return

    let fields = []
    questions.forEach((question) => {
      allQuestions.forEach((field) => {
        if (question._id === field.id) fields.push(field.updatedField)
      })
    })

    const data = {
      title: formTitle,
      formImg: imgUrl,
      fields
    }

    try {

      setLoading(prevState => true)
      const res = await axios.post(`/forms`, data)
      if (res.status === 201) {
        setLoading(prevState => false)
        navigate('/')
        toast.success("Form created successfully")
      }
    } catch (error) {
      setLoading(prevState => false)
      toast.error("Error creating form")
    }

  }

  if (loading) {
    return <span className='flex items-center justify-center h-screen'>
      <Oval
        height={50}
        width={50}
        color='#8be6f0'
        secondaryColor="#b2f0f7"
      />
    </span>
  }

  return (
    <>

      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

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

            {error && <p className='text-red-500'>Title is required</p>}

          </div>
          <div className='flex items-center gap-x-5 w-1/2 py-5'>
            <input type="file" name="formImg" className='input-file'
              onChange={(e) => setFormImg(e.target.files[0])}
            />
            <button
              onClick={handleImageUpload}
              className='rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold px-3 py-1 transition duration-700'
            >
              {uploadStatus === 'loading' ? 'Uploading' : 'Upload'}
            </button>
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