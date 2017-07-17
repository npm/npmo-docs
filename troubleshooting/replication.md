# A Package Failed to Replicate

Occasionally, due to networking issues, npm Enterprise will
fail to replicate a version of a package that has been added to your mirror. This
can result in the following error message when installing:

```bash
npm ERR! Valid install targets:

npm ERR! 4.1.0, 4.0.9, 4.0.8, 4.0.7, 4.0.6, 4.0.5, 4.0.4, 4.0.3, 4.0.2, 4.0.1, 4.0.0, 3.2.0, 3.1.0, 3.0.0, 2.4.1, 2.4.0, 2.3.0, 2.2.1, 2.2.0, 2.1.0, 2.0.0
```

There are two approaches you can take to address this problem:

## Reindex the package that failed to replicate:

1. `ssh` into your npm Enterprise server.
2. Run the following commands:

   ```
   npme remove-package :pkg-name
   npme add-package :pkg-name
   ```

   This forces npm Enterprise to reindex the package and is the fastest way to get back up and running.

## Reindex _all_ the packages:

In the rare case that you would like to reindex all the packages mirrored by your npm Enterprise server, simply:

1. `ssh` into your npm Enterprise server.
2. Run the command, `npme reset-follower`.

_Note: our engineering team is working hard to make sure that this category of bug
 is eliminated in the future._
