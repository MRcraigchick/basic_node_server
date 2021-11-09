function signUpError(user, error) {
  const top = error.top !== '' ? `<div class="error">${error.top}</div>` : '';
  const email = error.email !== '' ? `<div class="error">${error.email}</div>` : '';
  const username = error.username !== '' ? `<div class="error">${error.username}</div>` : '';
  const password = error.password !== '' ? `<div class="error">${error.password}</div>` : '';

  if (user.email.includes('%40')) {
    user.email = user.email.split('%40').join('@');
  }
  if (error.top !== '') {
    user.email = '';
    user.username = '';
    user.password = '';
  }
  if (error.email !== '') {
    user.email = '';
  }
  if (error.username !== '') {
    user.username = '';
  }
  if (error.password !== '') {
    user.password = '';
  }

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link type="text/css" rel="stylesheet" href="styles/style.css" />
    <title>BnS login</title>
  </head>
  <body>
    <header class="heading">
      <h1 class="main-header">Base node Server</h1>
      <h2>Sign up</h2>
    </header>
    ${top}
    <section class="content">
      <form class="auth-form" action="/loginuser" method="post">
        <label class="form-label" for="email">Email</label>
        <input class="form-input" name="email" type="text" value="${user.email}" />
        ${email}
        <label class="form-label" for="username">Username</label>
        <input class="form-input" name="username" type="text" value="${user.username}" />
        ${username}
        <label class="form-label" for="password">Password</label>
        <input class="form-input" name="password" type="password" value="${user.password}"/>
        ${password}
        <button class="form-submit-btn" type="submit">Submit</button>
      </form>
    </section>
    <footer>
      <p class="lower-msg">Don't have an account?<a class="lower-link" href="/signup"> Click here to sign up</a></p>
      <a class="lesser-lower-link" href="/">Or return to homepage</a>
    </footer>
  </body>
</html>
  `;
}

module.exports = { signUpError };
