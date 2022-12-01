import { showAlert } from './alerts';
export async function login(email, password) {
  try {
    const req = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    // console.log({ req });
    const res = await req.json();
    // console.log({ res });
    if (res.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    } else {
      throw res;
    }
  } catch (err) {
    // console.log({ err });
    console.log(`response ${err.response} `);
    showAlert('error', err.message);
  }
}
