"use client";

import { useState, useEffect } from "react";
import { motion } from "@/components/motion";

interface GameEmbedProps {
  embedUrl: string;
}

export default function GameEmbed({ embedUrl }: GameEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading game...</p>
          </div>
        </motion.div>
      )}
      
      <motion.iframe 
        src={embedUrl} 
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
} 