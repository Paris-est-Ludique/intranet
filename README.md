# <b>Intranet of the <i>Paris est Ludique</i> board game festival.</b>

<i>This is the intranet used by the volunteers of the assosication Paris est Ludique.</i><br>
It is built from the boilerplate [React Cool Starter](https://github.com/forceoranj/intranet), on the top of [React](https://facebook.github.io/react), [Redux](https://github.com/reactjs/redux), [React Router](https://reacttraining.com/react-router) and [Express](https://expressjs.com).

## Requirements

-   [node](https://nodejs.org/en) >= 12.0
-   [npm](https://www.npmjs.com) >= 6.0

## Getting Started

**1. You can start by cloning the repository on your local machine by running:**

```sh
git clone https://github.com/forceoranj/intranet.git
cd intranet
```

**2. Install all of the dependencies:**

```sh
yarn
```

**3. Start to run it:**

```sh
yarn dev  # Build, hosts, and hot reload saved modifications
```

Now the app should be running at [http://localhost:3000](http://localhost:3000)

## File editors

Edit files with one of these HTML/CSS/TypeScript editors:

-   [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/ide-typescript)
-   [Visual Studio Code](https://code.visualstudio.com/)
-   [Webstorm 2018.1](https://www.jetbrains.com/webstorm/download/)
-   [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

## Script Commands

I use [cross-env](https://github.com/kentcdodds/cross-env) to set and use environment variables across platforms. All of the scripts are listed as following:

| `yarn <script>`  | Description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| `dev`            | Runs your app on the development server at `localhost:3000`. HMR will be enabled.  |
| `dev:build`      | Bundles server-side files in development mode and put it to the `./public/server`. |
| `start`          | Runs your app on the production server only at `localhost:8088`.                   |
| `build`          | Bundles both server-side and client-side files.                                    |
| `build:server`   | Bundles server-side files in production mode and put it to the `./public/server`.  |
| `build:client`   | Bundles client-side files in production mode and put it to the `./public/assets`.  |
| `analyze:server` | Visualizes the bundle content of server-side.                                      |
| `analyze:client` | Visualizes the bundle content of client-side.                                      |
| `lint`           | Lints all `.tsx?`, `.jsx?` and `.scss` files.                                      |
| `lint:code`      | Lints all `.tsx?` and `.jsx?` files (With `--fix` to auto fix eslint errors).      |
| `lint:type`      | Runs type checking for `.tsx?` files.                                              |
| `lint:style`     | Lints all `.scss` files (With `--fix` to auto fix stylelint errors).               |
| `lint:format`    | Formats all files except the file list of `.prettierignore`.                       |
| `test`           | Runs testing.                                                                      |
| `test:watch`     | Runs an interactive test watcher.                                                  |
| `test:cov`       | Runs testing with code coverage reports.                                           |
| `test:update`    | Updates jest snapshot.                                                             |

## App Structure

Here is the structure of the app, which serves as generally accepted guidelines and patterns for building scalable apps.

```
.
├── public                        # Express server static path and Webpack bundles output
│   ├── favicon.ico               # App favicon
│   ├── logo192.png               # App logo small
│   ├── logo512.png               # App logo large
│   └── manifest.json             # App favicon and logo manifest
├── src                           # App source code
│   ├── config                    # App configuration by environments
│   │   ├── default.ts            # Default settings
│   │   ├── index.ts              # Configuration entry point
│   │   └── prod.ts               # Production settings (overrides the default)
│   ├── components                # Reusable components
│   ├── pages                     # Page components
│   ├── app                       # App root component
│   ├── store                     # Redux store creator, actions + reducers (a.k.a slice)
│   ├── services                  # API calls
│   ├── utils                     # App-wide utils (e.g. mock store creator for testing etc.)
│   ├── static                    # Static assets (e.g. images, fonts etc.)
│   ├── theme                     # App-wide style and vendor CSS framework
│   ├── types                     # App-wide type definitions
│   ├── client                    # App bootstrap and rendering (Webpack entry)
│   ├── routes                    # Routes configuration for both client-side and server-side
│   └── server                    # Express server (with Webpack dev and hot middlewares)
├── webpack                       # Webpack configurations
├── jest                          # Jest configurations
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.js             # PostCSS configuration
├── .eslintrc.js                  # ESLint configuration
├── .stylelintrc.js               # stylelint configuration
└── nodemon.json                  # nodemon configuration
```

## Contributors ✨

Thanks goes to these people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.parisestludique.fr"><img src="https://avatars1.githubusercontent.com/u/79382808?v=4" width="100px;" alt=""/><br /><sub><b>pikiou</b></sub></a><br /><a href="https://github.com/forceoranj/intranet/commits?author=pikiou" title="Code">💻</a> <a href="https://github.com/forceoranj/intranet/commits?author=pikiou" title="Documentation">📖</a> <a href="#maintenance-forceoranj" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
