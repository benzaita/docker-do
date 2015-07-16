# docker-do

    $ ls Dockerfile
    Dockerfile
    $ do 'echo Hi from Docker conatiner $HOSTNAME'
    Sending build context to Docker daemon 3.072 kB
    Sending build context to Docker daemon 
    Step 0 : FROM ubuntu:14.04
     ---> 6d4946999d4f
    ...
    ...
    Successfully built ab2d56f2dace
    Hi from Docker conatiner 02825e0e3a81
    $ do 'echo Hi from Docker conatiner $HOSTNAME'
    Hi from Docker conatiner 19807cd744fc

## Sample Use-Case

Create a `Dockerfile` that encapsulates your build environment, e.g.:

    $ cat Dockerfile
    FROM ubuntu:14.04
    
    RUN sudo apt-get update
    RUN sudo apt-get install -y gcc-arm-linux-gnueabihf
    RUN sudo apt-get install -y make
    
    ENV CROSS_COMPILE arm-linux-gnueabihf-
    
    VOLUME /workspace
    
    WORKDIR /workspace
    ENTRYPOINT ["/bin/sh", "-c"]

And then simply run this to build your source inside the build environment:

    $ do make
