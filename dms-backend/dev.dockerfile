FROM node:alpine

ARG UID=1000
ARG GID=1000

ENV DMS_SETTINGS_FILE_PATH "/etc/dms"
ENV DMS_SETTINGS_DIR "/etc/dms.d"

RUN set -x; [ -z $(getent group ${GID} | cut -d: -f1) ] && addgroup -S -g ${GID} dms || true;
RUN set -x; [ -z $(getent passwd ${UID} | cut -d: -f1) ] && adduser -S -u ${UID} -G $(getent group ${GID} | cut -d: -f1) dms || true;

COPY ./src /dms/src
COPY ./*.json /dms/
COPY ./settings.d /etc/dms.d

WORKDIR /dms

RUN set -ex; chown ${UID}:${GID} -R /dms; npm install;

USER 1000
ENTRYPOINT ["npm", "run", "start:debug"]

VOLUME /etc/dms.d
VOLUME /etc/dms
VOLUME /dms

EXPOSE 3500
EXPOSE 9229
