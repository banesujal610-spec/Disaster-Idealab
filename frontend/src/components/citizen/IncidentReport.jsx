import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addIncident } from '../../store/incidentsSlice'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import { INCIDENT_TYPES } from '../../services/mockData'
import { analyzeDisasterImage } from '../../utils/imageAnalysis'
import { getNearestByType } from '../../utils/nearbyFacilities'
import AIAssistPanel from './AIAssistPanel'
import LocationModule from './LocationModule'
import SubmissionSuccess from './SubmissionSuccess'
import CallModal from './CallModal'
import { FiUpload, FiX, FiImage, FiSend, FiArrowLeft, FiPhone, FiChevronDown, FiChevronUp, FiCamera } from 'react-icons/fi'

export default function IncidentReport() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [step, setStep] = useState(0) // 0: form, 1: success
  const [submittedIncident, setSubmittedIncident] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [nearestFacilities, setNearestFacilities] = useState({})
  const [callModal, setCallModal] = useState({ isOpen: false, phone: '', name: '', type: '', distance: null, address: '' })

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

  // Handle facilities loaded from LocationModule
  const handleFacilitiesLoaded = useCallback((facilities) => {
    const nearest = getNearestByType(facilities)
    setNearestFacilities(nearest)
  }, [])

  // AI-powered image analysis using color distribution
  const runImageAnalysis = useCallback(async (imageDataUrl) => {
    setAiLoading(true)
    try {
      const analysis = await analyzeDisasterImage(imageDataUrl)
      setAiAnalysis(analysis)
      // We explicitly DO NOT auto-set formData.type here based on AI analysis
      // to ensure the user always manually confirms or selects the incident type.
    } catch (err) {
      console.error('AI analysis failed:', err)
      toast.error('Image analysis failed. Please select incident type manually.')
    } finally {
      setAiLoading(false)
    }
  }, [])

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size cannot exceed 10MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }))
        runImageAnalysis(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [runImageAnalysis])

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }))
    setAiAnalysis(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size cannot exceed 10MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }))
        runImageAnalysis(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [runImageAnalysis])

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }))
  }

  const openCallModal = (phone, name, type, distance, address) => {
    setCallModal({ isOpen: true, phone, name: name || type, type, distance, address: address || '' })
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

  // Emergency call cards config
  const emergencyCards = [
    {
      key: 'police',
      label: 'Police',
      defaultNumber: '100',
      color: 'blue',
      nearestFacility: nearestFacilities.police,
    },
    {
      key: 'fire_station',
      label: 'Fire Brigade',
      defaultNumber: '101',
      color: 'red',
      nearestFacility: nearestFacilities.fire_station,
    },
    {
      key: 'hospital',
      label: 'Ambulance',
      defaultNumber: '102',
      color: 'green',
      nearestFacility: nearestFacilities.hospital,
    },
    {
      key: 'disaster',
      label: 'Disaster Response',
      defaultNumber: '108',
      color: 'orange',
      nearestFacility: null,
    },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <CallModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal(prev => ({ ...prev, isOpen: false }))}
        phone={callModal.phone}
        name={callModal.name}
        type={callModal.type}
        distance={callModal.distance}
        address={callModal.address}
      />
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
          {/* Emergency Call Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {emergencyCards.map((card) => {
              const nf = card.nearestFacility
              const phoneNumber = nf?.phone || card.defaultNumber
              const facilityName = nf?.name || null
              const distance = nf?.distance || null

              return (
                <button 
                  key={card.key} 
                  onClick={() => openCallModal(phoneNumber, facilityName, card.label, distance, nf?.address)}
                  className={`glass-card p-4 flex flex-col items-center justify-center text-center hover:bg-${card.color}-500/10 hover:border-${card.color}-500/30 transition-all group`}
                >
                  <div className={`w-10 h-10 rounded-full bg-${card.color}-500/20 flex items-center justify-center mb-2 group-hover:shadow-[0_0_20px_rgba(var(--${card.color}),0.4)] transition-all`}>
                    <FiPhone className={`text-${card.color}-400`} />
                  </div>
                  <span className="font-bold text-white text-sm">{card.label}</span>
                  {facilityName && facilityName !== card.label && (
                    <span className="text-dark-400 text-[10px] mt-0.5 line-clamp-1 max-w-full px-1">{facilityName}</span>
                  )}
                  <span className={`text-${card.color}-400 font-mono text-xs mt-1 bg-${card.color}-500/10 px-2 py-0.5 rounded`}>
                    {phoneNumber}
                  </span>
                  {distance && (
                    <span className="text-dark-500 text-[10px] mt-0.5">
                      {distance < 1000 ? `${distance}m away` : `${(distance / 1000).toFixed(1)}km`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Upload Evidence - Optional with toggle */}
          <div className="glass-card">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiImage className="text-primary-400" />
                Upload Evidence
                <span className="text-xs font-normal text-dark-500 bg-dark-800/50 px-2 py-0.5 rounded-full">Optional</span>
              </h3>
              {showUpload ? (
                <FiChevronUp className="text-dark-400" />
              ) : (
                <FiChevronDown className="text-dark-400" />
              )}
            </button>

            <AnimatePresence>
              {showUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    {!formData.imagePreview ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-dark-600 rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="camera-upload"
                          />
                          <label htmlFor="camera-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <FiCamera className="text-3xl text-dark-400 mb-3" />
                            <p className="text-dark-300 font-medium">Click Picture</p>
                            <p className="text-dark-500 text-xs mt-1">Open device camera</p>
                          </label>
                        </div>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          className="border-2 border-dashed border-dark-600 rounded-xl p-6 text-center hover:border-primary-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
                        >
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="gallery-upload"
                          />
                          <label htmlFor="gallery-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <FiUpload className="text-3xl text-dark-400 mb-3" />
                            <p className="text-dark-300 font-medium">Upload Image</p>
                            <p className="text-dark-500 text-xs mt-1">From gallery (Up to 10MB)</p>
                          </label>
                        </div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Analysis */}
          <AnimatePresence>
            {(aiLoading || aiAnalysis) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative group"
              >
                <AIAssistPanel analysis={aiAnalysis} loading={aiLoading} />
                {!aiLoading && aiAnalysis && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, type: aiAnalysis.type }))}
                    className="absolute top-4 right-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    APPLY SUGGESTION
                  </button>
                )}
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
            <LocationModule
              onLocationSelect={handleLocationSelect}
              onFacilitiesLoaded={handleFacilitiesLoaded}
            />
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
