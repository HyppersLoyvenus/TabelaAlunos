# Desenvolvimento Web - Aula 14: Migration & Seeds
Conforme requisitado, alterei: ```app/Commands/GetAlunosCommand.js```

## Instalação & Execução
1. Clonar o repositório:

   ```sh
   git clone https://github.com/HyppersLoyvenus/TabelaAlunos.git
   ```

2. Entrar na pasta do projeto:

   ```sh
   cd TabelaAlunos
   ```

3. Criar o arquivo `.env` na raiz do projeto copiando o .env.example:

   ```ini
   copy .env.example .env
   ```

4. Abrir o arquivo .env recém criado e preencher os campos abaixo:

    ```sh
    POSTGRES_USER
    POSTGRES_PASSWORD
    JWT_SECRET
    ```
    
5. Instalar as dependências:

    ```sh
    npm install
    ```

6. Subir a aplicação com Docker Compose:

   ```sh
   docker-compose up --build -d
   ```
   > Servidor disponível em: http://localhost:8080 \
   > Documentação API em: http://localhost:8080/docs

7. Executar as migrations utilizando UM desses comandos:

   Container:
   ```sh
   docker-compose run --rm cli-container migrate
   ```

   Node no host:
   ```sh
   node command migrate
   ```

8. Executar as seeds utilizando UM desses comandos:

   Container:
   ```sh
   docker-compose run --rm cli-container seed
   ```

   Node no Host:
   ```sh
   node command seed
   ```

9. Executar o comando CLI no Terminal para mostrar a tabela de alunos e suas máterias:

   ```sh
   npm run cli get-alunos
   ```
