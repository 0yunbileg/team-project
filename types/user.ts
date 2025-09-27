export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
}

export interface Pet {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  goals: string[];
  password: string;
  points: number;
  tasks: Task[];
  pet: Pet;
}
