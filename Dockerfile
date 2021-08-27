FROM registry.access.redhat.com/ubi8/ubi:latest

RUN dnf -y --disableplugin=subscription-manager module enable nodejs:14 && \
    dnf -y --disableplugin=subscription-manager module enable python27:2.7 && \
    dnf -y --disableplugin=subscription-manager --setopt=tsflags=nodocs install \
       npm nodejs \
       python2 \
       make gcc-c++ git && \
    dnf --disableplugin=subscription-manager clean all

ENV WORKDIR /compliance/
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

COPY package*.json $WORKDIR
COPY ./entrypoint.sh /

RUN npm install -g npm@7.7.6

RUN npm install

EXPOSE 8002

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start:proxy"]
