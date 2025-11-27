"use client";

import { Game } from "@/types";
import GameCard from "./GameCard";
import { motion } from "@/components/motion";

interface GameGridProps {
  games: Game[];
  className?: string;
}

export default function GameGrid({ games, className = "" }: GameGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (games.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No games found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </motion.div>
  );
} 