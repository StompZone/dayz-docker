FROM debian:bookworm-slim

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install only the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    nano \
    procps \
    steamcmd

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
