import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import axios from '../api/axios'
import logo from '../assets/logo.jpg'
import CategorizeRenderer from '../components/fillForm/CategorizeRenderer'
import ClozeRenderer from '../components/fillForm/ClozeRenderer'
import ComprehensionRenderer from '../components/fillForm/ComprehensionRenderer'

const FillForm = () => {

    const [ form, setForm ] = useState({})
    const [ formError, setFormError ] = useState(false)

    const [ emailError, setEmailError ] = useState(false)

    const [categorizeCompletionStatus, setCategorizeCompletionStatus] = useState({})
    const [clozeCompletionStatus, setClozeCompletionStatus] = useState({})
    const [comprehensionCompletionStatus, setComprehensionCompletionStatus] = useState({})

    const { id } = useParams()
    const [ response, setResponse ] = useState({
        form : id,
        email: '',
        categorizeAnswers: [],
        clozeAnswers: [],
        comprehensionAnswers: [],
    })

    const navigate = useNavigate()

    const answerStatus = (type, fieldId, status) => {
        if(type === "Category"){
            setCategorizeCompletionStatus((prevState) => ({
                ...prevState,
                [fieldId]: status,
            }))
        }else if(type === "Cloze"){
            setClozeCompletionStatus((prevState) => ({
                ...prevState,
                [fieldId]: status,
            }))
        }else if(type === "Comprehension"){
            setComprehensionCompletionStatus((prevState) => ({
                ...prevState,
                [fieldId]: status,
            }))
        }
    }

    const setAnswers = (type, data) => {
        setResponse((prevState) => {
            return {
                ...prevState,
                [type]: [...prevState[type], data],
            }
        })
    }    

    const handleFormSubmit = async() => {

        if(!response.email){
            setEmailError(true)
        }

        const allCategorizeComplete = Object.values(categorizeCompletionStatus).every(
            (status) => status === true
        )

        const allClozeComplete = Object.values(clozeCompletionStatus).every(
            (status) => status === true
        )

        const allComprehensionComplete = Object.values(comprehensionCompletionStatus).every(
            (status) => status === true
        )


        if(response.email && allCategorizeComplete && allClozeComplete && allComprehensionComplete){
            
            try{
                const res = await axios.post(`responses`, response)
                if(res.status === 201){
                    alert('Response submitted successfully')
                    navigate('/')
                }
            }catch(error){
                alert('This email id has submitted response already')
            }

        }
    }

    useEffect(() => {
        
        const fetchForm = async() => {
            try{
                const { data } = await axios.get(`forms/${id}`)
                setForm(prevState => data)
            }catch(error){
                setFormError(prevState => true)
            }
        }
        
        fetchForm()
    }, [])

    if(formError) return <h2 className='text-center font-bold text-rose-900 my-5'>Error Fetching Form...</h2>
    
    const { title, formImg, formDescription, fields } = form

    return (
        <section>

            <main className='flex items-center shadow-lg mx-20 my-10 px-10 py-2 gap-x-10'>
                {
                    formImg && 
                    <img className='w-20' src={formImg} alt="Form Image" /> || 
                    <img className='w-20' src={logo} alt="Form Image" />
                }

                <div className='flex flex-col gap-y-1 items-start justify-center'>
                    <p className='text-2xl font-semibold'>{ title ?? 'Form' }</p>
                    {
                        formDescription && <p className='text-sm'>{formDescription}</p>
                    }
                </div>

            </main>

            <div className='flex flex-col gap-y-10 mx-20 my-10 p-10 shadow-md'>
                {
                    fields && fields.length > 0 ? 
                    fields.map((field, index) => {
                        let questionNumber = index + 1
                        if(field.type === 'categorize') return <CategorizeRenderer key={field._id} {...field} questionNumber={questionNumber} setAnswers={setAnswers} answerStatus={answerStatus} />
                        else if(field.type === 'cloze') return <ClozeRenderer key={field._id} {...field} questionNumber={questionNumber} setAnswers={setAnswers} answerStatus={answerStatus} />
                        else if(field.type === 'comprehension') return <ComprehensionRenderer key={field._id} questionNumber={questionNumber} {...field} setAnswers={setAnswers} answerStatus={answerStatus} />
                        else return <p>Invalid question type</p>
                    }) :
                    <p>No questions found!</p>
                }
            </div>

            <div className='flex flex-col shadow-lg mx-20 my-10 px-10 py-5 gap-y-2'>
                <label htmlFor="email">Enter your email</label>
                <input 
                    className='text-md border-gray-200 border-solid border-2 rounded-md px-2' 
                    type="email" 
                    name="email"
                    value={response.email}
                    onChange={(e) => {
                        if (e.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
                            setEmailError(prevState => false)
                          }else{
                            setEmailError(prevState => true)
                        }
                        setResponse((prevState) => {
                            return {
                                ...prevState,
                                email: e.target.value
                            }
                        })
                    }}
                />
                {
                    emailError && <p className='text-red-500'>Invaild email...</p>
                }
            </div>

            <div className='flex flex-col items-center justify-center mx-2 my-10'>
                <button 
                    onClick={handleFormSubmit} 
                    className={`btn-primary`}
                >Submit</button>
            </div>

        </section>
    )
}

export default FillForm