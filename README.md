# DayZDockerServer

A Linux [DayZ](https://dayz.com) server in a [Docker](https://docs.docker.com/) container.

The goal is to provide a vanilla DayZ server that can be spun up with as little as a machine running Linux with Docker and Docker Compose Plugin installed.

## Features

This branch is called `simple`, because that's the intent: To keep things simple:

* One container. The server runs in the same container used to manage it.
* One local bind mount. All files are stored in a directory on the host machine.
* No root requirement. The container and its files are owned by the host user and kept entirely in that user's home directory.
* Everything is left to the user to run by hand using commands similar to the official documentation.

## Configure and Build

Ensure [Docker](https://docs.docker.com/engine/install/) and [Docker compose plugin](https://docs.docker.com/compose/install/) are installed.

Clone the repo, and change into the newly created directory, and check out the `simple` branch:

```shell
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
git checkout simple
```

Create a `.env` file that contains your user id. The output of `id` has it:

```shell
echo "export USER_ID=$(id)" | tee .env
```

Build the Docker image and bring the container up in the background:

```shell
docker compose up -d --build
```

This will bring up a single container where the server will run.

## Usage

Everything is done in a shell inside the running container. All commands are run from this shell. Invoke the shell with:

```shell
docker compose exec dayz bash
```

A custom prompt will indicate when you are in the container. The prompt will look like this:

```
user@dayzdockerserver:~ $
```

### Steam Integration

Use [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) to login:

```docker
steamcmd +login 'MySteamLogin' +quit
```

Follow the prompts for the password and Steam Guard code. This process will wait indefinitely until both are entered. Once logged in, this process will not need to be repeated as long as the same username is used for the +login argument and the host directory containing the files is not deleted.

## Install

The base server files must be installed before the server can be run:

```docker
steamcmd +login 'MySteamLogin' +force_install_dir /home/user/dayz/serverfiles +app_update 223350 validate +quit
```

This will download about 2.9G of files.

## Setup

Edit the server config file. One way is to do it within the container using the `nano` editor, the only one installed in the container:

```docker
nano /home/user/dayz/serverfiles/serverDZ.cfg
```

Another option is to edit it directly on the host, as at this point that file is also available there:

```shell
${EDITOR} ~/dayzdockerserver/serverfiles/serverDZ.cfg
```
Set the values of any variables there. See the [documentation](https://forums.dayz.com/topic/239635-dayz-server-files-documentation/) if you want, but most of the default values are fine. At the very least, change the server name:

```
hostname = "My Cool Server";   // Server name
```

## Start

Start the server:

```docker
cd /home/user/dayz/serverfiles
./DayZServer_x64 -config=serverDZ.cfg
```

## Stop

```docker
# Hit control c to stop the server in the shell where it's running in the foreground.
```

Otherwise, open a new shell in the container and kill the process:

```docker
