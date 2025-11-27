"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion } from "@/components/motion";

interface SearchBarProps {
  initialCategory?: string;
  onClose?: () => void;
}

export default function SearchBar({ initialCategory = "", onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Navigate to search results page
      const searchParams = new URLSearchParams();
      searchParams.set('q', query);
      
      if (initialCategory) {
        searchParams.set('category', initialCategory);
      }
      
      router.push(`/search?${searchParams.toString()}`);
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Search error:", error);
      setIsSearching(false);
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSearch} 
      className="relative max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games..."
          className="w-full pl-10 pr-16 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>
    </motion.form>
  );
} 