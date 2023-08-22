# Use a imagem base do Node.js
FROM node:14

# Diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos do diretório atual para o diretório de trabalho do contêiner
COPY . /app/

# Excluir a pasta node_modules
RUN rm -rf node_modules

# Instalar as dependências
RUN npm install

# Expor a porta em que a aplicação vai ouvir
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"]
