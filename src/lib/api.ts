import { getPocketBaseClient, getCurrentTrainer } from './pocketbase';
import { generateReplicatedDates } from './utils';
import { showToast } from './toastStore';
import { Client, Exercise, RoutineExercise, ExerciseSetResult, ClientPlan, DayRoutine, DayRoutineConfig } from '../types';

function sanitizeFilter(value: any): string {
  if (value == null) return '';
  return String(value).replace(/"/g, '\\"');
}

export async function getClients(): Promise<Client[]> {
  const pb = getPocketBaseClient();
  try {
    const list = await pb.collection('clients').getFullList({
      sort: '-created'
    });
    return list as unknown as Client[];
  } catch (e) {
    console.error('[API:getClients] Failed to fetch clients list from PocketBase:', e);
    showToast('Error al obtener la lista de clientes', 'error');
    return [];
  }
}

export async function createClient(clientData: Partial<Client>): Promise<Client> {
  const pb = getPocketBaseClient();
  try {
    const currentTrainer = getCurrentTrainer();
    const payload = {
      ...clientData,
      trainer_id: currentTrainer ? currentTrainer.id : null
    };

    const record = await pb.collection('clients').create(payload);
    showToast(`Cliente "${clientData.name}" creado correctamente`, 'success');
    return record as unknown as Client;
  } catch (e) {
    console.error('[API:createClient] Failed to create client in PocketBase:', e);
    showToast('Error al guardar el nuevo cliente', 'error');
    throw e;
  }
}

export async function deleteClient(clientId: string): Promise<boolean> {
  const pb = getPocketBaseClient();
  try {
    const sanitizedId = sanitizeFilter(clientId);
    await pb.collection('clients').delete(sanitizedId);
    showToast('Cliente eliminado de la base de datos', 'info');
    return true;
  } catch (e) {
    console.error('[API:deleteClient] Failed to delete client from PocketBase:', e);
    showToast('Error al eliminar el cliente', 'error');
    throw e;
  }
}

export async function getExercises(muscleGroupsFilter: string[] = [], searchQuery: string = ''): Promise<Exercise[]> {
  const pb = getPocketBaseClient();
  try {
    const filterClauses: string[] = [];

    if (searchQuery && searchQuery.trim().length > 0) {
      const cleanQuery = sanitizeFilter(searchQuery.trim());
      filterClauses.push(`name ~ "${cleanQuery}"`);
    }

    if (muscleGroupsFilter && muscleGroupsFilter.length > 0) {
      const groupConditions = muscleGroupsFilter.map(group => {
        const cleanGroup = sanitizeFilter(group);
        return `muscle_groups ~ "${cleanGroup}"`;
      });
      filterClauses.push(`(${groupConditions.join(' || ')})`);
    }

    const filterString = filterClauses.join(' && ');

    const list = await pb.collection('exercises').getFullList({
      sort: 'name',
      filter: filterString || undefined
    });

    return list as unknown as Exercise[];
  } catch (e) {
    console.error('[API:getExercises] Failed to fetch exercises list from PocketBase:', e);
    showToast('Error al cargar catálogo de ejercicios', 'error');
    return [];
  }
}

export async function getRoutineForDay(clientId: string, dateStr: string): Promise<{ routine: DayRoutine; exercises: RoutineExercise[] } | null> {
  const pb = getPocketBaseClient();
  try {
    const sanitizedClientId = sanitizeFilter(clientId);
    const sanitizedDate = sanitizeFilter(dateStr);

    const routineRecord = await pb.collection('routines').getFirstListItem(
      `client_id = "${sanitizedClientId}" && date_iso = "${sanitizedDate}"`
    ).catch(() => null);

    if (!routineRecord) {
      return null;
    }

    const sanitizedRoutineId = sanitizeFilter(routineRecord.id);

    const exercisesList = await pb.collection('routine_exercises').getFullList({
      filter: `routine_id = "${sanitizedRoutineId}"`,
      expand: 'exercise_id',
      sort: 'sort_order'
    });

    const setResultsList = await pb.collection('set_results').getFullList({
      filter: `date = "${sanitizedDate}"`
    });

    const setResultsByExercise: Record<string, Record<number, ExerciseSetResult>> = {};
    setResultsList.forEach(sr => {
      const exId = sr.routine_exercise_id;
      if (!setResultsByExercise[exId]) {
        setResultsByExercise[exId] = {};
      }
      setResultsByExercise[exId][sr.set_number] = sr as unknown as ExerciseSetResult;
    });

    const formattedExercises: RoutineExercise[] = exercisesList.map(re => {
      const expandedExercise = re.expand && re.expand.exercise_id ? re.expand.exercise_id : null;
      return {
        id: re.id,
        routine_id: re.routine_id,
        exercise_id: re.exercise_id,
        target_sets: re.target_sets,
        target_reps: re.target_reps,
        target_rir: re.target_rir,
        target_rest_sec: re.target_rest_sec,
        target_weight: re.target_weight,
        weight_unit: re.weight_unit || 'kg',
        sort_order: re.sort_order,
        exercise: expandedExercise ? {
          id: expandedExercise.id,
          name: expandedExercise.name,
          muscle_groups: expandedExercise.muscle_groups,
          equipment: expandedExercise.equipment
        } : undefined,
        setResults: setResultsByExercise[re.id] || {}
      };
    });

    return {
      routine: routineRecord as unknown as DayRoutine,
      exercises: formattedExercises
    };
  } catch (e) {
    console.error('[API:getRoutineForDay] Failed to load day workout from PocketBase:', e);
    return null;
  }
}

export async function saveSetResult(setData: Partial<ExerciseSetResult>): Promise<ExerciseSetResult | null> {
  const pb = getPocketBaseClient();
  try {
    const sanitizedExId = sanitizeFilter(setData.routine_exercise_id);
    const sanitizedDate = sanitizeFilter(setData.date);
    const setNum = setData.set_number;

    const existingRecord = await pb.collection('set_results').getFirstListItem(
      `routine_exercise_id = "${sanitizedExId}" && date = "${sanitizedDate}" && set_number = ${setNum}`
    ).catch(() => null);

    const payload = {
      routine_exercise_id: setData.routine_exercise_id,
      date: setData.date,
      set_number: setData.set_number,
      completed_reps: setData.completed_reps !== '' ? parseInt(String(setData.completed_reps), 10) : 0,
      weight_used: setData.weight_used !== '' ? parseFloat(String(setData.weight_used)) : 0,
      weight_unit: setData.weight_unit || 'kg',
      actual_rir: parseInt(String(setData.actual_rir || 2), 10),
      completed: setData.completed === true
    };

    if (existingRecord) {
      const updated = await pb.collection('set_results').update(existingRecord.id, payload);
      return updated as unknown as ExerciseSetResult;
    } else {
      const created = await pb.collection('set_results').create(payload);
      return created as unknown as ExerciseSetResult;
    }
  } catch (e) {
    console.error('[API:saveSetResult] Failed to persist set result in PocketBase:', e);
    return null;
  }
}

export async function createAndReplicatePlan({
  clientId,
  planName,
  startDateStr,
  endDateStr,
  selectedDaysOfWeek,
  dayRoutinesConfig
}: {
  clientId: string;
  planName: string;
  startDateStr: string;
  endDateStr: string;
  selectedDaysOfWeek: number[];
  dayRoutinesConfig: Record<number, DayRoutineConfig>;
}): Promise<ClientPlan> {
  const pb = getPocketBaseClient();
  try {
    const planRecord = await pb.collection('client_plans').create({
      client_id: clientId,
      plan_name: planName,
      start_date: startDateStr,
      end_date: endDateStr
    });

    const datesToReplicate = generateReplicatedDates(startDateStr, endDateStr, selectedDaysOfWeek);

    for (const item of datesToReplicate) {
      const dayOfWeek = item.dayOfWeek;
      const dateIso = item.dateStr;
      const config = dayRoutinesConfig[dayOfWeek];

      if (!config) continue;

      const routineRecord = await pb.collection('routines').create({
        plan_id: planRecord.id,
        client_id: clientId,
        date_iso: dateIso,
        routine_name: config.routineName || 'Rutina del Día',
        muscle_groups: config.muscleGroups || []
      });

      if (config.exercises && config.exercises.length > 0) {
        for (let idx = 0; idx < config.exercises.length; idx++) {
          const ex = config.exercises[idx];
          await pb.collection('routine_exercises').create({
            routine_id: routineRecord.id,
            exercise_id: ex.exercise_id,
            target_sets: parseInt(String(ex.target_sets || 3), 10),
            target_reps: String(ex.target_reps || '10-12'),
            target_rir: parseInt(String(ex.target_rir || 2), 10),
            target_rest_sec: parseInt(String(ex.target_rest_sec || 90), 10),
            target_weight: parseFloat(String(ex.target_weight || 0)),
            weight_unit: ex.weight_unit || 'kg',
            sort_order: idx + 1
          });
        }
      }
    }

    showToast(`Plan "${planName}" creado y replicado en ${datesToReplicate.length} días.`, 'success');
    return planRecord as unknown as ClientPlan;
  } catch (e) {
    console.error('[API:createAndReplicatePlan] Failed to replicate plan:', e);
    showToast('Error al crear y replicar el plan de entrenamiento', 'error');
    throw e;
  }
}

export async function getClientPlans(clientId: string): Promise<ClientPlan[]> {
  const pb = getPocketBaseClient();
  try {
    const sanitizedId = sanitizeFilter(clientId);
    const list = await pb.collection('client_plans').getFullList({
      filter: `client_id = "${sanitizedId}"`,
      sort: '-created'
    });
    return list as unknown as ClientPlan[];
  } catch (e) {
    console.error('[API:getClientPlans] Failed to fetch client plans from PocketBase:', e);
    return [];
  }
}

export async function updateExerciseSortOrder(routineId: string, exercisesList: RoutineExercise[]): Promise<boolean> {
  const pb = getPocketBaseClient();
  try {
    for (let idx = 0; idx < exercisesList.length; idx++) {
      const item = exercisesList[idx];
      await pb.collection('routine_exercises').update(item.id, {
        sort_order: idx + 1
      });
    }
    return true;
  } catch (e) {
    console.error('[API:updateExerciseSortOrder] Failed to update exercise sort order:', e);
    return false;
  }
}
