function signUpError(user, error) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link type="text/css" rel="stylesheet" href="styles/style.css" />
    <title>Sign up</title>
  </head>
  <body>
    <header>
      <h1 class="main-header">Base node Server</h1>
      <h2>Sign up</h2>
    </header>
    <div class="error">${error[1]}</div>
    <section class="content">
      <form class="auth-form" action="/newuser" method="post">
        <label class="form-label" for="email">Email</label>
        <input class="form-input" name="email" type="text" value="${
          error[0] === 'email' ? '' : user.email.split('%40').join('@')
        }" />
        <label class="form-label" for="username">Username</label>
        <input class="form-input" name="username" type="text" value="${error[0] === 'username' ? '' : user.username}"/>
        <label class="form-label" for="password">Password</label>
        <input class="form-input" name="password" type="password" value="${
          error[0] === 'password' ? '' : user.password
        }"/>
        <button class="form-submit-btn" type="submit">Submit</button>
      </form>
    </section>
    <footer>
      <p class="lower-msg">Have an account already?<a class="lower-link" href="/login"> Click here to login</a></p>
      <a class="lesser-lower-link" href="/">Or return to homepage</a>
    </footer>
    <script src="src/signup.js"></script>
  </body>
</html>
`;
}

module.exports = { signUpError };
