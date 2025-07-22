"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiLayout, FiSmartphone, FiGlobe, FiZap, FiAward } from 'react-icons/fi';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { easeInOut, cubicBezier, backOut } from 'framer-motion';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.16, 1, 0.3, 1)
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0, rotate: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: backOut
      }
    },
    hover: {
      scale: 1.15,
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <>
      <Head>
        <title>Welcome | Premium Experience</title>
        <meta name="description" content="Experience our premium platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-700 flex flex-col items-center justify-center p-4 text-white overflow-hidden relative">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-800 bg-opacity-20"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: easeInOut
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="max-w-5xl w-full text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="relative inline-block mb-8">
            <motion.div
              className="absolute -inset-4 bg-indigo-600 rounded-xl opacity-20 blur-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ delay: 0.4, duration: 1 }}
            />
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-100 leading-tight"
              variants={itemVariants}
            >
             Try now
            </motion.h1>
          </div>

          <motion.div
            className="relative max-w-2xl mx-auto mb-16"
            variants={itemVariants}
          >
            <motion.p
              className="text-xl md:text-2xl text-indigo-100 font-medium"
            >
              SmartPharma Dashboard
            </motion.p>
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent w-1/2"
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            variants={itemVariants}
          >
            {[
              { icon: <FiZap size={32} />, text: "Lightning Fast", desc: "Optimized performance" },
              { icon: <FiAward size={32} />, text: "Premium Quality", desc: "Exceptional standards" },
              { icon: <FiSmartphone size={32} />, text: "Fully Responsive", desc: "All devices supported" },
              { icon: <FiGlobe size={32} />, text: "Global Network", desc: "Worldwide coverage" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 bg-indigo-900 bg-opacity-40 rounded-xl backdrop-blur-sm border border-indigo-800 hover:border-indigo-500 transition-all"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="p-4 mb-4 bg-indigo-700 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.text}</h3>
                <p className="text-indigo-200 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            onClick={handleNavigate}
            className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl font-semibold text-lg flex items-center mx-auto relative overflow-hidden group"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center">
              go to dashboard
              <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomeScreen;