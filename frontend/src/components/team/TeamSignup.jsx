import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice'
import api from '../../services/api'
import AnimatedBackground from '../ui/AnimatedBackground'
import { FiShield, FiUser, FiMapPin, FiLock, FiCheck, FiArrowLeft, FiAlertCircle, FiBriefcase } from 'react-icons/fi'

export default function TeamSignup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uniqueId, setUniqueId] = useState('')
  const [batchData, setBatchData] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    batchId: '',
    password: '',
    confirmPassword: '',
    infoVerified: false,
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    if (field === 'batchId') setBatchData(null)
  }

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all personal details')
      return false
    }
    return true
  }

  const verifyBatchId = async () => {
    if (!formData.batchId) {
      setError('Please enter a Batch ID')
      return false
    }
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/team/verify-batch', { batchId: formData.batchId })
      setBatchData(response.data)
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Batch ID.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const validateStep2 = async () => {
    if (!batchData) {
      return await verifyBatchId()
    }
    if (!formData.infoVerified) {
      setError('You must verify that the information is correct')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleNext = async () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && await validateStep2()) setStep(3)
    else if (step === 3 && validateStep3()) handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else navigate('/team/login')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/team/signup', formData)
      setUniqueId(response.data.uniqueId)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    navigate('/team/login')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center max-w-md w-full p-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6 glow-green">
              <FiCheck className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
            <p className="text-dark-400 mb-6">Your emergency team account has been created.</p>
            
            <div className="bg-dark-800/50 rounded-xl p-6 mb-6 border border-primary-500/30">
              <p className="text-sm text-dark-300 mb-2">Your Unique Login ID</p>
              <p className="text-3xl font-mono font-bold text-primary-400 tracking-wider glow-blue">{uniqueId}</p>
              <p className="text-xs text-red-400 mt-3 flex items-center justify-center gap-1">
                <FiAlertCircle /> You MUST use this ID to login
              </p>
            </div>
            
            <button onClick={handleFinish} className="btn-primary w-full">
              Proceed to Login
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, label: 'Personal' },
    { number: 2, label: 'Verification' },
    { number: 3, label: 'Security' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 glow-blue">
              <FiShield className="text-blue-400 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Join Emergency Response</h2>
            <p className="text-dark-400 text-sm mt-1">Create your official team account</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s.number 
                    ? 'bg-primary-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                    : 'bg-dark-800 text-dark-500'
                }`}>
                  {s.number}
                </div>
                <span className={`text-xs ml-2 ${step >= s.number ? 'text-white' : 'text-dark-500'}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.number ? 'bg-primary-500' : 'bg-dark-800'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="glass-card p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Officer Name"
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Email Address</label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="name@department.gov"
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91-XXXXX-XXXXX"
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Batch Verification</h3>
                  
                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Enter Batch ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.batchId}
                        onChange={(e) => handleChange('batchId', e.target.value.toUpperCase())}
                        placeholder="e.g. BATCH-FIRE-001"
                        className="input-dark flex-1 font-mono"
                      />
                      <button
                        onClick={verifyBatchId}
                        disabled={loading || !formData.batchId}
                        className="btn-ghost px-4"
                      >
                        {loading && !batchData ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Fetch'}
                      </button>
                    </div>
                  </div>

                  {batchData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-primary-900/20 border border-primary-500/30 rounded-xl p-4 mt-4"
                    >
                      <h4 className="text-sm font-medium text-primary-400 mb-3 flex items-center gap-2">
                        <FiCheck /> Official Record Found
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] text-dark-500 uppercase tracking-wider">Department</p>
                          <p className="text-sm font-medium text-white">{batchData.department}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-dark-500 uppercase tracking-wider">Rank</p>
                          <p className="text-sm font-medium text-white">{batchData.rank}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-dark-500 uppercase tracking-wider">Station</p>
                          <p className="text-sm font-medium text-white">{batchData.station}</p>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer group mt-4 pt-4 border-t border-white/10">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData.infoVerified}
                            onChange={(e) => handleChange('infoVerified', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.infoVerified 
                              ? 'bg-primary-500 border-primary-500' 
                              : 'bg-dark-800 border-dark-600 group-hover:border-primary-500'
                          }`}>
                            {formData.infoVerified && <FiCheck className="text-white text-xs" />}
                          </div>
                        </div>
                        <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                          I verify that the department and rank information shown above is correct and matches my official assignment.
                        </span>
                      </label>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Security Setup</h3>

                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Create Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="Min 6 characters"
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dark-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="bg-dark-800/30 rounded-lg p-3 text-xs text-dark-400">
                    <p>By registering, you confirm that you are an authorized member of the emergency response services. You will receive a unique ID upon completion.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg p-3 border border-red-500/20 mt-4"
              >
                <FiAlertCircle />
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleBack}
                className="btn-ghost flex-1 flex items-center justify-center gap-2"
              >
                <FiArrowLeft size={16} />
                {step === 1 ? 'Login' : 'Back'}
              </button>
              <button
                onClick={handleNext}
                disabled={loading || (step === 2 && !formData.infoVerified)}
                className="btn-primary flex-[2] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && step === 3 ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Complete Registration' : 'Continue'}
                    <FiCheck size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {step === 1 && (
            <p className="text-center text-dark-400 text-sm mt-4">
              Already have an account?{' '}
              <button onClick={() => navigate('/team/login')} className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in here
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
