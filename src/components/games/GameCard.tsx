"use client";

import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { motion } from "@/components/motion";
import { truncateText } from "@/lib/utils";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Ensure the slug is valid
  if (!game.slug) {
    console.error("Game is missing slug:", game);
  }
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/game/${game.slug}`} className="block">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-game-card hover:shadow-game-card-hover transition-all duration-300">
          <div className="relative h-48 w-full">
            {game.thumbnail ? (
              <Image 
                src={game.thumbnail} 
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{game.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-sm font-medium">Play Now</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{game.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {truncateText(game.description || "", 60)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-900/30 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
                {game.category?.name || "Game"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {game.views} views
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 