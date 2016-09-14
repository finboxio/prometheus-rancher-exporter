FROM mhart/alpine-node

ARG LR_NPM_TOKEN
ARG NODE_ENV=production
ARG STRICT_SSL=true
RUN echo "registry=https://registry.npmjs.org/" > /root/.npmrc && \
    echo "@lr:registry=http://npm.leveredreturns.com" >> /root/.npmrc && \
    echo "//npm.leveredreturns.com/:_authToken=${LR_NPM_TOKEN}" >> /root/.npmrc && \
    echo "progress=false" >> /root/.npmrc

ENV NODE_ENV=$NODE_ENV
ENV NODE_PATH=/usr/src/app/lib

# Create the app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src

# Install app
COPY ./package.json /tmp/package.json
RUN cd /tmp && npm --strict-ssl $STRICT_SSL install
COPY app/ /usr/src/app/

RUN ln -sf /tmp/node_modules /usr/src/node_modules
RUN ln -sf /tmp/package.json /usr/src/package.json

# Run
CMD [ "node", "app/index.js" ]
