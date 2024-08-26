#!/usr/bin/env bash

set -eE

trap '
	echo "Shutting down..."
' SIGINT SIGTERM

# Set PS1 so we know we're in the container
echo "Adding PS1 to .bashrc..."
cat > .bashrc <<EOF
alias ls='ls --color'
export PS1='${debian_chroot:+($debian_chroot)}\[\033[01;35m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
unset DEVELOPMENT
export PATH=${PATH}:/usr/local/dotnet
EOF

# Shut steamcmd up
if ! [ -d ${HOME}/.steam ]
then
	mkdir -p ${HOME}/.steam
fi

cd /web
if [ -n "${STEAMAPIKEY}" ]
then
	cat > env.json <<EOF
{
	"STEAMAPIKEY": "${STEAMAPIKEY}"
}
EOF
else
	echo "{}" > env.json
fi
#export DEBUG=express:*
npm run dev &
wait $!
