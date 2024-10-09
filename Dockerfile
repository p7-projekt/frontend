FROM ubuntu:latest

RUN  apt-get update \ 
&& apt-get upgrade -y \
&& apt install -y curl \
&& curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh \ 
&& bash nodesource_setup.sh \ 
&& apt-get install -y nodejs && npm install -g npm@10.9.0 

WORKDIR /home/ubuntu/frontend

RUN npx svelte-add@latest tailwindcss && npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]

