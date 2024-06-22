FROM debian:bookworm-slim

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Set debconf to run non-interactively and agree to the SteamCMD EULA
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections \
    && echo steam steam/question select "I AGREE" | debconf-set-selections \
    && echo steam steam/license note '' | debconf-set-selections \
    && dpkg --add-architecture i386

# Add backports and contrib
RUN sed -i /etc/apt/sources.list.d/debian.sources -e 's/Components: main/Components: main contrib non-free/g'

# Install only the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    locales \
    nano \
    procps \
    steamcmd

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Add steamcmd to the PATH
ENV PATH="/usr/games:${PATH}"

# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user && \
    chown -R user:user /home/user

ADD --chown=user:user start.sh /usr/bin/start.sh

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the container
CMD ["start.sh"]
