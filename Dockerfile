FROM node:iron-alpine as build

ARG COMMIT_SHA=<not-specified>
ENV NPM_CONFIG_CACHE="/tmp"

WORKDIR /build-dir

COPY package.json .
COPY package-lock.json .

# install also DEV dependencies to enable Typescript compilation
RUN npm ci
COPY . .

# compile Typescript to Javascript
RUN npm run build

RUN echo "mia_template_service_name_placeholder: $COMMIT_SHA" >> ./commit.sha

########################################################################################################################

FROM node:iron-alpine

# Resources
# - https://github.com/krallin/tini
# - https://cloud.google.com/architecture/best-practices-for-building-containers#signal-handling
RUN apk add --no-cache tini

LABEL maintainer="%CUSTOM_PLUGIN_CREATOR_USERNAME%" \
      name="mia_template_service_name_placeholder" \
      description="%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.1.0"

ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV HTTP_PORT=3000
ENV NPM_CONFIG_CACHE="/tmp"

WORKDIR /home/node/app

# copy only needed files
COPY --from=build /build-dir/package.json package.json
COPY --from=build /build-dir/package-lock.json package-lock.json
COPY --from=build /build-dir/LICENSE LICENSE
COPY --from=build /build-dir/CHANGELOG.md CHANGELOG.md
COPY --from=build /build-dir/dist dist
COPY --from=build /build-dir/commit.sha commit.sha

# install only dependencies required to run the service
RUN npm ci --omit=dev

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD node ./dist/index.js
