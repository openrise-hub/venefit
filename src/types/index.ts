export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  goal?: string;
  current_weight?: number;
  height?: number;
  notes?: string;
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
  routine_id: string;
  exercise_id: string;
  target_sets: number;
  target_reps: string;
  target_rir: number;
  target_rest_sec: number;
  target_weight: number;
  weight_unit: 'kg' | 'lb';
  sort_order: number;
  exercise?: Exercise;
  setResults?: Record<number, ExerciseSetResult>;
}

export interface ExerciseSetResult {
  id?: string;
  routine_exercise_id: string;
  date: string;
  set_number: number;
  completed_reps: number | string;
  weight_used: number | string;
  weight_unit: 'kg' | 'lb';
  actual_rir: number;
  completed: boolean;
}

export interface ClientPlan {
  id: string;
  client_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  created?: string;
}

export interface DayRoutine {
  id: string;
  plan_id?: string;
  client_id: string;
  date_iso: string;
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
