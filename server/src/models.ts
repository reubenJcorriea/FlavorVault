export interface User {
    id: number;
    username: string;
    email: string;
    hashed_password: string; // Note: interact with plaintext passwords at registration/login but never store them as such.
}

interface Ingredient {
    name: string;
    quantity: string; // e.g., "1 cup", "2 tsp", etc.
}

export interface Recipe {
    id: number;
    name: string;
    serving_size?: string;
    time_required?: string;
    ingredients: Ingredient[];
    directions: string[]; // Each direction is a step in the recipe
    date_added: Date;
}
