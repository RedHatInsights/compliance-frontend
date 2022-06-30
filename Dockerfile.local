FROM registry.access.redhat.com/ubi8/ubi:latest

RUN dnf -y --disableplugin=subscription-manager module enable python27:2.7 && \
    dnf -y --disableplugin=subscription-manager --setopt=tsflags=nodocs install \
       npm nodejs \
       python2 \
       make gcc-c++ git && \
    dnf --disableplugin=subscription-manager clean all

ENV NVM_DIR /usr/local/nvm
ENV WORKDIR /compliance/
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

COPY . $WORKDIR
COPY ./entrypoint.sh /

# nvm environment variables
ENV NVM_DIR /root/.nvm
RUN mkdir -p $NVM_DIR
ENV NODE_VERSION 16.13.0

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install

EXPOSE 8002

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start:proxy"]
