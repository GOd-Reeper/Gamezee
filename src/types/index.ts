export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category_id: string;
  category?: Category;
  tags: string[];
  embed_url: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      games: {
        Row: Game;
        Insert: Omit<Game, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Game, 'id' | 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
    };
  };
} 