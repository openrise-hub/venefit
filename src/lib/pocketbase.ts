import PocketBase from 'pocketbase';
import { TrainerUser } from '../types';
import { DEMO_TRAINER, initDemoStorage, DemoSeedMode } from './demoData';

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
  if (isDevSession()) {
    return DEMO_TRAINER;
  }
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
  if (isDevSession()) return true;
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

export function enableDevSession(mode: DemoSeedMode = 'populated') {
  const pb = getPocketBaseClient();
  initDemoStorage(true, mode);
  localStorage.setItem('venefit_dev_mode', 'true');
  pb.authStore.save('dev-token', {
    id: DEMO_TRAINER.id,
    collectionId: '_pb_users_auth_',
    collectionName: 'users',
    email: DEMO_TRAINER.email,
    name: DEMO_TRAINER.name,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  } as any);
}

export function logoutTrainer() {
  const pb = getPocketBaseClient();
  localStorage.removeItem('venefit_dev_mode');
  localStorage.removeItem('venefit_demo_seed_mode');
  pb.authStore.clear();
}

export function subscribeAuthChange(callback: (token: string, model: any) => void) {
  const pb = getPocketBaseClient();
  return pb.authStore.onChange(callback);
}
