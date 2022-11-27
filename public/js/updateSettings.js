import { showAlert } from './alerts';

export async function updateData(name, email) {
  try {
    console.log({ name }, { email });
    const req = await fetch(
      'http://127.0.0.1:3000/api/v1/users/updateMe',
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
        }),
      },
    );
    const res = await req.json();
    if (res.status === 'success') {
      showAlert('success', 'Your update completed');
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
