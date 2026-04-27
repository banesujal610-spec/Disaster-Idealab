import { motion, AnimatePresence } from 'framer-motion'
import { FiPhone, FiCopy, FiCheck, FiX, FiMapPin } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function CallModal({ isOpen, onClose, phone, name, type, distance, address }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone)
      setCopied(true)
      toast.success(`Number copied: ${phone}`)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = phone
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      toast.success(`Number copied: ${phone}`)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleCall = () => {
    // Try multiple methods to initiate the call
    window.location.href = `tel:${phone}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-dark-900 shadow-2xl"
            style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%)' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
            >
              <FiX size={16} />
            </button>

            <div className="p-6 text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <FiPhone className="text-green-400" size={28} />
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-white mb-1">
                {name || type || 'Emergency'}
              </h3>

              {/* Type & Distance */}
              {(type || distance) && (
                <p className="text-dark-400 text-sm mb-1">
                  {type}{distance ? ` • ${distance < 1000 ? `${distance}m away` : `${(distance / 1000).toFixed(1)}km away`}` : ''}
                </p>
              )}

              {/* Address */}
              {address && (
                <p className="text-dark-500 text-xs flex items-center justify-center gap-1 mb-4">
                  <FiMapPin size={10} /> {address}
                </p>
              )}

              {/* Phone Number - Big & Prominent */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-5">
                <p className="text-3xl font-bold text-white font-mono tracking-wider">
                  {phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Call Button */}
                <a
                  href={`tel:${phone}`}
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                >
                  <FiPhone size={18} />
                  Call Now
                </a>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all active:scale-95 ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy size={18} />
                      Copy Number
                    </>
                  )}
                </button>
              </div>

              {/* Tip for desktop users */}
              <p className="text-dark-500 text-[11px] mt-4 leading-relaxed">
                💡 On desktop, copy the number and dial from your phone.
                <br />On mobile, tap "Call Now" to connect directly.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
