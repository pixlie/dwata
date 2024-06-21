# Setup dwata from sources

Note: I assume that we have some experience with running Git, Node.js (`npm` or `yarn` or `pnpm`) and similar commands on our terminals.

## Software needed

dwata is built with Tauri, which is:

> Tauri is a framework for building tiny, fast binaries for all major desktop and mobile platforms. Developers can integrate any frontend framework that compiles to HTML, JavaScript, and CSS for building their user experience while leveraging languages such as Rust, Swift, and Kotlin for backend logic when needed.

[From: What is Tauri?](https://v2.tauri.app/start/)

To setup dwata, we need Rust and Node.js setup locally:

1. [rustup](https://rustup.rs/)
   Rust can be installed using rustup (please check if we already have Rust installed).

2. [Node.js](https://nodejs.org/en/download/package-manager)
   Node.js can be installed using (please check if we already have Node.js installed):

3. [pnpm](https://pnpm.io/installation)
   We will need `pnpm`, which is a package manager for Node.js.

4. [Git](https://git-scm.com/downloads)
   We will also need Git

## Clone the repository

I will use a dedicated directory where I store all my projects. We may create one for our needs or use our home folder. Open the terminal and clone the dwata repository using:

Note: `~` (tilde) means home folder on Linux/Mac OS, please change as per need.

```
cd ~/Projects
git clone git@github.com:brainless/dwata.git
git checkout beta
```

Note: We use the `beta` branch since the `main` branch may receive code changes daily, thereby it may be unstable while the `beta` branch will be generally steady.

## Setup dwata related dependencies

Once we have cloned, we can change into this directory and installed needed dependencies.

Assuming we have the Projects or similar folder where we ran the previous commands:

```
cd ~/Projects/dwata
pnpm install
```

## Run the project

Once we have installed the dependencies, then we can run the project in development mode like this:

```
pnpm tauri dev
```

This will run the project in development mode. Documentation will soon be updated to build the app in beta mode once we are ready.

## Get updates

Every once in a while we may want to get updates from the work that is being done on this project. We may use these commands:

```
cd ~/Projects/dwata
git pull
```

Note: This assumes we are still in the `beta` branch.
