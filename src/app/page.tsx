import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/games/GameGrid";
import SearchBar from "@/components/search/SearchBar";
import CategoryFilter from "@/components/search/CategoryFilter";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import createServerClient from "@/lib/supabase/server";
import { Category, Game } from "@/types";

// Fallback mock data in case Supabase fetch fails
const mockCategories = [
  { id: "1", name: "Action", slug: "action", created_at: new Date().toISOString() },
  { id: "2", name: "Adventure", slug: "adventure", created_at: new Date().toISOString() },
  { id: "3", name: "Puzzle", slug: "puzzle", created_at: new Date().toISOString() },
  { id: "4", name: "Racing", slug: "racing", created_at: new Date().toISOString() },
  { id: "5", name: "Sports", slug: "sports", created_at: new Date().toISOString() },
  { id: "6", name: "Strategy", slug: "strategy", created_at: new Date().toISOString() },
];

async function getGames(): Promise<Game[]> {
  try {
    console.log("Fetching games from Supabase");
    const supabase = createServerClient();
    const { data: games, error } = await supabase
      .from("games")
      .select("*, category:categories(*)")
      .order("views", { ascending: false })
      .limit(8);
    
    if (error) {
      console.error("Error fetching games:", error);
      return [];
    }
    
    console.log("Games fetched successfully:", games?.length || 0, "games");
    console.log("First game sample:", games?.[0]);
    
    return games || [];
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createServerClient();
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    
    if (error) {
      console.error("Error fetching categories:", error);
      return mockCategories;
    }
    
    return categories || mockCategories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return mockCategories;
  }
}

export default async function HomePage() {
  const [games, categories] = await Promise.all([
    getGames(),
    getCategories()
  ]);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/hero-pattern.svg')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Play Awesome Games Online
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover and play the best HTML5 and WebGL games for free!
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                <span className="text-2xl">{getCategoryEmoji(category.slug)}</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Games */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Trending Games</h2>
          <div className="flex items-center space-x-4">
            <CategoryFilter categories={categories} />
          </div>
        </div>
        
        <Suspense fallback={<div className="text-center py-20">Loading games...</div>}>
          <GameGrid games={games} />
        </Suspense>
        
        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/category/all">
              <span>View All Games</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Jump into the action with our collection of free online games. No downloads required!
            </p>
            <Button size="lg" asChild>
              <Link href="/category/all">
                Browse All Games
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function getCategoryEmoji(slug: string): string {
  const emojiMap: Record<string, string> = {
    action: "🔥",
    adventure: "🗺️",
    puzzle: "🧩",
    racing: "🏎️",
    sports: "⚽",
    strategy: "♟️",
  };
  
  return emojiMap[slug] || "🎮";
}
