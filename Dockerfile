# The image is built on top of one that has node preinstalled
FROM bitnami/node:14 as builder

ENV NODE_ENV="production"

# Copy app's source code to the /app directory
COPY . /app

# The application's directory will be the working directory
WORKDIR /app

RUN chmod 777 -R /app/*

# Install dependencies
RUN npm install -g --unsafe-perm

RUN npm install

RUN npx prisma generate


# Only copy the required distribution code to the runner
FROM bitnami/node:14-prod
ENV NODE_ENV="production"

# Copy the application code
COPY --from=builder /app /app

# Create a non-root user
RUN useradd -r -u 1001 -g root nonroot
RUN chown -R nonroot /app
USER nonroot

WORKDIR /app

CMD ["ls","-l"]
ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]
