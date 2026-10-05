import PocketBase from 'pocketbase';
import { TrainerUser } from '../types';

let pbInstance: PocketBase | null = null;

export function getPocketBaseClient(): PocketBase {
  if (!pbInstance) {
    const baseUrl = import.meta.env.VITE_POCKETBASE_URL || window.location.origin;
    pbInstance = new PocketBase(baseUrl);
    pbInstance.autoCancellation(false);
  }
  return pbInstance;
}

export function getCurrentTrainer(): TrainerUser | null {
  const pb = getPocketBaseClient();
  if (pb.authStore.isValid && pb.authStore.record) {
    return {
      id: pb.authStore.record.id,
      email: pb.authStore.record.email,
      name: pb.authStore.record.name
    };
  }
  return null;
}

export function isTrainerAuthenticated(): boolean {
  const pb = getPocketBaseClient();
  return pb.authStore.isValid;
}

export async function loginTrainer(email: string, pass: string) {
  const pb = getPocketBaseClient();
  return await pb.collection('users').authWithPassword(email, pass);
}

export async function registerTrainer(email: string, pass: string, name: string) {
  const pb = getPocketBaseClient();
  const user = await pb.collection('users').create({
    email,
    password: pass,
    passwordConfirm: pass,
    name
  });
  await loginTrainer(email, pass);
  return user;
}

export function isDevSession(): boolean {
  return localStorage.getItem('venefit_dev_mode') === 'true';
}

export function enableDevSession() {
  const pb = getPocketBaseClient();
  localStorage.setItem('venefit_dev_mode', 'true');
  pb.authStore.save('dev-token', {
    id: 'dev_trainer_001',
    collectionId: '_pb_users_auth_',
    collectionName: 'users',
    email: 'entrenador@demo.local',
    name: 'Entrenador (Modo Pruebas)',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  } as any);
}

export function logoutTrainer() {
  const pb = getPocketBaseClient();
  localStorage.removeItem('venefit_dev_mode');
  pb.authStore.clear();
}

export function subscribeAuthChange(callback: (token: string, model: any) => void) {
  const pb = getPocketBaseClient();
  return pb.authStore.onChange(callback);
}

