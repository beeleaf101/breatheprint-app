import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Map, User, Wind, Eye, Shield, TrendingUp, Sparkles, Globe, Zap, Award, Users, Clock, ChevronDown, Play, Star, Target, Activity, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveGlobalImpact from '../components/LiveGlobalImpact';
import RealMapStats from '../components/RealMapStats';
import RealProfileStats from '../components/RealProfileStats';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Animated Background with Grid */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-blue-950 opacity-80"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Animated Orbs */}
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            top: '-10%',
            left: '-10%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            bottom: '-10%',
            right: '-10%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-blue-500"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Top Bar */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-b border-white/10 backdrop-blur-xl bg-black/40"
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <span className="text-emerald-400 font-bold text-sm">LIVE</span>
              </motion.div>
              <div className="hidden md:flex items-center gap-2 text-white/70">
                <Users className="w-4 h-4" />
                <span className="font-mono text-sm">487,234</span>
                <span className="text-xs">North American witnesses</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Wind className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                NASA TEMPO
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-24 md:py-32">
          
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full px-6 py-3 backdrop-blur-xl">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-bold text-white">NASA Space Apps Challenge 2025 Winner</span>
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-7xl md:text-9xl font-black mb-8 relative">
              <motion.span 
                className="inline-block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                BreathePrint
              </motion.span>
              
              {/* Glow Effect */}
              <motion.div 
                className="absolute inset-0 blur-3xl opacity-30"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  BreathePrint
                </span>
              </motion.div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              <span className="text-white">Make Pollution </span>
              <span className="text-emerald-400">Visible</span>
              <span className="text-white">. Demand </span>
              <span className="text-blue-400">Action</span>
              <span className="text-white">.</span>
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xl md:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed font-light"
            >
              North America's first AR-powered pollution witness network. 
              <span className="text-emerald-400 font-semibold"> See invisible air</span> through your phone,
              <span className="text-blue-400 font-semibold"> document evidence</span> with NASA satellite data, and join 
              <span className="text-purple-400 font-semibold"> 487K+ witnesses</span> across USA, Canada & Mexico fighting for clean air.
            </motion.p>
          </motion.div>

          // Add this to your CTA Buttons section in Home.jsx (around line 230)

{/* CTA Buttons - Updated with 4 buttons */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.1 }}
  className="flex flex-wrap items-center justify-center gap-6 mb-16"
>
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16, 185, 129, 0.6)" }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/witness')}
    className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-emerald-500/50 overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500"
      initial={{ x: '-100%' }}
      whileHover={{ x: '0%' }}
      transition={{ duration: 0.3 }}
    ></motion.div>
    <span className="relative flex items-center gap-3">
      <Camera className="w-7 h-7" />
      <span>Open AR Camera</span>
      <motion.span
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-2xl"
      >
        →
      </motion.span>
    </span>
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/map')}
    className="bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all flex items-center gap-3"
  >
    <Play className="w-6 h-6" />
    <span>Watch Demo</span>
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/weather')}
    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/50 flex items-center gap-3"
  >
    <Cloud className="w-7 h-7" />
    <span>Weather Data</span>
  </motion.button>

  {/* NEW: NASA Earth Data Button */}
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)" }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/nasa-earth')}
    className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-orange-500/50 flex items-center gap-3"
  >
    <Globe className="w-7 h-7" />
    <span>NASA Satellites</span>
  </motion.button>
</motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-white/40 cursor-pointer hover:text-white/60 transition-colors"
            >
              <span className="text-sm font-medium">Discover More</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>

        {/* Live Stats Bar - North America Data */}
        <div className="container mx-auto px-6 py-12">
          <LiveGlobalImpact />
        </div>

        {/* Main Feature Cards */}
        <div className="container mx-auto px-6 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-center mb-16"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </span>
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* AR Witness Card - HUGE HERO */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:row-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => navigate('/witness')}
                className="group relative cursor-pointer h-full"
              >
                {/* Animated Glow Border */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                ></motion.div>
                
                <div className="relative bg-gradient-to-br from-emerald-950/90 via-green-950/80 to-emerald-900/90 backdrop-blur-2xl rounded-3xl p-10 border border-emerald-500/30 overflow-hidden h-full flex flex-col">
                  
                  {/* Animated Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  ></motion.div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -inset-3 bg-emerald-500/30 rounded-2xl blur-xl"
                        ></motion.div>
                        <div className="relative bg-gradient-to-br from-emerald-500/30 to-green-500/30 p-6 rounded-2xl border border-emerald-400/50 backdrop-blur-xl">
                          <Camera className="w-14 h-14 text-emerald-400" />
                        </div>
                      </motion.div>
                      
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-2 bg-red-500 text-white text-sm font-black px-5 py-2 rounded-full shadow-2xl shadow-red-500/50"
                      >
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-white rounded-full"
                        ></motion.div>
                        <span>LIVE NASA DATA</span>
                      </motion.div>
                    </div>
                    
                    <h2 className="text-6xl font-black text-white mb-6 group-hover:text-emerald-400 transition-colors">
                      AR Pollution Witness
                    </h2>
                    
                    <p className="text-white/90 text-2xl mb-8 leading-relaxed font-light">
                      Point your camera and <span className="text-emerald-400 font-bold">SEE</span> invisible pollution in real-time using NASA TEMPO satellite data. 
                      Document toxic clouds across North America, identify sources, and share evidence with 487K+ witnesses.
                    </p>

                    {/* Feature Pills */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Eye, label: 'See', sublabel: 'Real-time AR', color: 'emerald' },
                        { icon: Camera, label: 'Capture', sublabel: 'NASA Data', color: 'green' },
                        { icon: Target, label: 'Track', sublabel: 'Polluters', color: 'teal' },
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`bg-${feature.color}-500/10 backdrop-blur-xl rounded-2xl p-5 text-center border border-${feature.color}-500/30 hover:border-${feature.color}-500/60 transition-all`}
                        >
                          <feature.icon className={`w-7 h-7 text-${feature.color}-400 mx-auto mb-2`} />
                          <div className="text-base font-bold text-white">{feature.label}</div>
                          <div className="text-xs text-white/60 mt-1">{feature.sublabel}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <motion.div 
                      className="flex items-center gap-4 text-emerald-400 font-black text-2xl mt-auto"
                      whileHover={{ gap: '2rem' }}
                    >
                      <span>Launch NASA AR Camera</span>
                      <motion.span
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-4xl"
                      >→</motion.span>
                    </motion.div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-400">94%</div>
                        <div className="text-xs text-white/60">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-400">487K</div>
                        <div className="text-xs text-white/60">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-emerald-400">24/7</div>
                        <div className="text-xs text-white/60">Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Community Map Card - North America */}
            <RealMapStats onClick={() => navigate('/map')} />

            {/* Personal Dashboard Card - North America */}
            <RealProfileStats onClick={() => navigate('/profile')} />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />
            
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl p-16 border border-white/10">
              
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-6xl font-black mb-6"
                >
                  <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    How It Works
                  </span>
                </motion.h2>
                <p className="text-white/60 text-xl font-light">Three steps to environmental justice in North America</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12 relative">
                {[
                  { 
                    num: "01", 
                    title: "See Pollution", 
                    desc: "Open the AR camera to visualize invisible air pollution using real NASA TEMPO satellite data covering USA, Canada & Mexico",
                    gradient: "from-emerald-500 to-green-500",
                    icon: Eye,
                    color: "emerald"
                  },
                  { 
                    num: "02", 
                    title: "Document Evidence", 
                    desc: "Capture photos with pollution overlays, NASA data, geolocation, and timestamps - saved to your profile for legal documentation",
                    gradient: "from-blue-500 to-cyan-500",
                    icon: Camera,
                    color: "blue"
                  },
                  { 
                    num: "03", 
                    title: "Create Impact", 
                    desc: "Share with 487K+ North American witnesses, track polluters across the continent, organize action, and demand accountability",
                    gradient: "from-purple-500 to-pink-500",
                    icon: Shield,
                    color: "purple"
                  }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className="text-center"
                    >
                      <div className="relative inline-block mb-8">
                        <motion.div
                          className={`absolute -inset-4 bg-gradient-to-r ${step.gradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-all`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`relative bg-gradient-to-br ${step.gradient} w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl`}
                        >
                          <step.icon className="w-12 h-12 text-white" />
                        </motion.div>
                        <div className={`absolute -top-3 -right-3 bg-${step.color}-400 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-xl`}>
                          {step.num}
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4">{step.title}</h3>
                      <p className="text-white/70 leading-relaxed text-lg">{step.desc}</p>
                    </motion.div>
                    
                    {/* Connector */}
                    {idx < 2 && (
                      <motion.div 
                        className="hidden md:block absolute top-12 left-full w-full h-1"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 + 0.5, duration: 0.6 }}
                      >
                        <div className={`w-full h-full bg-gradient-to-r ${step.gradient} opacity-30`} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 py-16 text-center border-t border-white/10"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </div>
          <p className="text-white/60 text-xl mb-3 font-light">Built with NASA Earth Data for cleaner air across North America</p>
          <p className="text-white/40 text-sm">NASA Space Apps Challenge 2025 • BreathePrint • USA • Canada • Mexico</p>
        </motion.footer>

      </div>
    </div>
  );
};

export default Home;