# Publishing Packages

Before you can publish a private module, you should follow the steps outlined in the [CLI Configuration] documentation.

To create a private module, all you need to do is initialize an npm module with the same
scope that you used while logging in:

1. Create a folder with the name of your module, e.g., `my-test-module`.
2. Run `npm init` specifying the scope you used while logging in (see [Using npm Enterprise for Private Packages](/cli/configuration.md#option-2-using-enterprise-for-private-packages-only)):

  > `npm init --scope=@mycompany`

3. Fill in information when prompted to generate a package.json file.
4. Write your module. When you're ready, type `npm publish`.

  > _Note: some auth strategies introduce additional requirements, e.g.,
    the [GitHub Strategy] requires that you populate the `repository`
    field in your package.json._

[CLI Configuration]: /cli/configuration.html
[GitHub Strategy]: /up-and-running/auth/github.md
