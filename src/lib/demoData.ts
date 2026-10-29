import { Client, ClientPlan, DayRoutine, RoutineExercise, ExerciseSetResult, TrainerUser } from '../types';
import { DEFAULT_EXERCISES } from './exerciseCatalog';
import { formatDateISO } from './utils';

export const DEMO_STORAGE_KEYS = {
  DEV_MODE: 'venefit_dev_mode',
  SEED_MODE: 'venefit_demo_seed_mode',
  CLIENTS: 'venefit_mock_clients',
  PLANS: 'venefit_mock_plans',
  ROUTINES: 'venefit_mock_routines',
  ROUTINE_EXERCISES: 'venefit_mock_routine_exercises',
  SET_RESULTS: 'venefit_mock_set_results'
};

export type DemoSeedMode = 'populated' | 'empty';

export const DEMO_TRAINER: TrainerUser = {
  id: 'trainer_demo_001',
  email: 'entrenador@demo.venefit.app',
  name: 'Carlos Gómez (Demo Trainer)'
};

function getExerciseById(id: string) {
  return DEFAULT_EXERCISES.find(e => e.id === id);
}

export function generateDemoSeedData() {
  const today = new Date();
  const todayStr = formatDateISO(today);

  // Clients
  const clients: Client[] = [
    {
      id: 'client_demo_1',
      name: 'Alejandro Silva',
      email: 'alejandro.silva@demo.local',
      phone: '+34 612 345 678',
      goal: 'Hipertrofia Muscular y Fuerza (Torso)',
      current_weight: 78.5,
      height: 178,
      notes: 'Objetivo: progresar en banca y ganar masa en hombros. Historial de molestia leve en hombro izquierdo; calentar manguito rotador.',
      created: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'client_demo_2',
      name: 'Mariana Rodríguez',
      email: 'mariana.rodriguez@demo.local',
      phone: '+34 698 765 432',
      goal: 'Tonificación, Glúteo e Isquios',
      current_weight: 61.2,
      height: 165,
      notes: 'Mesociclo enfocado en tren inferior y cadena posterior. Muy buena técnica en Hip Thrust.',
      created: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'client_demo_3',
      name: 'David Méndez',
      email: 'david.mendez@demo.local',
      phone: '+34 655 112 233',
      goal: 'Acondicionamiento Funcional y Resistencia',
      current_weight: 84.0,
      height: 182,
      notes: 'Preparación para circuito funcional.',
      created: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ];

  // Plans
  const planStart = new Date(today);
  planStart.setDate(planStart.getDate() - 14);
  const planEnd = new Date(today);
  planEnd.setDate(planEnd.getDate() + 42);

  const plan1: ClientPlan = {
    id: 'plan_demo_alejandro',
    client: 'client_demo_1',
    client_id: 'client_demo_1',
    name: 'Mesociclo 1: Hipertrofia & Fuerza (8 Semanas)',
    plan_name: 'Mesociclo 1: Hipertrofia & Fuerza (8 Semanas)',
    start_date: formatDateISO(planStart),
    end_date: formatDateISO(planEnd),
    notes: '4 días por semana: Empuje / Tracción / Pierna / Torso',
    created: planStart.toISOString()
  };

  const plan2: ClientPlan = {
    id: 'plan_demo_mariana',
    client: 'client_demo_2',
    client_id: 'client_demo_2',
    name: 'Fase 2: Glúteo & Tren Inferior Foco',
    plan_name: 'Fase 2: Glúteo & Tren Inferior Foco',
    start_date: formatDateISO(planStart),
    end_date: formatDateISO(planEnd),
    notes: '3 días por semana con alta intensidad en empujes de cadera',
    created: planStart.toISOString()
  };

  const plans = [plan1, plan2];

  // Routines and Routine Exercises
  const routines: DayRoutine[] = [];
  const routineExercises: RoutineExercise[] = [];
  const setResults: ExerciseSetResult[] = [];

  // Anchor week dates around today: from -7 days to +14 days
  for (let offset = -7; offset <= 14; offset++) {
    const curDate = new Date(today);
    curDate.setDate(curDate.getDate() + offset);
    const dateStr = formatDateISO(curDate);
    const dayOfWeek = curDate.getDay(); // 0 is Sunday, 1 Monday, etc.

    // For Alejandro (client_demo_1):
    // Ensure TODAY always has a routine!
    const isToday = offset === 0;

    if (isToday || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      const routineId = `routine_ale_${dateStr}`;
      let routineName = 'Empuje (Pecho, Hombro, Tríceps)';
      let muscleGroups = ['Pectoral', 'Hombro', 'Tríceps'];
      let exerciseConfigs: Array<{
        exId: string;
        sets: number;
        reps: string;
        rir: number;
        rest: number;
        weight: number;
        technique: string;
        group_tag?: string;
        notes?: string;
      }> = [];

      if (isToday || dayOfWeek === 1) {
        routineName = 'Empuje (Pecho, Hombro, Tríceps)';
        muscleGroups = ['Pectoral', 'Hombro', 'Tríceps'];
        exerciseConfigs = [
          {
            exId: 'ex_001', // Press de banca plano con barra
            sets: 4,
            reps: '8-10',
            rir: 2,
            rest: 90,
            weight: 80,
            technique: 'straight',
            notes: 'Pausa de 1s en el pecho, escapulas retraídas'
          },
          {
            exId: 'ex_002', // Press inclinado con mancuernas
            sets: 3,
            reps: '10-12',
            rir: 2,
            rest: 90,
            weight: 28,
            technique: 'superset',
            group_tag: 'A',
            notes: 'Combinar con elevaciones laterales'
          },
          {
            exId: 'ex_011', // Elevaciones laterales con mancuernas
            sets: 3,
            reps: '12-15',
            rir: 1,
            rest: 60,
            weight: 12,
            technique: 'superset',
            group_tag: 'A',
            notes: 'Subir con control sin balanceo de cadera'
          },
          {
            exId: 'ex_004', // Cruce de poleas altas
            sets: 3,
            reps: '12-15',
            rir: 0,
            rest: 60,
            weight: 15,
            technique: 'dropset',
            notes: 'En la última serie, realizar Drop Set bajando 30% el peso al fallo'
          },
          {
            exId: 'ex_036', // Press francés con barra Z
            sets: 3,
            reps: '10-12',
            rir: 2,
            rest: 75,
            weight: 30,
            technique: 'straight',
            notes: 'Codos cerrados manteniendo tensión constante'
          }
        ];
      } else if (dayOfWeek === 3) {
        routineName = 'Tracción (Espalda, Bíceps y Posterior)';
        muscleGroups = ['Espalda', 'Bíceps', 'Hombro'];
        exerciseConfigs = [
          {
            exId: 'ex_007',
            sets: 4,
            reps: '8-10',
            rir: 2,
            rest: 90,
            weight: 70,
            technique: 'straight'
          },
          {
            exId: 'ex_012',
            sets: 3,
            reps: '12-15',
            rir: 1,
            rest: 60,
            weight: 10,
            technique: 'straight'
          }
        ];
      } else if (dayOfWeek === 5) {
        routineName = 'Pierna (Cuádriceps, Isquios y Glúteo)';
        muscleGroups = ['Cuádriceps', 'Isquiotibiales', 'Glúteo'];
        exerciseConfigs = [
          {
            exId: 'ex_009',
            sets: 4,
            reps: '10-12',
            rir: 2,
            rest: 120,
            weight: 90,
            technique: 'straight'
          }
        ];
      }

      routines.push({
        id: routineId,
        plan: plan1.id,
        plan_id: plan1.id,
        client: 'client_demo_1',
        client_id: 'client_demo_1',
        date: dateStr,
        date_iso: dateStr,
        day_of_week: dayOfWeek,
        routine_name: routineName,
        muscle_groups: muscleGroups
      });

      exerciseConfigs.forEach((cfg, idx) => {
        const reId = `re_${routineId}_${idx + 1}`;
        const exMeta = getExerciseById(cfg.exId) || {
          id: cfg.exId,
          name: 'Ejercicio de Entrenamiento',
          primary_muscle: muscleGroups[0]
        };

        routineExercises.push({
          id: reId,
          routine: routineId,
          routine_id: routineId,
          exercise: cfg.exId,
          exercise_id: cfg.exId,
          sort_order: idx + 1,
          group_tag: cfg.group_tag || '',
          technique: cfg.technique || 'straight',
          notes: cfg.notes || '',
          target_sets: cfg.sets,
          target_reps: cfg.reps,
          target_rir: cfg.rir,
          target_rest_sec: cfg.rest,
          target_weight: cfg.weight,
          weight_unit: 'kg',
          expandedExercise: exMeta
        });

        // Pre-populate some set logs for today so the user sees real recorded results!
        if (isToday && idx === 0) {
          // Set 1 completed
          setResults.push({
            id: `set_${reId}_1`,
            routine_exercise: reId,
            routine_exercise_id: reId,
            date: dateStr,
            set_number: 1,
            set_type: 'normal',
            completed_reps: 10,
            reps: 10,
            weight_used: 80,
            weight: 80,
            unit: 'kg',
            weight_unit: 'kg',
            actual_rir: 2,
            rir: 2,
            completed: true
          });
          // Set 2 completed
          setResults.push({
            id: `set_${reId}_2`,
            routine_exercise: reId,
            routine_exercise_id: reId,
            date: dateStr,
            set_number: 2,
            set_type: 'normal',
            completed_reps: 9,
            reps: 9,
            weight_used: 80,
            weight: 80,
            unit: 'kg',
            weight_unit: 'kg',
            actual_rir: 1,
            rir: 1,
            completed: true
          });
        }
      });
    }

    // For Mariana (client_demo_2):
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || isToday) {
      const routineId = `routine_mariana_${dateStr}`;
      routines.push({
        id: routineId,
        plan: plan2.id,
        plan_id: plan2.id,
        client: 'client_demo_2',
        client_id: 'client_demo_2',
        date: dateStr,
        date_iso: dateStr,
        day_of_week: dayOfWeek,
        routine_name: 'Fuerza Inferior & Glúteo Activo',
        muscle_groups: ['Glúteo', 'Isquiotibiales', 'Cuádriceps']
      });

      const reId = `re_${routineId}_1`;
      routineExercises.push({
        id: reId,
        routine: routineId,
        routine_id: routineId,
        exercise: 'ex_001',
        exercise_id: 'ex_001',
        sort_order: 1,
        technique: 'straight',
        target_sets: 4,
        target_reps: '10-12',
        target_rir: 2,
        target_rest_sec: 90,
        target_weight: 55,
        weight_unit: 'kg',
        expandedExercise: getExerciseById('ex_001')
      });
    }
  }

  return {
    clients,
    plans,
    routines,
    routineExercises,
    setResults
  };
}

export function initDemoStorage(forceReset = false, mode: DemoSeedMode = 'populated') {
  try {
    const existing = localStorage.getItem(DEMO_STORAGE_KEYS.CLIENTS);
    if (existing === null || forceReset) {
      localStorage.setItem(DEMO_STORAGE_KEYS.DEV_MODE, 'true');
      localStorage.setItem(DEMO_STORAGE_KEYS.SEED_MODE, mode);

      if (mode === 'empty') {
        localStorage.setItem(DEMO_STORAGE_KEYS.CLIENTS, JSON.stringify([]));
        localStorage.setItem(DEMO_STORAGE_KEYS.PLANS, JSON.stringify([]));
        localStorage.setItem(DEMO_STORAGE_KEYS.ROUTINES, JSON.stringify([]));
        localStorage.setItem(DEMO_STORAGE_KEYS.ROUTINE_EXERCISES, JSON.stringify([]));
        localStorage.setItem(DEMO_STORAGE_KEYS.SET_RESULTS, JSON.stringify([]));
      } else {
        const data = generateDemoSeedData();
        localStorage.setItem(DEMO_STORAGE_KEYS.CLIENTS, JSON.stringify(data.clients));
        localStorage.setItem(DEMO_STORAGE_KEYS.PLANS, JSON.stringify(data.plans));
        localStorage.setItem(DEMO_STORAGE_KEYS.ROUTINES, JSON.stringify(data.routines));
        localStorage.setItem(DEMO_STORAGE_KEYS.ROUTINE_EXERCISES, JSON.stringify(data.routineExercises));
        localStorage.setItem(DEMO_STORAGE_KEYS.SET_RESULTS, JSON.stringify(data.setResults));
      }
    }
  } catch (err) {
    console.error('[DemoData] Failed to initialize demo storage:', err);
  }
}

export function resetDemoDataToPopulated() {
  initDemoStorage(true, 'populated');
}

export function resetDemoDataToEmpty() {
  initDemoStorage(true, 'empty');
}

export function resetDemoData() {
  const currentMode = getDemoSeedMode();
  initDemoStorage(true, currentMode);
}

export function getDemoSeedMode(): DemoSeedMode {
  try {
    return (localStorage.getItem(DEMO_STORAGE_KEYS.SEED_MODE) as DemoSeedMode) || 'populated';
  } catch {
    return 'populated';
  }
}

export function isDemoModeActive(): boolean {
  try {
    return localStorage.getItem(DEMO_STORAGE_KEYS.DEV_MODE) === 'true';
  } catch {
    return false;
  }
}
