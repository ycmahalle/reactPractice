import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12">
        <motion.span 
          className="absolute inset-0 block border-4 border-brand-200 dark:border-brand-900 rounded-full"
        />
        <motion.span 
          className="absolute inset-0 block border-4 border-brand-500 rounded-full border-t-transparent dark:border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-medium">{text}</p>
    </div>
  );
};

export default Loader;
