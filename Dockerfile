FROM fedora:29
RUN dnf install -y npm git

COPY . /frontend
WORKDIR /frontend

RUN rm -rf node_modules/*

RUN npm install

CMD ["/usr/bin/npm", "run", "start"]

EXPOSE 8002
