# Publishing Packages

Before you can publish a private module, you should follow the steps outlined in the [CLI Configuration] documentation.

To create a private module, all you need to do is initialize an npm module with the same
scope that you used while logging in:

1. create a folder with the name of your module, e.g., `my-test-module`.
2. run `npm init` specifying the scope you used while logging in:

  > `npm init --scope=@mycompany`

3. fill in information when prompted, to generate a package.json file.
4. write your module, and when you're ready simply type `npm publish`.

  > _Note: some auth strategies introduce additional requirements, e.g.,
    the [GitHub Strategy] requires that you populate the `repository`
    field in your package.json._

[CLI Configuration]: /cli/configuration.html
[GitHub Strategy]: /up-and-running/auth/github.md
