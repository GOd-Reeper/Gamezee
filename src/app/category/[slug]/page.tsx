import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import GameGrid from "@/components/games/GameGrid";
import SearchBar from "@/components/search/SearchBar";
import CategoryFilter from "@/components/search/CategoryFilter";
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

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    // Handle "all" as a special case
    if (slug === "all") {
      return {
        id: "all",
        name: "All",
        slug: "all",
        created_at: new Date().toISOString()
      };
    }
    
    const supabase = createServerClient();
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    
    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }
    
    return category;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
}

async function getGamesByCategory(categoryId: string): Promise<Game[]> {
  try {
    const supabase = createServerClient();
    
    // If "all" category, return all games
    if (categoryId === "all") {
      const { data: games, error } = await supabase
        .from("games")
        .select("*, category:categories(*)")
        .order("views", { ascending: false });
      
      if (error) {
        console.error("Error fetching all games:", error);
        return [];
      }
      
      return games || [];
    }
    
    // Otherwise, filter by category
    const { data: games, error } = await supabase
      .from("games")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .order("views", { ascending: false });
    
    if (error) {
      console.error("Error fetching games by category:", error);
      return [];
    }
    
    return games || [];
  } catch (error) {
    console.error("Failed to fetch games by category:", error);
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
      return mockCategories;
    }
    
    return categories || mockCategories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return mockCategories;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: "Category Not Found - Gamezee",
    };
  }
  
  return {
    title: `${category.name} Games - Gamezee`,
    description: `Play the best ${category.name.toLowerCase()} games online for free on Gamezee.`,
  };
}

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) notFound();
  
  // Get games in this category and all categories for the filter
  const [categoryGames, allCategories] = await Promise.all([
    getGamesByCategory(category.id),
    getAllCategories()
  ]);
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16">
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
              <span className="text-sm text-white">{category.name}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {category.name} Games
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Discover and play the best {category.name.toLowerCase()} games online for free. No downloads required!
            </p>
            <div className="max-w-xl">
              <SearchBar initialCategory={category.id} />
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">
              {categoryGames.length} {category.name} {categoryGames.length === 1 ? 'Game' : 'Games'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <CategoryFilter categories={allCategories} selectedCategory={category.id} />
          </div>
        </div>
        
        <GameGrid games={categoryGames} />
        
        {categoryGames.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No games found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              We couldn't find any games in this category. Please check back later.
            </p>
          </div>
        )}
      </section>
      
      {/* Related Categories */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Explore Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allCategories
              .filter(c => c.id !== category.id)
              .map((relatedCategory) => (
                <Link
                  key={relatedCategory.id}
                  href={`/category/${relatedCategory.slug}`}
                  className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {relatedCategory.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
} 