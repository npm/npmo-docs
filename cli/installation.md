# Installing the npm CLI

## npm works with npm Enterprise

npm Enterprise is a program called `npme` that runs on a server or VM
and is configured and maintained by the IT or Ops department at your
company.

In order for you and your development teams to use your npm Enterprise
instance, you'll need to install the npm Command Line Interface (CLI),
`npm`.

## npm ships with Node.js

npm ships with any install of Node. If you have Node on your
machine, you already have npm!

To test if you have Node, type:
```
node -v
```

To test if you have npm, type:
```
npm -v
```

## Use a Node Version Manager

We strongly recommend that you install Node with a version manager.
Here are the ones we know of and have used:

### OSX or Linux

- [nvm]
- [n]

### Windows

- [nodist]
- [nvm-windows]

Don't see your favorite Node version manager here? Please [file an issue]
so we can include it.

## Node Installers

Although we don't recommend it, you can also install Node (which comes with
npm) via installers.

### Node Installers

Link: https://nodejs.org/en/download/

### NodeSource

Link: https://github.com/nodesource/distributions

NodeSource has created and maintains binary distributions of io.js and Node for
multiple platforms. If you are on Linux we recommend that you use these.

[nvm]: https://github.com/creationix/nvm
[n]: https://github.com/tj/n
[nodist]: https://github.com/marcelklehr/nodist
[nvm-windows]: https://github.com/coreybutler/nvm-windows
[file an issue]: https://github.com/npm/npme-docs/issues
