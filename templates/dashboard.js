function dashboard(user) {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles/style.css" />
    <title>Base node Server</title>
  </head>
  <body>
    <nav class="top-nav">
      <div class="nav-header-container">
        <h1 class="nav-brand">BnS</h1>
        <h2 class="nav-username">${user.username}</h2>
      </div>
      <div class="nav-links-container">
        <a href="#" class="nav-link">Blog</a>
        <a href="#" class="nav-link">Media</a>
        <a href="#" class="nav-link">Log out</a>
      </div>
    </nav>
    <section class="content">
      <div class="center-container"></div>
    </section>
    <footer>
      <p>&copy All rights reserved to Base node Server</p>
    </footer>
  </body>
</html>`;
}

module.exports = { dashboard };
