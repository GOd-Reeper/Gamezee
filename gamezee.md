Here's a complete **Cursor AI-compatible markdown doc** to generate a web project like **Poki.com** that:

* Uses **Next.js 14** with App Router for the frontend
* Uses **Supabase** as the database
* Allows **game embedding (via iframe)**
* Has **no authentication**
* Includes **categories, search, tags, and game metadata**
* Is production-ready and scalable

---

### 📄 `project.md` — Paste this into Cursor AI

```markdown
# Project Name: Gamezee

## Description
A game listing and playing website similar to Poki.com where users can browse and play embedded games. No login is required. Games are listed with categories, tags, thumbnails, and are embedded using iframe (HTML5 or WebGL). The project uses Supabase for storing game metadata and Next.js for the frontend.

---

## Tech Stack

- Frontend: Next.js 14 (App Router, TypeScript, TailwindCSS)
- Backend: Supabase (Database + Admin UI)
- Hosting: Vercel (for frontend)
- State Management: React Context or Zustand
- No authentication

---

## Pages & Features

### 1. Homepage (`/`)
- Hero banner and intro text
- List of trending and recent games
- Game search bar
- Category filters

### 2. Game Page (`/game/[slug]`)
- Embedded game iframe
- Game title, description, tags
- "More like this" section
- Game rating system (optional, using localStorage)

### 3. Categories Page (`/category/[slug]`)
- Shows games under selected category
- Filter options

### 4. Search Functionality
- Search bar in the header
- Uses Supabase full-text search
- Filtering by category/tags

---

## Supabase Schema

### Table: `games`
| Column       | Type        | Description                        |
|--------------|-------------|------------------------------------|
| id           | uuid        | Primary key                        |
| title        | text        | Name of the game                   |
| slug         | text        | URL slug                           |
| description  | text        | Game description                   |
| thumbnail    | text        | Public URL to image (game banner)  |
| category_id  | uuid        | Foreign key to categories table    |
| tags         | text[]      | Array of tags like ["2 Player"]    |
| embed_url    | text        | Iframe embed link (HTML5/WebGL)    |
| views        | integer     | Number of game views               |
| created_at   | timestamp   | Auto-filled by Supabase            |
| updated_at   | timestamp   | Auto-filled by Supabase            |

### Table: `categories`
| Column       | Type        | Description                        |
|--------------|-------------|------------------------------------|
| id           | uuid        | Primary key                        |
| name         | text        | Category name                      |
| slug         | text        | URL slug                           |
| created_at   | timestamp   | Auto-filled by Supabase            |

---

## File Structure

```
/app
  /api
    /games/route.ts
    /categories/route.ts
  /game/[slug]/page.tsx
  /category/[slug]/page.tsx
  layout.tsx
  page.tsx
  
/components
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
  /games
    GameCard.tsx
    GameGrid.tsx
    GameEmbed.tsx
  /layout
    Navbar.tsx
    Footer.tsx
  /search
    SearchBar.tsx
    CategoryFilter.tsx

/lib
  /supabase
    client.ts
    server.ts
  /utils
    formatters.ts

/types
  index.ts

/public
  /assets (for default thumbnails)

.env.local
tsconfig.json
tailwind.config.js
next.config.js
```

---

## Key Components

### ✅ `lib/supabase/client.ts` (client-side)
```ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
```

### ✅ `lib/supabase/server.ts` (server-side)
```ts
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export default function createServerClient() {
  const cookieStore = cookies();
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

---

### ✅ `components/games/GameCard.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`}>
      <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-40">
          <Image 
            src={game.thumbnail || "/assets/default-thumbnail.jpg"} 
            alt={game.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{game.title}</h3>
          <p className="text-sm text-gray-500">{game.category}</p>
        </div>
      </div>
    </Link>
  );
}
```

---

### ✅ `components/games/GameGrid.tsx`

Reusable grid layout to display multiple games from Supabase.

---

### ✅ `app/page.tsx` (Home)

```tsx
import { Suspense } from "react";
import GameGrid from "@/components/games/GameGrid";
import SearchBar from "@/components/search/SearchBar";
import CategoryFilter from "@/components/search/CategoryFilter";
import createServerClient from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("views", { ascending: false })
    .limit(12);

  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  return (
    <main>
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Play Awesome Games Online
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Discover and play the best HTML5 and WebGL games for free!
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Games</h2>
          <CategoryFilter categories={categories || []} />
        </div>
        
        <Suspense fallback={<div>Loading games...</div>}>
          <GameGrid games={games || []} />
        </Suspense>
      </section>
    </main>
  );
}
```

---

### ✅ `app/game/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import GameEmbed from "@/components/games/GameEmbed";
import createServerClient from "@/lib/supabase/server";

export async function generateMetadata({ params }) {
  const supabase = createServerClient();
  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", params.slug)
    .single();
    
  if (!game) return { title: "Game Not Found" };
  
  return {
    title: `${game.title} - Play on Gamezee`,
    description: game.description,
  };
}

export default async function GamePage({ params }) {
  const supabase = createServerClient();
  const { data: game } = await supabase
    .from("games")
    .select("*, categories(*)")
    .eq("slug", params.slug)
    .single();
    
  if (!game) notFound();
  
  // Increment view count
  await supabase
    .from("games")
    .update({ views: (game.views || 0) + 1 })
    .eq("id", game.id);
    
  // Get similar games
  const { data: similarGames } = await supabase
    .from("games")
    .select("*")
    .eq("category_id", game.category_id)
    .neq("id", game.id)
    .limit(4);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      
      <GameEmbed embedUrl={game.embed_url} />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Description</h2>
        <p className="text-gray-700">{game.description}</p>
        
        <div className="mt-4 flex gap-2">
          {game.tags?.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {similarGames?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">More Like This</h2>
          <GameGrid games={similarGames} />
        </div>
      )}
    </div>
  );
}
```

---

### ✅ `components/games/GameEmbed.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";

interface GameEmbedProps {
  embedUrl: string;
}

export default function GameEmbed({ embedUrl }: GameEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative aspect-video w-full max-w-5xl mx-auto bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <iframe 
        src={embedUrl} 
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
      />
    </div>
  );
}
```

---

### ✅ `app/category/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import GameGrid from "@/components/games/GameGrid";
import SearchBar from "@/components/search/SearchBar";
import createServerClient from "@/lib/supabase/server";

export default async function CategoryPage({ params }) {
  const supabase = createServerClient();
  
  // Get category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();
    
  if (!category) notFound();
  
  // Get games in this category
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("category_id", category.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name} Games</h1>
      
      <div className="mb-8">
        <SearchBar initialCategory={category.id} />
      </div>
      
      <GameGrid games={games || []} />
    </div>
  );
}
```

---

### ✅ `components/search/SearchBar.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

export default function SearchBar({ initialCategory = null }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // This would be better with a dedicated search API route
      // But for simplicity, we're using client-side Supabase here
      const { data: games } = await supabase
        .from("games")
        .select("*")
        .textSearch("title", query)
        .order("views", { ascending: false });
      
      // Here you would ideally navigate to a search results page
      // For now, we'll just console log the results
      console.log(games);
      
      // In a real implementation:
      // router.push(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games..."
        className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-colors"
      >
        {isSearching ? "..." : "Search"}
      </button>
    </form>
  );
}
```

---

## SEO + Optimization

* Next.js App Router metadata API for SEO
* Next.js Image component for performance
* Suspense and streaming for better UX
* Tailwind responsive layout
* Mobile-first design
* Server components for initial data loading
* Client components for interactivity

---

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

---

## Supabase Setup

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table
CREATE TABLE games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  embed_url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX games_title_idx ON games USING GIN (to_tsvector('english', title));
CREATE INDEX games_category_id_idx ON games (category_id);
CREATE INDEX games_views_idx ON games (views DESC);

-- Add some sample categories
INSERT INTO categories (name, slug) VALUES
  ('Action', 'action'),
  ('Adventure', 'adventure'),
  ('Puzzle', 'puzzle'),
  ('Racing', 'racing'),
  ('Sports', 'sports'),
  ('Strategy', 'strategy');
```

---

## Future Enhancements

* Game rating system (with localStorage)
* Game comments (with Supabase)
* Admin dashboard (to upload games)
* Theme customization (light/dark mode)
* Game view count tracking and analytics
* Social media sharing
* Related games algorithm
* Game collections/playlists (localStorage)

```

---

### ✅ What's Next?

Paste this into **Cursor AI**, and it will generate:
- The entire codebase (frontend & Supabase integration)
- Supabase client setup
- Dynamic routes for games & categories
- Search and filter functionality

Additional features that can be implemented:
- Admin dashboard (to upload/manage games)
- Theme customization with dark mode
- Game view count tracking and analytics
- User preferences stored in localStorage
- Social media sharing integration
```

---

### ✅ What's Next?

Paste this into **Cursor AI**, and it will generate:
- The entire codebase (frontend & Supabase integration)
- Supabase client setup
- Dynamic routes for games & categories
- Search and filter functionality

Additional features that can be implemented:
- Admin dashboard (to upload/manage games)
- Theme customization with dark mode
- Game view count tracking and analytics
- User preferences stored in localStorage
- Social media sharing integration

Want me to generate the Supabase SQL to create the `games` table as well?
```
