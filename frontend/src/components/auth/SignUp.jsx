import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function SignUp() {
    const [username,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [message,setMessage] = useState('')

    const handleSignUpForm = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,email,password })
        })
        const data = await response.json()
        setMessage(data.message)
        localStorage.setItem('token',data.token)
    }


    return (
        <section className="flex justify-center items-center">
            <div className="w-1/2 h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center">
                <h1 className="text-3xl text-left font-bold text-slate-900 dark:text-slate-50">Sign up for an account</h1>
                <p className="text-left text-slate-500 dark:text-slate-400">Send, spend and save smarter</p>
                <div className="p-4 flex flex-row space-x-4">
                    <button className=" h-12 p-2 rounded-xl outline outline-green-500  flex justify-center items-center">
                        <FcGoogle className="mr-2" />
                        Sign In with Google
                    </button>
                    <button className=" h-12 p-2 rounded-xl outline outline-green-500  flex justify-center items-center">
                        <FaApple className="mr-2" />
                        Sign In with Apple
                    </button>

                </div>

                <p className="text-slate-500 dark:text-slate-400 ">or continue with</p>
                <div className=" p-4  shadow-gray-300 rounded-xl">
                    <form onSubmit={handleSignUpForm} className="flex flex-col justify-center items-center">

                        <input type="text" placeholder="Username" className="w-96 h-12 p-2 rounded-xl  dark:border-slate-900 focus:border-none focus:outline-green-500 " value={username} onChange={(e) => setUserName(e.target.value)} />

                        <input type="text" placeholder="User@email.com" className="w-96 mt-4 h-12 p-2 rounded-xl  dark:border-slate-900 focus:border-none focus:outline-green-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                        <input type="password" placeholder="Password" className="mt-4 w-96 h-12 p-2 rounded-xl  dark:border-slate-900 focus:border-none focus:outline-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <input type="password" placeholder="Confirm Password" className="mt-4 w-96 h-12 p-2 rounded-xl  dark:border-slate-900 focus:border-none focus:outline-green-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <div className="flex flex-row justify-between items-center w-96 mt-4">
                            <div className="flex flex-row items-center">
                                <input type="checkbox" className="mr-2" />
                                <p className="text-slate-500 dark:text-slate-400">Remember me</p>
                            </div>
                        </div>
                        <button className="w-96 mt-4 h-12 p-2 rounded-xl bg-green-500 text-slate-50 dark:text-slate-900">Sign Up</button>
                    </form>
                    {message && <p className="text-gr-500">{message}</p>}
                    <div className="flex flex-row justify-center items-center mt-4">
                        <p className="text-slate-500 dark:text-slate-400">Already have an accound</p>
                        <Link to="/login" className="text-green-500 hover:underline dark:text-green-400 ml-2">Sign In</Link>
                    </div>
                </div>
            </div>
            <div className="w-1/2 h-screen flex flex-col justify-center items-center relative bg-slate-200 dark:bg-slate-900">
                <img src="./signup.svg" alt="random" className="h-3/5" />
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Speed, Easy and Fast</h3>
                <img src="./dotted.svg" alt="random"  className="absolute bottom-8 left-8 "/>
            </div>
        </section>
    )
}

export default SignUp
