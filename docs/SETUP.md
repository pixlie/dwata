# Setup Dwata from sources

Note: I assume that we have some experience with running Git, Node.js (`npm` or `yarn` or `pnpm`) and similar commands on our terminals.

## Software needed

Dwata is built with Tauri, which is:

> Tauri is a framework for building tiny, fast binaries for all major desktop and mobile platforms. Developers can integrate any frontend framework that compiles to HTML, JavaScript, and CSS for building their user experience while leveraging languages such as Rust, Swift, and Kotlin for backend logic when needed.

[From: What is Tauri?](https://v2.tauri.app/start/)

To setup Dwata, we need Rust and Node.js setup locally. Rust can be installed using rustup (please check if we already have Rust installed):

[rustup](https://rustup.rs/)

Node.js can be installed using (please check if we already have Node.js installed):

[Node.js](https://nodejs.org/en/download/package-manager)

After this, we will need `pnpm`, which is a package manager for Node.js:

[pnpm](https://pnpm.io/installation)

we will also need Git:

[Git](https://git-scm.com/downloads)

## Clone the repository

I will use a dedicated directory where I store all my projects. We may create one for our needs or use our home folder. Open the terminal and clone the Dwata repository using:

Note: `~`, tilde, means home folder on Linux, please change as we need.

```
cd ~/Projects
git clone git@github.com:brainless/dwata.git
```

## Setup dwata related dependencies

Once we have cloned, we can change into this directory and installed needed dependencies.

Assuming we are in the Projects or similar folder where we ran the previous commands:

```
cd dwata
pnpm install
```

## Run the project

Once we have installed the dependencies, then we can run the project in development mode like this:

```
pnpm tauri dev
```

This will run the project in development mode. Documentation will soon be updated to build the app in release mode once we are ready.
