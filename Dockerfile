FROM registry.access.redhat.com/ubi8/ubi:latest

ENV WORKDIR /compliance/
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

COPY package*.json $WORKDIR
COPY ./entrypoint.sh /

RUN dnf -y --disableplugin=subscription-manager module enable nodejs:10 && \
    dnf -y --disableplugin=subscription-manager module enable python27:2.7 && \
    dnf -y --disableplugin=subscription-manager --setopt=tsflags=nodocs install \
       npm nodejs \
       python2 \
       make gcc-c++ git && \
    dnf --disableplugin=subscription-manager clean all

RUN npm install
RUN npm rebuild node-sass

EXPOSE 8002

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start"]
