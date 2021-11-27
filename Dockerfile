FROM node:14.18-alpine As development

ARG NPM_TOKEN

#ENV NPM_EMAIL="wodo-platform@users.noreply.github.com"
#ENV NPM_REGISTRY="https://npm.pkg.github.com"
#ENV NPM_SCOPE="@wodo-platform"
#ENV NPM_TOKEN=${NPM_TOKEN}

WORKDIR /usr/src/app

COPY package*.json ./

RUN echo "@wodo-platform:registry=https://npm.pkg.github.com/" > .npmrc 
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    npm install  && \
    rm -f .npmrc

RUN npm install
COPY . .
RUN npm run build


FROM node:14.18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

# TODO: find a better way to bundle dependencies with nestjs. 
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY --from=development /usr/src/app/dist ./dist

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

# Start the application
CMD ["npm", "run", "start:prod"]