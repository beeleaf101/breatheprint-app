import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, Shield, Target } from 'lucide-react';

const RealProfileStats = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={onClick}
        className="group relative cursor-pointer h-full"
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="relative bg-gradient-to-br from-purple-950/90 via-pink-950/80 to-purple-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 overflow-hidden h-full flex flex-col">
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-3 bg-purple-500/30 rounded-2xl blur-xl"
                />
                <div className="relative bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-5 rounded-2xl border border-purple-400/50 backdrop-blur-xl">
                  <User className="w-10 h-10 text-purple-400" />
                </div>
              </motion.div>
              
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors">
              Your BreathePrint
            </h2>
            
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              Track your environmental impact across <span className="text-purple-400 font-bold">North America</span>. 
              View exposure history, earn achievements, and see your contribution.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Reports', value: '42', icon: Target },
                { label: 'Impact', value: 'Gold', icon: Award },
                { label: 'Streak', value: '14d', icon: Shield },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-purple-500/10 backdrop-blur-xl rounded-xl p-3 text-center border border-purple-500/20"
                >
                  <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex items-center gap-4 text-purple-400 font-black text-xl mt-auto"
              whileHover={{ gap: '2rem' }}
            >
              <span>View Profile</span>
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl"
              >→</motion.span>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-400">Top 5%</div>
                <div className="text-xs text-white/60">Continental Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-purple-400">89</div>
                <div className="text-xs text-white/60">Impact Score</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RealProfileStats;