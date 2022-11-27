import { showAlert } from './alerts';

/**
 *
 * @param {{email,name}|| {password,newPassword,newPasswordConfirm}} data
 * @param {'password' || 'data'} type
 */
export async function updateSettings(data, type) {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
        : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';
    const req = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    const res = await req.json();
    if (res.status === 'success') {
      showAlert('success', `'Your ${type} update completed`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    } else {
      throw res;
    }
  } catch (err) {
    console.log(`response ${err.response} `);
    showAlert('error', err.message);
  }
}
