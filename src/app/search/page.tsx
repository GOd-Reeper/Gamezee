import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import GameGrid from "@/components/games/GameGrid";
import SearchBar from "@/components/search/SearchBar";
import CategoryFilter from "@/components/search/CategoryFilter";
import createServerClient from "@/lib/supabase/server";
import { Category, Game } from "@/types";

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
  };
}

export const metadata: Metadata = {
  title: "Search Results - Gamezee",
  description: "Search results for games on Gamezee",
};

async function searchGames(query: string, categoryId?: string): Promise<Game[]> {
  try {
    const supabase = createServerClient();
    let gameQuery = supabase
      .from("games")
      .select("*, category:categories(*)")
      .textSearch("title", query, {
        config: "english",
        type: "websearch"
      });
    
    if (categoryId && categoryId !== "all") {
      gameQuery = gameQuery.eq("category_id", categoryId);
    }
    
    const { data: games, error } = await gameQuery.order("views", { ascending: false });
    
    if (error) {
      console.error("Error searching games:", error);
      return [];
    }
    
    return games || [];
  } catch (error) {
    console.error("Failed to search games:", error);
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = createServerClient();
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    
    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    
    return categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const categoryId = searchParams.category;
  
  const [searchResults, categories] = await Promise.all([
    searchGames(query, categoryId),
    getAllCategories()
  ]);
  
  const selectedCategory = categoryId 
    ? categories.find(c => c.id === categoryId)
    : undefined;
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Link 
                href="/"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Home
              </Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-sm text-white">Search</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Search Results
            </h1>
            <p className="text-lg text-white/80 mb-8">
              {query ? `Showing results for "${query}"` : "Enter a search term to find games"}
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar initialCategory={categoryId} />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">
              {searchResults.length} {searchResults.length === 1 ? 'Game' : 'Games'} Found
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <CategoryFilter categories={categories} selectedCategory={categoryId} />
          </div>
        </div>
        
        <Suspense fallback={<div className="text-center py-20">Searching games...</div>}>
          <GameGrid games={searchResults} />
        </Suspense>
        
        {searchResults.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No games found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Try adjusting your search terms or removing filters
            </p>
          </div>
        )}
      </section>
    </>
  );
} 