/// <reference types="vite/client" />

export type MuscleGroupCategory =
  | 'Pectoral'
  | 'Hombro'
  | 'Espalda'
  | 'Bíceps'
  | 'Tríceps'
  | 'Abdomen'
  | 'Cuádriceps'
  | 'Isquiotibiales'
  | 'Aductores'
  | 'Glúteo'
  | 'Gemelos'
  | 'Antebrazo';

export type EquipmentModality =
  | 'Peso Libre'
  | 'Poleas'
  | 'Máquinas';

export type TrainingTechnique =
  | 'straight'     // Serie Normal / Estandar
  | 'superset'     // Superserie
  | 'multiseries'  // Triserie / Serie Gigante
  | 'dropset'      // Serie Descendente / Drop Set
  | 'rest_pause'   // Rest-Pause
  | 'myo_reps'     // Myo-Reps
  | 'top_backoff'; // Top Set / Back-off

export type SetType =
  | 'normal'
  | 'warmup'
  | 'dropset'
  | 'rest_pause'
  | 'myo_rep';

export interface DropDetail {
  weight: number;
  reps: number;
  unit?: 'kg' | 'lb';
}

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
  primary_muscle?: string;
  muscle_groups?: string[];
  modality?: EquipmentModality | string;
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
  sort_order: number;
  group_tag?: string; // e.g. "A", "B", "C" para enlazar A1, A2
  technique?: TrainingTechnique | string;
  notes?: string;
  target_sets: number;
  target_reps: string;
  target_rir: number;
  target_rest_sec: number;
  target_weight: number;
  weight_unit: 'kg' | 'lb';
  expandedExercise?: Exercise;
  setResults?: Record<number, ExerciseSetResult>;
}

export interface ExerciseSetResult {
  id?: string;
  routine_exercise: string;
  routine_exercise_id?: string;
  date: string;
  set_number: number;
  set_type?: SetType | string;
  completed_reps?: number | string;
  reps?: number | string;
  weight_used?: number | string;
  weight?: number | string;
  unit?: 'kg' | 'lb';
  weight_unit?: 'kg' | 'lb';
  actual_rir?: number;
  rir?: number;
  drop_details?: DropDetail[];
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
    primary_muscle?: string;
    muscle_groups?: string[];
    modality?: string;
    group_tag?: string;
    technique?: TrainingTechnique | string;
    notes?: string;
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
