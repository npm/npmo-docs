# Integrating with Travis CI

To integrate npm Enterprise with Travis CI, you need to generate a `.npmrc`
that knows about your npm Enterprise instance and its credentials:

## Option 1) Fetch your npm Enterprise secret token:

  Look in your `~/.npmrc` file, you will see an entry that looks something like this:

  `//registry.mycompany.com/:_authToken=[my-secret-token]`

  Copy `[my-secret-token]` somewhere safe.

  _Note: you should never make this token public._

## Option 2) Generate a deploy token:

  Rather than using `[my-secret-token]` from your `~/.npmrc` file, you may opt to
  generate a deploy token on npm Enterprise:

  1. `ssh` into your npm Enterprise server.
  2. run `npme manage-tokens generate`.
  3. copy this token, for use in the next step.

## Now that you have a token

1. on Travis CI, or your Travis Enterprise server, create an environment variable called
  `NPM_TOKEN` and set this equal to `[my-secret-token]`.
2. create a `.travis.yml` file in your project, that looks like this:

  ```yaml
  language: node_js
  node_js:
    - "node"
  before_install:
    - printf "@mycompany:registry=https://registry.mycompany.com/\n//registry.mycompany.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
  ```

  * **@mycompany**: should be the scope that you've chosen for yourself.
  * **`https://registry.mycompany.com`**: should be the full address of your private registry, including scheme and port.
  * **`registry.mycompany.com`**: should be the address of your private registry, including port.

That's all there is to it, when you kickoff builds on Travis it should now
be able to install modules from private npm Enterprise server.
