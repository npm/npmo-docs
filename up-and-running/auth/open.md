# Open Authentication

If you do not need authentication or authorization at all (for example, you're
only running npm Enterprise inside your firewalled, private network), you can
configure npm Enterprise to accept whatever credentials users log in with, and
allow everyone access to everything.

In order to do so, visit npm Enterprise's admin console, and choose the `Open` authentication strategy.

The npm CLI will still require that you log in in order to publish
packages, but you can just log in with any credentials (although the
username you input will be inserted into the package document - for
example in the `maintainers` field).
