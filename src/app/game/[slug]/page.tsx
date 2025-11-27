import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import GameEmbed from "@/components/games/GameEmbed";
import GameGrid from "@/components/games/GameGrid";
import { formatDate } from "@/lib/utils";
import createServerClient from "@/lib/supabase/server";
import { Game } from "@/types";

type Props = {
  params: { slug: string };
};

// Fallback game data for testing
const fallbackGame: Game = {
  id: "fallback-id",
  title: "Fallback Game",
  slug: "fallback-game",
  description: "This is a fallback game used for testing when the database connection fails.",
  thumbnail: "https://i.imgur.com/uHE8xGu.png",
  category_id: "fallback-category",
  tags: ["fallback", "test"],
  embed_url: "https://www.addictinggames.com/embed/html5-games/24614",
  views: 100,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: {
    id: "fallback-category",
    name: "Test Category",
    slug: "test-category",
    created_at: new Date().toISOString()
  }
};

async function getGameBySlug(slug: string): Promise<Game | null> {
  try {
    console.log(`Fetching game with slug: ${slug}`);
    
    // Check if slug is empty or undefined
    if (!slug || slug === ':') {
      console.error("Invalid slug provided:", slug);
      return fallbackGame;
    }
    
    // Check if Supabase credentials are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase credentials are missing. Using fallback game data.");
      return { ...fallbackGame, slug };
    }
    
    const supabase = createServerClient();
    
    // First, let's verify the slug exists in the database
    const { data: slugCheck, error: slugError } = await supabase
      .from("games")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    
    if (slugError) {
      console.error("Error checking game slug:", slugError);
      return { ...fallbackGame, slug };
    }
    
    console.log(`Slug check result:`, slugCheck);
    
    if (!slugCheck) {
      console.error(`No game found with slug: ${slug}`);
      // Return null to show a 404 page
      return null;
    }
    
    // Now fetch the full game data
    const { data: game, error } = await supabase
      .from("games")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();
    
    if (error) {
      console.error("Error fetching game:", error);
      return { ...fallbackGame, slug };
    }
    
    console.log(`Game data fetched:`, game);
    return game;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return { ...fallbackGame, slug };
  }
}

async function getSimilarGames(gameId: string, categoryId: string): Promise<Game[]> {
  try {
    // Check if Supabase credentials are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase credentials are missing. Cannot fetch similar games.");
      return [];
    }
    
    // Check if parameters are valid
    if (!gameId || !categoryId) {
      console.error("Invalid parameters for similar games:", { gameId, categoryId });
      return [];
    }
    
    const supabase = createServerClient();
    const { data: games, error } = await supabase
      .from("games")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .neq("id", gameId)
      .order("views", { ascending: false })
      .limit(4);
    
    if (error) {
      console.error("Error fetching similar games:", error);
      return [];
    }
    
    return games || [];
  } catch (error) {
    console.error("Error fetching similar games:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Check if slug is valid
  if (!params.slug || params.slug === ':') {
    return {
      title: "Game Not Found - Gamezee",
    };
  }
  
  const game = await getGameBySlug(params.slug);
  
  if (!game) {
    return {
      title: "Game Not Found - Gamezee",
    };
  }
  
  return {
    title: `${game.title} - Play on Gamezee`,
    description: game.description,
    openGraph: {
      title: `${game.title} - Play on Gamezee`,
      description: game.description,
      images: game.thumbnail ? [{ url: game.thumbnail }] : [],
    },
  };
}

export default async function GamePage({ params }: Props) {
  // Check if slug is valid
  if (!params.slug || params.slug === ':') {
    notFound();
  }
  
  const game = await getGameBySlug(params.slug);
  
  if (!game) notFound();
  
  // Update view count (only if not using fallback)
  if (game.id !== "fallback-id" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerClient();
      await supabase
        .from("games")
        .update({ views: (game.views || 0) + 1 })
        .eq("id", game.id);
    } catch (error) {
      console.error("Failed to update view count:", error);
    }
  }
  
  // Get similar games - only if not using fallback
  let similarGames: Game[] = [];
  if (game.id !== "fallback-id") {
    similarGames = await getSimilarGames(game.id, game.category_id);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Home
        </Link>
        <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
        <Link 
          href={`/category/${game.category?.slug}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {game.category?.name}
        </Link>
        <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{game.title}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{game.title}</h1>
          
          <GameEmbed embedUrl={game.embed_url} />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">About This Game</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {game.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {game.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Game Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="font-medium">{game.category?.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                <p className="font-medium">{game.views.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Added On</p>
                <p className="font-medium">{formatDate(game.created_at)}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Share This Game</h3>
              <div className="flex space-x-4">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {similarGames.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">More Like This</h2>
          <GameGrid games={similarGames} />
        </div>
      )}
    </div>
  );
} 