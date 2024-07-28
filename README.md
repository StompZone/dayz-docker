# DayZDockerServer

A Linux [DayZ](https://dayz.com) server orchestration tool in a [Docker](https://docs.docker.com/) container.

## Features 

* [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) integration for installing the DayZ server and mods.
* A web UI for logging into Steam, managing server files and mods, and provisioning and running servers.
* Seamless integrations for many popular mods. Many require XML/JSON modifications or additions to the game files to work properly. See [files/mods/README.md](./files/mods/README.md) for a list of supported mods.
* Base server files are restored to their upstream state before every server start and all mod integrations are re-applied at that time. This allows for seamless upgrades when the server files are updated (as long as XML schema doesn't change, which is rare).
* Everything runs in Docker containers. Docker volumes are used to persist data. The web tool is the main container, which orchestrates server containers, however many your machine can handle.
* Shared docker volumes. All servers share the server files and mod volumes. Avoids duplication of many gigs of files. Updates are faster as there is only one copy.

## Build and Run

Ensure [Docker](https://docs.docker.com/engine/install/) and [Docker compose](https://docs.docker.com/compose/install/) and [git](https://git-scm.com/) are properly installed. Make sure you're running these commands as your user, in your home directory, not as root.

Clone the repo, and change into the newly created directory:

```shell
git clone https://ceregatti.org/git/daniel/dayzdockerserver.git
cd dayzdockerserver
```

```shell
Build the Docker image and bring the stack up in the background:

```shell
docker compose up --build -d
```

Tail the log to see when the web UI is ready, and get the URL and password:

```shell
docker compose logs -f web
```

Hit control c to exit the log. Go to the URL shown in the log.

## Web UI

Once at the web UI, you will be prompted to set a username and password for the web tool. Once done, a form will be presented to log into Steam. Downloading DayZ server files and mods using `steamcmd` requires a Steam account with DayZ in the library. The values will be first used by the `steamcmd` command line to perform a one-time login to Steam, and when successful, create a session that requires only that the username be saved locally. This supports Steam Guard codes. Neither the password nor the code will be stored. Subsequent calls to `steamcmd` by the web container will not require the credentials again until the session expires, which may be many months.

After a successful login to Steam, the server files will automatically start downloading. The web UI will show the main page, which will list the progress of the download. The server files are about 3GB.

### Main Page

### Installing workshop mods

### Provisioning servers

## Linux Server Caveats

* Some mods are known to crash the server on startup or when a player connects:
  * [DayZ Expansion AI](https://steamcommunity.com/sharedfiles/filedetails/?id=2792982069)
  * [Survivor Animations](https://steamcommunity.com/sharedfiles/filedetails/?id=2918418331)
  * [Red Falcon Flight System Heliz](https://steamcommunity.com/workshop/filedetails/?id=2692979668) - Bug report [here](https://feedback.bistudio.com/T176564)
    * All these mods are like due to the same underlying bug.
* Some mods work, but have bugs:
  * [DayZ Expansion Groups](https://steamcommunity.com/sharedfiles/filedetails/?id=2792983364)
    * The save file becomes corrupted and when the server restarts so the changes do not persist.
* There are other bugs:
  * [Server doesn't stop with SIGTERM](https://feedback.bistudio.com/T170721)

## TODO

* Add CF tools
* Support for experimental servers.
* Rootless Docker