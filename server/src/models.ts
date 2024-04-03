export interface User {
    id: number;
    username: string;
    email: string;
    hashed_password: string; 
}

interface Ingredient {
    name: string;
    quantity: string; 
}

export interface Recipe {
    id: number;
    name: string;
    serving_size?: string;
    time_required?: string;
    ingredients: Ingredient[];
    directions: string[]; 
    date_added: Date;
}
