# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY .env.example ./.env

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos necessários do stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/server.js ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
