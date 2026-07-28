import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || window.location.origin;

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

export function isTrainerAuthenticated() {
  const pb = getPocketBaseClient();
  return Boolean(pb && pb.authStore.isValid);
}

export async function loginTrainer(email, password) {
  const pb = getPocketBaseClient();
  return await pb.collection('users').authWithPassword(email, password);
}

export async function registerTrainer(email, password, name = '') {
  const pb = getPocketBaseClient();
  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    name: name.trim() || email.split('@')[0]
  });

  await loginTrainer(email, password);
  return user;
}

export function logoutTrainer() {
  const pb = getPocketBaseClient();
  if (pb) pb.authStore.clear();
}

export function subscribeAuthChange(callback) {
  const pb = getPocketBaseClient();
  if (pb) {
    return pb.authStore.onChange((token, model) => {
      callback(model);
    });
  }
  return () => {};
}
