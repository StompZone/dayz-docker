#!/usr/bin/env bash

trap '
	echo "Caught signal, shutting down."
	exit 0
' SIGTERM SIGINT

# Set PS1 so we know we're in the container
cat > .bashrc <<EOF
alias ls='ls --color'
export PS1='\[\033[01;35m\]\u@dayzdockerserver\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;33m\]\\[\033[00m\]\$ '
EOF

# Block the container from exiting
tail -f /dev/null &
wait $!