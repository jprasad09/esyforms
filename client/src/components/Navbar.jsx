import { useNavigate } from 'react-router-dom'

import logo from '../assets/logo.jpg'

const Navbar = () => {

    const navigate = useNavigate()

    return (
        <nav className='flex items-center justify-center gap-x-3 m-3 py-2 shadow'>

            <img className='w-14' src={logo} alt="Logo" />

            <h1 onClick={() => navigate('/')} className='text-2xl font-semibold cursor-pointer'>esyForms</h1>
            
        </nav>
    )
}

export default Navbar