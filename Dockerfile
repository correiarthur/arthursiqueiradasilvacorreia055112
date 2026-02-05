# Estágio 1: Construção (Build)
FROM public.ecr.aws/docker/library/node:18-alpine AS build

WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências de forma limpa
RUN npm ci

# Copia todo o código fonte para o container
COPY . .

# Gera o build de produção da aplicação Vite
RUN npm run build

# Estágio 2: Produção (Servidor Web)
FROM public.ecr.aws/nginx/nginx:alpine

# Copia os arquivos estáticos gerados no estágio de build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx para lidar com roteamento SPA (Essential!)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
