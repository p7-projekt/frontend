FROM ubuntu:latest

RUN  apt-get update \ 
&& apt-get upgrade -y \
&& apt install -y curl \
&& curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh \ 
&& bash nodesource_setup.sh \ 
&& apt-get install -y nodejs && npm install -g npm@10.9.0

WORKDIR /home/ubuntu/frontend

COPY . .

RUN npx svelte-add@latest tailwindcss && npm install

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run", "dev", "--", "--host"]

