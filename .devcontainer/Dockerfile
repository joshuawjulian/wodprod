# .devcontainer/Dockerfile

# Start FROM the official Bun image
FROM oven/bun:latest

# You can now add your own RUN commands.
# For example, to install 'git' and 'unzip':
RUN apt-get update && apt-get install -y git
RUN apt-get install wget
RUN bash -c "$(wget https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh -O -)"

# Set the working directory
WORKDIR /workspace