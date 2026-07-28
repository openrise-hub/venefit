import { getPocketBaseClient, getCurrentTrainer } from './pocketbase';
import { generateReplicatedDates } from './utils';
import { showToast } from './toastStore';

function sanitizeFilter(value) {
  if (value == null) return '';
  return String(value).replace(/"/g, '\\"');
}

export async function getClients() {
  const pb = getPocketBaseClient();
  try {
    return await pb.collection('clients').getFullList({
      sort: '-created'
    });
  } catch (e) {
    console.error('[API:getClients] Failed to fetch clients list from PocketBase:', e);
    showToast('Error al obtener la lista de clientes', 'error');
    return [];
  }
}

export async function createClient(clientData) {
  const pb = getPocketBaseClient();
  try {
    const currentTrainer = getCurrentTrainer();
    const dataToInsert = {
      ...clientData,
      trainer: currentTrainer ? currentTrainer.id : ''
    };

    const client = await pb.collection('clients').create(dataToInsert);
    showToast('Cliente guardado exitosamente', 'success');
    return client;
  } catch (e) {
    console.error('[API:createClient] Failed to create client:', e);
    showToast('Error al registrar el cliente', 'error');
    throw e;
  }
}

export async function deleteClient(clientId) {
  const pb = getPocketBaseClient();
  try {
    await pb.collection('clients').delete(clientId);
    showToast('Cliente eliminado', 'success');
    return true;
  } catch (e) {
    console.error('[API:deleteClient] Failed to delete client:', e);
    showToast('Error al eliminar el cliente', 'error');
    throw e;
  }
}

export async function getExercises(selectedMuscleGroups = [], searchQuery = '') {
  const pb = getPocketBaseClient();
  try {
    let filterString = '';
    if (searchQuery.trim()) {
      filterString = `name ~ "${sanitizeFilter(searchQuery.trim())}"`;
    }

    const items = await pb.collection('exercises').getFullList({
      filter: filterString,
      sort: 'name'
    });

    let results = items || [];
    if (selectedMuscleGroups.length > 0) {
      results = results.filter(ex => {
        const groups = Array.isArray(ex.muscle_groups) ? ex.muscle_groups : [];
        return groups.some(mg => selectedMuscleGroups.includes(mg));
      });
    }

    return results;
  } catch (e) {
    console.error('[API:getExercises] Failed to fetch exercise library:', e);
    showToast('Error al cargar la biblioteca de ejercicios', 'error');
    return [];
  }
}

export async function getRoutineForDay(clientId, dateStr) {
  const pb = getPocketBaseClient();

  try {
    const safeClientId = sanitizeFilter(clientId);
    const safeDate = sanitizeFilter(dateStr);

    const routines = await pb.collection('plan_routines').getFullList({
      filter: `client = "${safeClientId}" && date = "${safeDate}"`
    });

    if (!routines || routines.length === 0) {
      return null;
    }

    const routine = routines[0];

    const routineExercises = await pb.collection('routine_exercises').getFullList({
      filter: `routine = "${sanitizeFilter(routine.id)}"`,
      sort: 'sort_order',
      expand: 'exercise'
    });

    let setResultsMap = {};

    if (routineExercises.length > 0) {
      const reIdFilters = routineExercises
        .map(re => `routine_exercise = "${sanitizeFilter(re.id)}"`)
        .join(' || ');

      const setResults = await pb.collection('daily_set_results').getFullList({
        filter: `date = "${safeDate}" && (${reIdFilters})`
      });

      setResults.forEach(sr => {
        if (!setResultsMap[sr.routine_exercise]) {
          setResultsMap[sr.routine_exercise] = {};
        }
        setResultsMap[sr.routine_exercise][sr.set_number] = sr;
      });
    }

    return {
      routine,
      exercises: routineExercises.map(re => ({
        ...re,
        exercise: re.expand ? re.expand.exercise : { name: 'Ejercicio' },
        setResults: setResultsMap[re.id] || {}
      }))
    };
  } catch (e) {
    console.error('[API:getRoutineForDay] Failed to fetch routine for day:', e);
    showToast('Error al cargar la rutina del día', 'error');
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
}) {
  const pb = getPocketBaseClient();
  const safeClientId = sanitizeFilter(clientId);

  try {
    const plan = await pb.collection('workout_plans').create({
      client: clientId,
      name: planName,
      start_date: startDateStr,
      end_date: endDateStr
    });

    const targetDates = generateReplicatedDates(startDateStr, endDateStr, selectedDaysOfWeek);

    for (const item of targetDates) {
      const dayOfWeek = item.dayOfWeek;
      const config = dayRoutinesConfig[dayOfWeek];
      if (!config || !config.exercises || config.exercises.length === 0) continue;

      let routine;
      const existingRoutines = await pb.collection('plan_routines').getFullList({
        filter: `client = "${safeClientId}" && date = "${sanitizeFilter(item.dateStr)}"`
      });

      if (existingRoutines && existingRoutines.length > 0) {
        routine = await pb.collection('plan_routines').update(existingRoutines[0].id, {
          plan: plan.id,
          routine_name: config.routineName || 'Rutina de Entrenamiento',
          muscle_groups: config.muscleGroups || []
        });
        const oldExs = await pb.collection('routine_exercises').getFullList({
          filter: `routine = "${sanitizeFilter(routine.id)}"`
        });
        await Promise.all(oldExs.map(old => pb.collection('routine_exercises').delete(old.id)));
      } else {
        routine = await pb.collection('plan_routines').create({
          plan: plan.id,
          client: clientId,
          date: item.dateStr,
          day_of_week: dayOfWeek,
          routine_name: config.routineName || 'Rutina de Entrenamiento',
          muscle_groups: config.muscleGroups || []
        });
      }

      await Promise.all(config.exercises.map((ex, index) =>
        pb.collection('routine_exercises').create({
          routine: routine.id,
          exercise: ex.exercise_id || ex.id,
          sort_order: index + 1,
          target_sets: parseInt(ex.target_sets || 3, 10),
          target_reps: String(ex.target_reps || '10-12'),
          target_rir: parseInt(ex.target_rir || 2, 10),
          target_rest_sec: parseInt(ex.target_rest_sec || 90, 10),
          target_weight: parseFloat(ex.target_weight || 0),
          weight_unit: ex.weight_unit || 'kg'
        })
      ));
    }

    showToast('Plan guardado y replicado con éxito', 'success');
    return plan;
  } catch (e) {
    console.error('[API:createAndReplicatePlan] Error replicating workout plan:', e);
    showToast('Error al crear y replicar el plan de entrenamiento', 'error');
    throw e;
  }
}

export async function updateExerciseSortOrder(routineId, reorderedExercises) {
  const pb = getPocketBaseClient();
  try {
    await Promise.all(
      reorderedExercises.map((ex, index) =>
        pb.collection('routine_exercises').update(ex.id, { sort_order: index + 1 })
      )
    );
    return true;
  } catch (e) {
    console.error('[API:updateExerciseSortOrder] Failed to reorder exercises:', e);
    showToast('Error al reordenar los ejercicios', 'error');
    return false;
  }
}

export async function saveSetResult({
  routine_exercise_id,
  date,
  set_number,
  completed_reps,
  weight_used,
  weight_unit,
  actual_rir,
  completed
}) {
  const pb = getPocketBaseClient();

  try {
    const filter = `routine_exercise = "${sanitizeFilter(routine_exercise_id)}" && date = "${sanitizeFilter(date)}" && set_number = ${parseInt(set_number, 10)}`;
    const existing = await pb.collection('daily_set_results').getFullList({ filter });

    const recordData = {
      routine_exercise: routine_exercise_id,
      date,
      set_number,
      completed_reps: parseInt(completed_reps || 0, 10),
      weight_used: parseFloat(weight_used || 0),
      weight_unit: weight_unit || 'kg',
      actual_rir: parseInt(actual_rir || 0, 10),
      completed: Boolean(completed)
    };

    let res;
    if (existing && existing.length > 0) {
      res = await pb.collection('daily_set_results').update(existing[0].id, recordData);
    } else {
      res = await pb.collection('daily_set_results').create(recordData);
    }

    if (completed) {
      showToast(`Serie ${set_number} registrada`, 'success');
    }
    return res;
  } catch (e) {
    console.error('[API:saveSetResult] Failed to save set result:', e);
    showToast('Error al guardar la serie ejecutada', 'error');
    throw e;
  }
}

export async function getClientPlans(clientId) {
  const pb = getPocketBaseClient();
  try {
    return await pb.collection('workout_plans').getFullList({
      filter: `client = "${sanitizeFilter(clientId)}"`,
      sort: '-created'
    });
  } catch (e) {
    console.error('[API:getClientPlans] Failed to fetch client plans:', e);
    showToast('Error al obtener los planes del cliente', 'error');
    return [];
  }
}
