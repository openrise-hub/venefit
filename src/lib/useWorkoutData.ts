import useSWR from 'swr';
import { getRoutineForDay, getClients, getClientPlans } from './api';
import { Client, ClientPlan, DayRoutine, RoutineExercise } from '../types';

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
    exercisesList: data ? (data.exercises || []) : [],
    isLoading,
    isError: error,
    mutate
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
    clients: data || [],
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
    plans: data || [],
    isLoading,
    isError: error,
    mutatePlans: mutate
  };
}
