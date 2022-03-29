### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:12.7-alpine as builder
COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run ng build -- --prod --output-path=dist

### STAGE 2: Setup ###
FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/default.conf

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# ## add permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /etc/nginx/nginx.conf && \
    chown -R nginx:nginx /usr/share/nginx/html
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

## switch to non-root user
USER nginx


CMD ["nginx", "-g", "daemon off;"]
EXPOSE 5000


################ Build image ##################
# docker build -t relfinderng:latest .       #
###############################################