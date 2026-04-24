import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addIncident } from '../../store/incidentsSlice'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { INCIDENT_TYPES, simulateAIAnalysis, generateIncidentId } from '../../services/mockData'
import AIAssistPanel from './AIAssistPanel'
import LocationModule from './LocationModule'
import SubmissionSuccess from './SubmissionSuccess'
import { FiUpload, FiX, FiImage, FiSend, FiArrowLeft, FiPhone } from 'react-icons/fi'

export default function IncidentReport() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [step, setStep] = useState(0) // 0: form, 1: success
  const [submittedIncident, setSubmittedIncident] = useState(null)

  const [formData, setFormData] = useState({
    type: '',
    description: '',
    contactNumber: '',
    imageFile: null,
    imagePreview: null,
    location: null,
  })
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }))
        // Simulate AI analysis
        setAiLoading(true)
        setTimeout(() => {
          const detectedType = INCIDENT_TYPES[Math.floor(Math.random() * 5)]
          simulateAIAnalysis(detectedType).then(analysis => {
            setAiAnalysis(analysis)
            setAiLoading(false)
            setFormData(prev => ({ ...prev, type: detectedType }))
          })
        }, 800)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }))
    setAiAnalysis(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }))
        setAiLoading(true)
        setTimeout(() => {
          const detectedType = INCIDENT_TYPES[Math.floor(Math.random() * 5)]
          simulateAIAnalysis(detectedType).then(analysis => {
            setAiAnalysis(analysis)
            setAiLoading(false)
            setFormData(prev => ({ ...prev, type: detectedType }))
          })
        }, 800)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }))
  }

  const handleSubmit = async () => {
    if (!formData.type || !formData.location) return

    setSubmitting(true)
    try {
      const response = await api.post('/incidents/report', {
        type: formData.type,
        severity: aiAnalysis?.severity || 'medium',
        description: formData.description || `${formData.type} incident reported by citizen`,
        location: formData.location,
        contactNumber: formData.contactNumber,
        imageUrl: formData.imagePreview,
        aiAnalysis: aiAnalysis || { type: formData.type, severity: 'medium', confidence: 70 },
      })

      dispatch(addIncident(response.data))
      setSubmittedIncident(response.data)
      setStep(1)
    } catch (err) {
      console.error('Submission failed:', err)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 1 && submittedIncident) {
    return <SubmissionSuccess incident={submittedIncident} />
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Report Emergency</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Call System */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            <a href="tel:100" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 group-hover:glow-blue transition-all">
                <FiPhone className="text-blue-400" />
              </div>
              <span className="font-bold text-white text-sm">Police</span>
              <span className="text-blue-400 font-mono text-xs mt-1 bg-blue-500/10 px-2 py-0.5 rounded">100</span>
            </a>
            <a href="tel:101" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:bg-red-500/10 hover:border-red-500/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-2 group-hover:glow-red transition-all">
                <FiPhone className="text-red-400" />
              </div>
              <span className="font-bold text-white text-sm">Fire Brigade</span>
              <span className="text-red-400 font-mono text-xs mt-1 bg-red-500/10 px-2 py-0.5 rounded">101</span>
            </a>
            <a href="tel:102" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:bg-green-500/10 hover:border-green-500/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2 group-hover:glow-green transition-all">
                <FiPhone className="text-green-400" />
              </div>
              <span className="font-bold text-white text-sm">Ambulance</span>
              <span className="text-green-400 font-mono text-xs mt-1 bg-green-500/10 px-2 py-0.5 rounded">102</span>
            </a>
            <a href="tel:108" className="glass-card p-4 flex flex-col items-center justify-center text-center hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] border border-orange-500/20">
                <FiPhone className="text-orange-400" />
              </div>
              <span className="font-bold text-white text-sm">Disaster Response</span>
              <span className="text-orange-400 font-mono text-xs mt-1 bg-orange-500/10 px-2 py-0.5 rounded">108</span>
            </a>
          </div>

          {/* Image Upload */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiImage className="text-primary-400" />
              Upload Evidence
            </h3>

            {!formData.imagePreview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center hover:border-primary-500/50 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FiUpload className="mx-auto text-3xl text-dark-400 mb-3" />
                  <p className="text-dark-300 text-sm">Drag & drop or click to upload</p>
                  <p className="text-dark-500 text-xs mt-1">Images and videos accepted</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark-900/80 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          <AnimatePresence>
            {(aiLoading || aiAnalysis) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AIAssistPanel analysis={aiAnalysis} loading={aiLoading} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Incident Details */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Incident Details</h3>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm text-dark-300 mb-2">Incident Type</label>
                <div className="flex flex-wrap gap-2">
                  {INCIDENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formData.type === type
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'bg-dark-800/50 text-dark-400 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-dark-300 mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the emergency situation..."
                  rows={3}
                  className="input-dark w-full resize-none"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm text-dark-300 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="+91-XXXXX-XXXXX"
                  className="input-dark w-full"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="glass-card" style={{ overflow: 'visible' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
            <LocationModule onLocationSelect={handleLocationSelect} />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!formData.type || !formData.location || submitting}
            className="w-full btn-danger flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed py-4 text-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Report...
              </>
            ) : (
              <>
                <FiSend />
                Submit Emergency Report
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
