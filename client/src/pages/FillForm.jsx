import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'
import Navbar from '../components/Navbar'

const FillForm = () => {

    const [ form, setForm ] = useState({})

    const { id } = useParams()

    useEffect(() => {

        const fetchForm = async() => {
            try{
                const { data } = await axios.get(`forms/${id}`)
                setForm(prevState => data)
            }catch(error){
                console.log(err)
            }
        }

        fetchForm()
    })

    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className='my-10'>
                <p>{form.title}</p>
            </main>
        </>
    )
}

export default FillForm