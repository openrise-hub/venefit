import useSWR from 'swr';
import { getRoutineForDay, getClients, getClientPlans } from './api';

export function useRoutineForDay(clientId, dateStr) {
  const key = clientId && dateStr ? `routine/${clientId}/${dateStr}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getRoutineForDay(clientId, dateStr),
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
  const { data, error, isLoading, mutate } = useSWR(
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

export function useClientPlansList(clientId) {
  const key = clientId ? `plans/${clientId}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => getClientPlans(clientId),
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
