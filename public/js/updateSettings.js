import { showAlert } from './alerts';
import { HOST } from './hostUrl';

/**
 *
 * @param {{email,name}|| {password,newPassword,newPasswordConfirm}} data
 * @param {'password' || 'data'} type
 */
export async function updateSettings(data, type) {
  try {
    let options = { method: 'PATCH' };
    const url =
      type === 'data'
        ? `${HOST}/api/v1/users/updateMe`
        : `${HOST}/api/v1/users/updateMyPassword`;
    if (type === 'data') {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
    }
    const req = await fetch(url, options);
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
