#!/usr/bin/env bash

# Set PS1 so we know we're in the container, should we exec into it.
cat > .bashrc <<EOF
alias ls='ls --color'
export PS1='\[\e]0;\u@\h: \w\a\]\${debian_chroot:+(\$debian_chroot)}\[\033[01;35m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;33m\]\$(parse_git_branch)\[\033[00m\]\$ '"
EOF

# Block the container from exiting
exec tail -f /dev/null