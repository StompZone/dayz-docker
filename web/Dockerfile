FROM debian:bookworm-slim AS download

# Install _only_ the necessary packages to download the .net SDK and Steamworks .net SDK
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    ca-certificates \
    wget \
    unzip

# Download dotnet SDK to build the steam API client
RUN cd /tmp && \
    wget -q https://dotnetcli.azureedge.net/dotnet/Sdk/8.0.303/dotnet-sdk-8.0.303-linux-x64.tar.gz

# Download the Steamworks .net package
RUN cd /tmp && \
    wget -q https://github.com/rlabrecque/Steamworks.NET/releases/download/20.2.0/Steamworks.NET-Standalone_20.2.0.zip

# Extract the dotnet SDK
RUN cd /usr/local && \
    mkdir -p dotnet && \
    cd dotnet && \
    tar xfz /tmp/dotnet-sdk-8.0.303-linux-x64.tar.gz

# Extract the Steamworks .net SDK
RUN mkdir -p /usr/local/steamworks.net && \
    cd /usr/local/steamworks.net && \
    unzip /tmp/Steamworks.NET-Standalone_20.2.0.zip

# Add bercon https://github.com/WoozyMasta/bercon
RUN wget -q https://github.com/WoozyMasta/bercon/releases/download/1.0.0/bercon \
    && chmod +x bercon \
    && mv bercon /usr/bin

# Install nodejs
RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.20.4

# Install nvm with node and npm
RUN wget -O - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

FROM debian:bookworm-slim AS build

COPY --from=download /usr/local/dotnet /usr/local/dotnet

RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    libicu72 \
    libssl3

# Disable MS telemetry
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# Build the steam API client
COPY client /usr/local/client

#RUN cd /usr/local/client && \
#    /usr/local/dotnet/dotnet build -c Release

FROM debian:bookworm-slim

COPY --from=download /usr/local/dotnet /usr/local/dotnet

COPY --from=download /usr/local/steamworks.net /usr/local/steamworks.net

COPY --from=download /usr/bin/bercon /usr/bin/bercon

COPY --from=download /usr/local/nvm /usr/local/nvm

COPY --from=build /usr/local/client/ /usr/local/client

ENV DOTNET_ROOT /usr/local/dotnet

# Add backports, contrib, and non-free
RUN sed -i /etc/apt/sources.list.d/debian.sources -e 's/Components: main/Components: main contrib non-free/g'

# Set debconf to run non-interactively and agree to the SteamCMD EULA
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections \
    && echo steam steam/question select "I AGREE" | debconf-set-selections \
    && echo steam steam/license note '' | debconf-set-selections \
    && dpkg --add-architecture i386

# Install _only_ the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    binutils \
    curl \
    git \
    gwenhywfar-tools \
    jq \
    libicu72 \
    libssl3 \
    libxml2-utils \
    locales \
    nano \
    procps \
    wget \
    rename \
    steamcmd \
    xmlstarlet \
    unzip

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# This was installed in the download stage
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION=18.20.4

ENV NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Steamcmd needs its path added, as it ends up in /usr/games.
# Our server script is bind mounted in /files in docker-compose.
ENV PATH=/usr/games:/files/bin:/web/bin:${PATH}

# Shut steamcmd up
RUN cd /usr/lib/i386-linux-gnu && ln -s /web/bin/steamservice.so

# Install node modules
COPY package* /

RUN cd / && npm i

# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user /serverfiles/mpmissions /serverfiles/steamapps/workshop/content /web && \
    chown -R user:user /home/user /serverfiles /web

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the web server
CMD ["start.sh"]
