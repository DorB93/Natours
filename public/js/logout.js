import { showAlert } from './alerts';

export async function logout() {
  try {
    const res = await fetch(
      'http://127.0.0.1:3000/api/v1/users/logout',
    );
    console.log(res);
    if (res.status === 200) location.assign('/').reload(true);
    return;
  } catch (error) {
    showAlert('error', 'Error logging out! try again');
  }
}
