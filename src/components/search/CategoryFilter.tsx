"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "@/components/motion";
import { Category } from "@/types";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "All Categories";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-48 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className="truncate">{selectedCategoryName}</span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full md:w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1 max-h-60 overflow-auto">
              <Link
                href="/"
                className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  !selectedCategory ? 'text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'
                }`}
                onClick={() => setIsOpen(false)}
              >
                All Categories
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedCategory === category.id ? 'text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 