import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        // console.log(email, password)
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <section className="flex justify-center items-center">
            <div className="w-1/2 h-screen bg-slate-50 dark:bg-slate-800 flex flex-col justify-center items-center">
                <h1 className="text-3xl text-left font-bold text-slate-900 dark:text-slate-50">Log in</h1>
                <p className="text-left text-slate-500 dark:text-slate-400">Send, spend and save smarter</p>
                <div className="p-4 flex flex-row space-x-4 dark:text-slate-200">
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
                    <form onSubmit={handleSubmitForm} className="flex flex-col justify-center items-center">
                        <input type="text" placeholder="User@email.com" className="w-96 h-12 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-900 focus:outline-none focus:border-slate-300 dark:focus:border-slate-800" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" className="w-96 mt-4 h-12 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-900 focus:outline-none focus:border-slate-300 dark:focus:border-slate-800" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <div className="flex flex-row justify-between items-center w-96 mt-4">
                            <div className="flex flex-row items-center">
                                <input type="checkbox" className="mr-2" />
                                <p className="text-slate-500 dark:text-slate-400">Remember me</p>
                            </div>
                            <Link className="text-green-500 hover:underline dark:text-green-400">Forgot password?</Link>
                        </div>
                        <button className="w-96 mt-4 h-12 p-2 rounded-xl bg-green-500 text-slate-50 dark:text-slate-900">Log in</button>
                    </form>
                    <div className="flex flex-row justify-center items-center mt-4">
                        <p className="text-slate-500 dark:text-slate-400">Don't have an account?</p>
                        <Link to="/signup" className="text-green-500 hover:underline dark:text-green-400 ml-2">Sign up</Link>
                    </div>
                </div>
            </div>
            <div className="w-1/2 h-screen flex flex-col justify-center items-center relative bg-slate-200 dark:bg-slate-900">
                <img src="./signin.svg" alt="random" className="h-3/5" />
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Speed, Easy and Fast</h3>
                <img
                    src="./dotted.svg"
                    alt="random"
                    className="absolute bottom-8 left-8 "
                />
            </div>
        </section>
    );
}

export default Login;
