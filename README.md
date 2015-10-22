# docker-do

## What happens when I run `ddo COMMAND`?

* `ddo` runs `docker build` if necessary (the image wasn't built yet, or the Dockerfile has changed)
* `ddo` maps the working directory (where `Dockerfile` resides) to a volume
* `ddo` runs the `COMMAND` relative to the working directory using `docker run`

## Prerequisites

* `ddo` requires you have a `Dockerfile` somewhere up the tree
* `ddo` requires that `Dockerfile` to define `ENTRYPOINT ["/bin/sh", "-c"]`
* `ddo` assumes that `Dockerfile` defines `WORKDIR /workspace`
* `ddo` on OSX requires coreutils:

    `$ brew install coreutils`

## Sample Use-Case

Create a `Dockerfile` that encapsulates your build environment, e.g.:

    $ cat Dockerfile
    FROM ubuntu:14.04

    RUN sudo apt-get update && sudo apt-get install -y build-essentials
    ...
    ...

    VOLUME /workspace
    WORKDIR /workspace
    ENTRYPOINT ["/bin/sh", "-c"]

And then simply run this to build your source inside the build environment:

    ~/myproject $ cd build
	~/myproject/build $ ddo make
    ~/myproject/build $
    ddo: found Dockerfile in /home/benzaita/myproject
    ddo: running `docker build` in /home/benzaita/myproject
    Sending build context to Docker daemon 0.1 MB
    ...
    ...
    ddo: running `docker run`
    ...
    ...

## Passing Arguments to `docker run`

You can pass any argument to `docker run` by separating it from the command to run, e.g.:

    ddo make -- -v /path:/path

