FROM fedora:29
RUN dnf install -y npm git

RUN mkdir /frontend
WORKDIR /frontend

COPY package*.json /frontend/
RUN npm install

COPY ./entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "start"]

EXPOSE 8002
