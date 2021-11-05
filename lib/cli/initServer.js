const { exec } = require('child_process');

const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

const env = process.argv[2];
const HOST = process.argv[3];
const PORT = process.argv[4];
const protocol = process.argv[5] === undefined ? 'http' : process.argv[5];

`
You must first install this module into your applications directory.
Then edit your package.json "start:" script to run this module with the arguments
eg: 

{ 
  "scripts":{
      "start": "node lib/cli/initServer.js dev localhost 8000"
  }
}

Then just run npm start in the terminal. 

In the development environment the command will open the browser at the specified
host address and port number.

If yo want to enter the commands arguments manually in the termianl it accepts the following:
    1: Enviroment to run in -> values = {
        dev : development environment (must have nodemon installed globally),
        prod : production environment (starts the server in the node.js shell)
    }
    2: HOST or address that the server is running from
    3: PORT number that the server is running on
    4: protocol ( OPTIONAL -> defaults to http ) 

,
`;

if (env === undefined) {
  console.error(
    `
    [ NO ENV ]: Please specify an environment as a command argument, 
    -----------------------------------------------------------------
    <-- Accepted arguments are --> 
    {
        dev : development environment (must have nodemon installed globally),
        prod : production environment (starts the server in the node.js shell)
    }
    `
  );
  process.exit(0);
}
if (HOST === undefined || PORT === undefined) {
  console.error(
    `
    [ HOST AND PORT ERROR ]: You must specify a HOST address and a PORT number
    `
  );
  process.exit(0);
}

const startServer = new Promise((resolve, reject) => {
  let monitor = null;
  let command = null;
  process.env.HOST = HOST;
  process.env.PORT = PORT;
  if (env === 'dev') {
    monitor = 'nodemon';
    process.env.NODE_ENV = 'development';
  } else if (env === 'prod') {
    monitor = 'node';
    process.env.NODE_ENV = 'production';
  }

  if (process.platform === WINDOWS_PLATFORM) {
    command = `start ${monitor} app.js`;
  } else if (process.platform === MAC_PLATFORM) {
    command = `open -a ${monitor} app.js`;
  } else {
    command = `${monitor} app.js`;
  }
  resolve(exec(`${command}`));
});

startServer
  .then(() => console.log('Starting server....'))
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      `Starts up browser running in development environment`;

      let command = null;
      if (process.platform === WINDOWS_PLATFORM) {
        command = `start chrome ${protocol}://${process.env.HOST}:${process.env.PORT}`;
      } else if (process.platform === MAC_PLATFORM) {
        command = `open -a chrome ${protocol}://${process.env.HOST}:${process.env.PORT}`;
      } else {
        command = `chrome ${protocol}://${process.env.HOST}:${process.env.PORT}`;
      }

      console.log(`Opening Google Chrome browser at URL: ${protocol}://${process.env.HOST}:${process.env.PORT} ...`);
      exec(command);
    }
  })
  .catch((error) =>
    console.log(`
  Failed to start server:${error}
  `)
  );
