FROM fedora:29
RUN dnf install -y npm git

COPY . /frontend
WORKDIR /frontend

COPY package*.json /frontend/
RUN npm install

CMD ["/usr/bin/npm", "run", "start"]

EXPOSE 8002
