## Documentação da API
A documentação da API pode ser encontrada acessando a rota `/api` do servidor, onde é apresentado o Swagger com todas as rotas disponíveis.

## Instalação e Execução
Para instalar e executar o ambiente, siga os seguintes passos:

1. Clone o repositório
2. Navegue até o diretório do projeto
3. Instale as dependências com o comando npm install
4. Execute um dos seguintes comandos conforme a necessidade:

### ATENÇÃO, AGORA PARA RODAR O BACKEND UTILIZAR O SEGUINTE COMANDO

```js 
docker compose up --build 
```

esse comando fará com que o backend e o banco de dados sejam hospedados em um container no docker e assim permitirá utilizar o backend.

os comandos abaixo só serão uteis caso a intenção seja usar localmente ou caso não haja o docker instalado, porém é absolutamente **essencial** instalar o **docker**

---

```js
  npm run build // Para construir o projeto
  npm run format // Para formatar os arquivos
  npm run start // Para iniciar o servidor
  npm run start:dev // Para iniciar o servidor em modo de desenvolvimento
  npm run start:debug // Para iniciar o servidor em modo de depuração
  npm run start:prod // Para iniciar o servidor em modo de produção
  npm run lint // Para executar o linter
  npm run test // Para executar os testes
  npm run test:watch // Para executar os testes em modo de observação
  npm run test:cov // Para gerar a cobertura de testes
  npm run test:debug // Para executar os testes em modo de depuração
  npm run test:e2e // Para executar os testes end-to-end
```

## Contribuição

Contribuições são sempre bem-vindas. 
Se você tiver alguma sugestão ou quiser contribuir, 
sinta-se à vontade para abrir um Pull Request.