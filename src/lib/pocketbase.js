import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

let pbInstance = null;

export function getPocketBaseClient() {
  if (!pbInstance) {
    pbInstance = new PocketBase(pbUrl);
    pbInstance.autoCancellation(false);
  }
  return pbInstance;
}

export function getCurrentTrainer() {
  const pb = getPocketBaseClient();
  return pb && pb.authStore.isValid ? pb.authStore.model : null;
}

export async function loginTrainer(email, password) {
  const pb = getPocketBaseClient();
  return await pb.collection('users').authWithPassword(email, password);
}

export function logoutTrainer() {
  const pb = getPocketBaseClient();
  if (pb) pb.authStore.clear();
}
