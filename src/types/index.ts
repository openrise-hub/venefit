/// <reference types="vite/client" />

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  goal?: string;
  current_weight?: number;
  height?: number;
  notes?: string;
  trainer?: string;
  created?: string;
  updated?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_groups?: string[];
  equipment?: string;
  category?: string;
  description?: string;
}

export interface RoutineExercise {
  id: string;
  routine: string;
  routine_id?: string;
  exercise: string;
  exercise_id?: string;
  target_sets: number;
  target_reps: string;
  target_rir: number;
  target_rest_sec: number;
  target_weight: number;
  weight_unit: 'kg' | 'lb';
  sort_order: number;
  expandedExercise?: Exercise;
  setResults?: Record<number, ExerciseSetResult>;
}

export interface ExerciseSetResult {
  id?: string;
  routine_exercise: string;
  routine_exercise_id?: string;
  date: string;
  set_number: number;
  completed_reps?: number | string;
  reps?: number | string;
  weight_used?: number | string;
  weight?: number | string;
  unit?: 'kg' | 'lb';
  weight_unit?: 'kg' | 'lb';
  actual_rir?: number;
  rir?: number;
  completed: boolean;
}

export interface ClientPlan {
  id: string;
  client: string;
  client_id?: string;
  name: string;
  plan_name?: string;
  start_date: string;
  end_date: string;
  notes?: string;
  created?: string;
}

export interface DayRoutine {
  id: string;
  plan?: string;
  plan_id?: string;
  client: string;
  client_id?: string;
  date: string;
  date_iso?: string;
  day_of_week?: number;
  routine_name: string;
  muscle_groups?: string[];
}

export interface DayRoutineConfig {
  routineName: string;
  muscleGroups?: string[];
  exercises: Array<{
    exercise_id: string;
    name: string;
    muscle_groups?: string[];
    target_sets: number;
    target_reps: string;
    target_rir: number;
    target_rest_sec: number;
    target_weight: number;
    weight_unit: 'kg' | 'lb';
  }>;
}

export interface TrainerUser {
  id: string;
  email: string;
  name?: string;
}
