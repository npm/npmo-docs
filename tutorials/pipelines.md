# npm for Bitbucket Pipelines

[Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines) allows you to seamlessly connect your development project into a continuous integration system within the Bitbucket Cloud UI. Configuring your projects for Pipelines is easy: simply provide a `bitbucket-pipelines.yml` chosen from a list of common technologies.

## Working with private packages in the npm Registry

1. Use the `bitbucket-pipelines.yml` supplied in [this repository](https://bitbucket.org/benjamincoe/private-modules-demo/src).
2. Set the `NPM_TOKEN` environment variable (This token can be found in your local `~/.npmrc`, after you log in to the registry).
3. Enable pipelines

## Working with private packages in npm Enterprise

1. Use the `bitbucket-pipelines.yml` supplied in [this repository](https://bitbucket.org/benjamincoe/private-modules-demo/src).
2. Set the `NPM_TOKEN` environment variable (This token can be found in your local `~/.npmrc`, after you log in to the registry).
3. Set `NPM_REGISTRY_URL` to the full URL of your private registry (with scheme).
4. Enable pipelines.
