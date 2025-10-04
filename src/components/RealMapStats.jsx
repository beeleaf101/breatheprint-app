import React from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Users, TrendingUp } from 'lucide-react';

const RealMapStats = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={onClick}
        className="group relative cursor-pointer h-full"
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="relative bg-gradient-to-br from-blue-950/90 via-cyan-950/80 to-blue-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-blue-500/30 overflow-hidden h-full flex flex-col">
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
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
                  className="absolute -inset-3 bg-blue-500/30 rounded-2xl blur-xl"
                />
                <div className="relative bg-gradient-to-br from-blue-500/30 to-cyan-500/30 p-5 rounded-2xl border border-blue-400/50 backdrop-blur-xl">
                  <Map className="w-10 h-10 text-blue-400" />
                </div>
              </motion.div>
              
              <div className="text-right">
                <div className="text-3xl font-black text-blue-400">156K+</div>
                <div className="text-xs text-white/60">Active Reports</div>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
              North America Map
            </h2>
            
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              Explore real-time pollution reports from <span className="text-blue-400 font-bold">342 cities</span> across 
              the USA, Canada, and Mexico. See hotspots, trends, and join the community.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Los Angeles', value: '23K', icon: MapPin },
                { label: 'New York', value: '18K', icon: MapPin },
                { label: 'Toronto', value: '12K', icon: MapPin },
              ].map((city, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-blue-500/10 backdrop-blur-xl rounded-xl p-3 text-center border border-blue-500/20"
                >
                  <city.icon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm font-bold text-white">{city.value}</div>
                  <div className="text-xs text-white/60">{city.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex items-center gap-4 text-blue-400 font-black text-xl mt-auto"
              whileHover={{ gap: '2rem' }}
            >
              <span>Explore Map</span>
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl"
              >→</motion.span>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400">487K+</div>
                <div className="text-xs text-white/60">Witnesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400">24/7</div>
                <div className="text-xs text-white/60">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RealMapStats;
