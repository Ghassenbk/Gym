// src/app/models/coach.model.ts
export interface Coach {
    id: number;
    name: string;
    email: string;
    password?: string;
    imagePath: string;
    role: string; // e.g., 'COACH'
    specialties: string;
    rating: number;
    reviews: any[];
    programs: Program[];
  }
  
  export interface Program {
    id: number;
    title: string;
    description: string;
    price: number;
    imagePath: string;
    enrolledClients: number;
    plans: Plan[];
  }
  
  export interface Plan {
    day: string;
    activity: string;
    time: string;
  }