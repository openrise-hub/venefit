import useSWR from 'swr';
import { getRoutineForDay, getClients, getClientPlans, getWeekRoutines } from './api';
import { Client, ClientPlan, DayRoutine, RoutineExercise } from '../types';

const EMPTY_EXERCISES: RoutineExercise[] = [];
const EMPTY_CLIENTS: Client[] = [];
const EMPTY_PLANS: ClientPlan[] = [];

export function useRoutineForDay(clientId?: string, dateStr?: string) {
  const key = clientId && dateStr ? `routine/${clientId}/${dateStr}` : null;

  const { data, error, isLoading, mutate } = useSWR<{ routine: DayRoutine; exercises: RoutineExercise[] } | null>(
    key,
    () => getRoutineForDay(clientId!, dateStr!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  return {
    routineData: data ? data.routine : null,
    exercisesList: data && data.exercises ? data.exercises : EMPTY_EXERCISES,
    isLoading,
    isError: error,
    mutate
  };
}

export function useWeekRoutinesList(clientId?: string, dateStrings?: string[]) {
  const sortedDates = dateStrings && dateStrings.length > 0 ? [...dateStrings].sort().join(',') : null;
  const key = clientId && sortedDates ? `week_routines/${clientId}/${sortedDates}` : null;

  const { data, error, isLoading, mutate } = useSWR<Record<string, { routine: DayRoutine; exercises: RoutineExercise[] } | null>>(
    key,
    () => getWeekRoutines(clientId!, dateStrings!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  return {
    weekData: data || {},
    isLoading,
    isError: error,
    mutateWeek: mutate
  };
}

export function useClientsList() {
  const { data, error, isLoading, mutate } = useSWR<Client[]>(
    'clients/list',
    () => getClients(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  );

  return {
    clients: data || EMPTY_CLIENTS,
    isLoading,
    isError: error,
    mutateClients: mutate
  };
}

export function useClientPlansList(clientId?: string) {
  const key = clientId ? `plans/${clientId}` : null;

  const { data, error, isLoading, mutate } = useSWR<ClientPlan[]>(
    key,
    () => getClientPlans(clientId!),
    {
      revalidateOnFocus: false
    }
  );

  return {
    plans: data || EMPTY_PLANS,
    isLoading,
    isError: error,
    mutatePlans: mutate
  };
}
