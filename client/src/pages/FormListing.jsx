import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Navbar from '../components/Navbar'
import { fetchForms } from '../store/formSlice'
import FormCard from '../components/formListing/FormCard'

const FormListing = () => {

    const {forms, status} = useSelector(state => state.form)

    const navigate = useNavigate()
    const disptach = useDispatch()

    useEffect(() => {
        disptach(fetchForms())
    }, [])

    return (
        <>
            <header>
                <Navbar />
            </header>

            <section className='flex items-center justify-center my-10'>
                <button onClick={() => navigate('form/create')} 
                    className='rounded-lg bg-cyan-100 hover:bg-cyan-200 text-lg font-semibold px-5 py-1 transition duration-700'>
                    Create Form
                </button>
            </section>

            <main>
                {
                    forms.map((form) => {
                        return <FormCard  key={form._id} {...form}/>
                    })
                }
            </main>
        </>
    )
}

export default FormListing