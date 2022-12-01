import { showAlert } from './alerts';

export async function logout() {
  try {
    const res = await fetch('/api/v1/users/logout');
    // console.log(res);
    if (res.status === 200) location.assign('/').reload(true);
    return;
  } catch (error) {
    showAlert('error', 'Error logging out! try again');
  }
}
