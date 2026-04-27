import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiPhoneCall, FiShield, FiUser, FiActivity, FiGlobe, FiLock } from 'react-icons/fi'
import AnimatedBackground from '../ui/AnimatedBackground'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col font-sans overflow-hidden relative">
      <AnimatedBackground />

      {/* Top System Bar */}
      <div className="bg-dark-900 border-b border-white/5 py-1.5 px-4 md:px-8 flex items-center justify-between text-[10px] sm:text-xs font-semibold tracking-widest text-dark-400 uppercase z-20">
        <div className="flex items-center gap-2">
          <FiActivity className="text-orange-500" />
          <span>Global Disaster Response Protocol</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500">Secure Uplink</span>
          </div>
          <span className="hidden sm:inline hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/admin/login')}>Admin Access</span>
          <span className="text-orange-500 font-bold flex items-center gap-1">
            <FiPhoneCall size={10} /> SOS 112
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-white/5 bg-dark-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <FiShield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest text-white uppercase leading-none">RESQ<span className="text-orange-500">NET</span></h1>
            <p className="text-[9px] text-dark-500 uppercase tracking-widest leading-tight mt-1">Autonomous Coordination</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider text-dark-400">
          <a href="#" className="hover:text-orange-400 transition-colors">CAPABILITIES</a>
          <a href="#" className="hover:text-orange-400 transition-colors">LIVE INTEL</a>
          <a href="#" className="hover:text-orange-400 transition-colors">DIRECTIVES</a>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold tracking-wider">
          <button className="hidden md:flex items-center gap-2 text-dark-300 hover:text-white transition-colors" title="Translate">
            <FiGlobe size={16} />
          </button>
          <button onClick={() => navigate('/admin/login')} className="hidden md:flex items-center gap-2 text-dark-300 hover:text-white transition-colors">
            <FiLock size={16} /> Admin
          </button>
          <button onClick={() => navigate('/citizen/login')} className="hidden md:flex items-center gap-2 text-dark-300 hover:text-white transition-colors">
            <FiUser size={16} /> Dashboard
          </button>
          <button className="bg-orange-500 hover:bg-orange-400 text-dark-900 px-6 py-2 rounded-lg transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            EMERGENCY
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          {/* Centered Proper Logo Text */}
          <div className="flex items-center justify-center font-black text-[60px] md:text-[120px] tracking-tighter leading-none mt-8">
            <span className="text-white">RESQ</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]">NET</span>
          </div>
          
          <p className="text-dark-300 text-sm md:text-base max-w-2xl text-center mt-6 tracking-wide font-medium leading-relaxed">
            Next-generation autonomous disaster management. Instant AI-powered triaging, unified communication, and real-time operational deployment.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {['FIRE • 101', 'POLICE • 100', 'MEDICAL • 108', 'DISASTER • 1070'].map(num => (
              <div key={num} className="rounded-full border border-white/10 bg-dark-800/50 backdrop-blur-sm px-5 py-2 text-[10px] md:text-xs text-dark-300 font-bold tracking-widest uppercase hover:border-orange-500/50 hover:text-orange-400 transition-all cursor-default">
                {num}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Portals Box - Modern Glassmorphic design instead of skewed */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 w-full max-w-3xl"
        >
          <div className="flex flex-col md:flex-row gap-6 px-4">
            
            {/* Citizen Portal Card */}
            <div 
              onClick={() => navigate('/citizen/login')}
              className="flex-1 p-6 rounded-2xl bg-dark-900/60 border border-white/5 hover:border-blue-500/50 hover:bg-dark-800/80 backdrop-blur-xl cursor-pointer group transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <FiUser size={28} />
                </div>
                <h4 className="font-bold tracking-widest text-lg text-white mb-1">CITIZEN PORTAL</h4>
                <p className="text-xs text-dark-400 tracking-wider">REPORT INCIDENTS & TRACK</p>
              </div>
            </div>

            {/* Admin/Command Portal Card */}
            <div 
              onClick={() => navigate('/team/login')}
              className="flex-1 p-6 rounded-2xl bg-dark-900/60 border border-white/5 hover:border-orange-500/50 hover:bg-dark-800/80 backdrop-blur-xl cursor-pointer group transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <FiShield size={28} />
                </div>
                <h4 className="font-bold tracking-widest text-lg text-white mb-1">COMMAND CENTER</h4>
                <p className="text-xs text-dark-400 tracking-wider">EMERGENCY DEPLOYMENT</p>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  )
}
