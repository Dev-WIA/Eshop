import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../../store/slices/usersApiSlice'
import { setCredentials } from '../../store/slices/authSlice'
import { LogIn, Loader } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate(redirect)
    } catch (err) {
      alert(err?.data?.message || err.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="glass p-10 rounded-3xl border border-white/10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-text-muted mt-2">Sign in to your account to continue shopping.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-accent text-primary-bg font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader className="animate-spin" size={20} /> : (
                <>
                    <span>Sign In</span>
                    <LogIn size={20} />
                </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to={`/register?redirect=${redirect}`} className="text-accent hover:underline font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
