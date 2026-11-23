FROM alpine:3.19

# Installazione degli strumenti essenziali di build
RUN apk add --no-cache \
    git \
    make \
    zip \
    openssh-client \
    bash

RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
WORKDIR /workspace

COPY build.sh /workspace/build.sh
RUN chmod +x /workspace/build.sh

ENTRYPOINT ["/workspace/build.sh"]