import React from 'react'
import { AiFillEye } from "react-icons/ai"
import { Link } from 'react-router-dom'

const FormCard = ({ _id, title, fields, createdAt }) => {

    const date = new Date(createdAt).toLocaleString('en-GB', {day:'numeric', month: 'long', year:'numeric'})

    return (
        <div className='flex items-center justify-between mx-20 my-5 p-5 shadow'>

            <div className='flex flex-col'>
                <span className='text-lg font-semibold'>{title}</span>
                <span className='text-sm'>Created On - {date}</span>
            </div>

            <div className='flex gap-x-3 items-center'>
                <span>{fields?.length ?? `No`} Questions</span>
                <Link 
                    to={`/form/fill/${_id}`}
                    target='_blank'
                    rel="noreferrer"
                    title='View' 
                    >
                    <AiFillEye size = {25}/>
                </Link>
            </div>

        </div>
    )
}

export default FormCard