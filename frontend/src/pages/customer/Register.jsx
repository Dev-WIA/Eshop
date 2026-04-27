import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../../store/slices/usersApiSlice'
import { setCredentials } from '../../store/slices/authSlice'
import { UserPlus, Loader } from 'lucide-react'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [register, { isLoading }] = useRegisterMutation()

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
    if (password !== confirmPassword) {
      alert('Passwords do not match')
    } else {
      try {
        const res = await register({ name, email, password }).unwrap()
        dispatch(setCredentials({ ...res }))
        navigate(redirect)
      } catch (err) {
        alert(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 pb-20">
      <div className="glass p-10 rounded-3xl border border-white/10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-text-muted mt-2">Join our community and start shopping today.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
           <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted px-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <span>Create Account</span>
                    <UserPlus size={20} />
                </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="text-accent hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
