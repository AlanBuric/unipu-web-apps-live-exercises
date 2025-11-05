# unipu-web-apps-live-exercises

This repository contains directories, each with their own backend and sometimes frontend. The backends are a Node.js
Express HTTP REST API written during class exercises or for homework solutions for the winter 2025 Web Applications
course at the Juraj Dobrila University in Pula's Faculty of Informatics.

**Professor's course:** https://github.com/lukablaskovic/FIPU-WA

## Technologies in use

- **JavaScript:** a fun and lightweight interpreted programming language
- **Node.js:** the runtime for JavaScript

### Development-time packages

- **TypeScript**: static typing and annotations for JavaScript for programming a safer runtime
- **ESLint:** finds code problems during static analysis of JavaScript-like files
- **Prettier:** configurable code formatter for everything JavaScript

### Runtime packages

- **Express:** HTTP REST API backend server that handles everything
- **express-validator:** various Express middleware validation functions
- **tsx:** allows running TypeScript files on top of Node.js
- **MongoDB:** NoSQL database
- **jsonwebtoken (JWT):** proposed Internet standard for encryption, mainly used for the access and refresh token protocol ([OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749))
- **dotenv:** loads secrets stored in `.env` files
- **Argon2:** latest hashing algorithm for hashing passwords (better than encrypting)
- **Vitest:** latest test runner

### Frontend packages

- **Vue.js:** the reactive web framework for websites that run in the browser, better than React in many ways
- **Vite:** the (best) bundler that boils down the aforementioned web framework into optimized (both in speed and memory) plain HTML, CSS and JavaScript that the browser can understand
- **Tailwind CSS:** a CSS framework that moves the writing of CSS files and blocks into atomic classes that are to be used in HTML element class lists
- **Pinia:** global data store management besides reactive variables and props
- **Vue Router:** lets you split your Vue.js Single Page Application (SPA) into pages with configurable routes

## Project structure guide

- most exercises will have the following `npm run` lifecycle scripts: `build`, `start`, `dev`, `test:dev` and
  `test:prod`,
- additional exercise descriptions are listed in the `package.json` file `description` properties, usually written in
  Croatian for the professors if they're grading my work
- make sure to install extensions for the development-time packages in your favorite IDE
