import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Oval } from 'react-loader-spinner'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from '../components/Navbar'
import { fetchForms } from '../store/formSlice'
import FormCard from '../components/formListing/FormCard'
import { FORM_STATUSES } from '../store/formSlice'

const FormListing = () => {

    const { forms, status } = useSelector(state => state.form)

    const navigate = useNavigate()
    const disptach = useDispatch()

    useEffect(() => {
        disptach(fetchForms())
    }, [])

    return (
        <>

            <ToastContainer
                position="top-center"
                autoClose={2000}
            />


            <header>
                <Navbar />
            </header>

            {
                <>
                    <section className='flex items-center justify-center my-10'>
                        <button onClick={() => navigate('form/create')}
                            className='btn-primary'>
                            Create Form
                        </button>
                    </section>

                    {
                        status === FORM_STATUSES.LOADING ?

                            <span className='flex items-center justify-center mt-20'>
                                <Oval
                                    height={50}
                                    width={50}
                                    color='#8be6f0'
                                    secondaryColor="#b2f0f7"
                                />
                            </span>
                            :
                            <main>
                                {
                                    forms ?
                                        forms?.map((form) => {
                                            return <FormCard key={form._id} {...form} />
                                        })
                                        :
                                        <p className='flex items-center justify-center my-10'>No forms to show</p>
                                }
                            </main>

                    }

                </>
            }

        </>
    )
}

export default FormListing