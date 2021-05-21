# Tutorial para construir seu primeiro pipeline com Continuous Integration e Continuous Deployment

Este repositório está com todos os artefatos para configurar o pipeline fazer o deploy, sendo somente necessário a troca das informações de autenticação das ferramentas que serão utilizadas. Recomendo que você monte um repositório a parte para execução desses passos afim de acompanhar e executar cada etapa de aprendizado da proposta do tutorial.
### 1. Ter ou Construir uma aplicação para fazer CI/CD
Eu criei uma aplicação simples Javascript para rodar este tutorial, se você quiser usar uma aplicação existente ou outra linguagem, sinta-se a vontade. Mas para garantir a execução do tutorial até o último passo, recomendo usar o que estou recomendando, e posterior aplique o mesmo tutorial para uma outra aplicação e/ou outra linguagem de programação.
Nesse tutorial utilizarei um repositório git que está hospedado no GitHub, mas é possível usar repositórios git de outros lugares (GitLab, BitBucket, etc).

### 2. Criar/Configurar uma conta do Heroku

Se você ainda não possui uma conta no Heroku, siga os seguintes passos:

1. Acesse o site no seu navegador de preferência: https://heroku.com
2. Clique em Sign-Up para criar a sua conta
3. Preencha os seus dados, e utilize um e-mail que você tenha acesso constantemente. Nos campos de _Company_ e Role, tu pode preencher __PretaLab__ e _Student_ respectivamente. No campo de __Primary development language__ você pode preencher a linguagem de sua preferência e caso já tenha uma aplicação na liguagem escolhida, porém isso pode ser alterado posteriormente. Nesse tutorial faremos um deploy de uma aplicação Node.js e clique em Create Free Account.
4. Confirme o seu cadastro acessando a conta de e-mail informado e procure um e-mail com o título __Confirm your account on Heroku__, e clique no link para confirmar sua conta, defina uma senha e confirme.
5. Se tu ver na tua tela a mensagem __Welcome to Heroku__, prossiga para o acesso do Heroku, aceite os termos de serviço e avance.
6. Quando visualizar dois botões __Create new app__ e __Create a team__, estamos prontas para começar :)!

## 3. Criar/configurar conta do serviço de CI

Existem um vasto leque de opções de CI gratuitos para utilizar-mos. Neste tutorial eu vou usar o mais simples que conheço (e mais fácil de aprender) chamado [Travis-CI](https://www.travis-ci.com/).

1. Acesse o site e clique em sign-up, serão exibidas as opções para login, muitas delas com autenticação de serviços que hospedam repositórios Git, vamos utilizar a autenticação do GitHub.
2. Após autenticar, a página será direcionada para a página de pipelines executados (se você nunca utilizou, estará vazia), do lado direito superior terá um ícone do seu perfil, abra e clique na opção __Settings__.
3. Na tela exibida, clique a Aba _Repositories_, clique no botão __Manage repositories on GitHub__, a tela de permissões de integrações com o GitHub será aberta numa nova aba, selecione a opção _Only selected repositories_, clique no botão __Select repositories__, pesquise seu repositório git no GitHub para este projeto rodar o CI, no meu caso eu coloquei _pretalab-ci-cd-tutorial_.
4. Assim que surgir o projeto escolhido, clique para selecioná-lo, logo depois clique no botão em verde no final da tela __Approve and Install__.
5. Se abrir a tela do Travis-CI com o seu repositório listado, estamos prontas :)!

### 3. Configurar o build da aplicação

Nesta etapa vamos criar o arquivo de configuração do CI, no nosso caso, o arquivos que o Travis-CI precisa para executar o pipeline do nosso projeto.

1. Crie um arquivo na raiz do projeto chamado `.travis.yml`
2. No arquivo vamos informar os dados necessários para a executar o disparo do pipeline:

```yaml
language: node_js
os: linux
node_js:
  - 14
jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install
```

3. Aqui nessa configurações definições fundamentais para funcionar nosso primeiro passo do CI, no caso a instalação da nossa aplicação JavaScript: (1) Qual runtime vamos usar, no caso _NodeJS_; (2) qual sistema operacional que será executado os scripts do nosso pipeline, no caso Linux; (3) qual a versão do Node.JS, no caso versão 14; e nosso primeiro passo (_stage_) definido como _build_, onde nomeie como __Build da aplicação JavaScript__ e define no _script_ o comando executado para instalar nossa aplicação `npm install`. Após essa configuração, commit este arquivo e acompanho a execução do pipeline na página principal do Travis-CI.
ATENÇÃO: O arquivo de configuração por começar com um ponto `.travis.yml` é considerado como arquivo oculto, então se certifique de que o arquivo foi adicionado e commitado no repositório.
4. Abra a tela do Travis-CI e verifique se o seu pipeline foi iniciado, deve aparecer como amarelo se estiver executando ainda e verde para completa, vermelha no caso de algum erro. Se estiver verdinha, estamos prontas nessa etapa :)!

### 4. Configurar o Deploy
Nesta etapa vamos configurar o deploy dessa aplicação no Heroku, e o Travis-CI que vai colocar a aplicação no Heroku para nós!

1. Vá no dashboard do Heroku e clique no botão __Create new App__. No formulário que for exibido, coloque o nome da aplicação seguido do seu nome, garantindo que seja uma aplicação única no Heroku, _pretalab-ci-cd-<seunome>_ e o país onde será feito o deploy, preencha _United States_, e clique em __Create app__;

2. Pegue a chave de autenticação para o Travis-CI autenticar no Heroku. Acesse seu perfil do Heroku no canto direito superior da tela e clique em _Account Settings_. Na sessão _Account_ procure por uma sessão chamada _API Key_, nela, clique no botão _Reveal_ e copiei o conteúdo da chave, uma sequência aleatória de números e letras.

3. No Dashboard do Travis-CI, procure seu repositório e clique. No campo direito superior, clique no botão _ More options_ e selecione a opção _Settings_. Procure uma sessão chamada _Environments Variables_, e preencha os campos disponíveis: (1) Coloque o nome da variável `HEROKU_API` no campo _name_, usaremos para obter a API Key do Heroku sem que tenhamos que commitar seu valor no `.travis.yml`, evitando problemas de segurança ou roubo de identidade. (2) Preencha a API Key que copiamos no Heroku no campo _value_; (3) No campo _branch_ informe a branch, coloquei _master_ ; (4) Garanta que o campo _DISPLAY VALUE IN BUILD LOGS_ esteja desligado, para que o seu token não seja exibido nos logs do pipeline do Travis. Depois clique no botão _Add_ para que a variável seja criada.

4. Adicione a configuração do deploy no arquivo `.travis.yml`:

```yaml
language: node_js
os: linux
node_js:
  - 14
jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install

    - stage: deploy
      name: Conecta no Heroku e faz o deploy
      script: skip
      deploy:
        provider: heroku
        api_key: $HEROKU_API
        app: pretalab-ci-cd-marylly
        on: master
```

Nessa última sessão adicionada chamada _deploy_ dizemos que vamos deployar no Heroku (provider), a chave de autenticação usará o conteúdo da variável que criamos no Travis HEROKU_API (api_key) e informamos o nome da aplicação que criamos no Heroku (app).
Após isso, faça ao commit do arquivo `.travis.yml`, espere o pipeline executar e verifique no Heroku se o deploy aconteceu.

No dashboard do Heroku será exibida a lista de aplicações que possui em um URL parecida com https://dashboard.heroku.com/apps. Abra a aplicação que criou antes e acesse a aba _Activities_ e observe se aconteceu um _Build_ e um _Deploy_ recentemente, isso indicará que o pipeline gerou a aplicação no Heroku.

Para visualizar a aplicação, acione o botão _Open App_ e uma nova aba será aberta com a URL da sua aplicação, sendo algo parecido com: https://pretalab-ci-cd-marylly.herokuapp.com/.

### 5. Linter

Referência seguida para instalação com [ESLint](https://eslint.org/docs/user-guide/getting-started).

Após a instalação e a configuração com o comando de init de o EsLint, ao rodar a primeira vez o linter temos o seguinte resultado.
```bash
λ npm run linter

> pretalab-ci-cd-tutorial@0.0.1 linter ...\pretalab-ci-cd-tutorial
> eslint **/*.js


...\pretalab-ci-cd-tutorial\index.js
   1:1   error    Expected 1 empty line after require statement not followed by another require  import/newline-after-import
   1:35  error    Missing semicolon                                                              semi
   2:22  error    Missing semicolon                                                              semi
   3:38  error    Missing semicolon                                                              semi
   6:44  error    Missing semicolon                                                              semi
   7:3   error    Missing semicolon                                                              semi
  10:3   warning  Unexpected console statement                                                   no-console
  10:67  error    Missing semicolon                                                              semi
  11:3   error    Newline required at end of file but not found                                  eol-last
  11:3   error    Missing semicolon                                                              semi

✖ 10 problems (9 errors, 1 warning)
  9 errors and 0 warnings potentially fixable with the `--fix` option.

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! pretalab-ci-cd-tutorial@0.0.1 linter: `eslint **/*.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the pretalab-ci-cd-tutorial@0.0.1 linter script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

```

Foram 10 erros em 1 arquivo `.js`.

Após executar o ESLint com a opção para corrigir o que for possível, o resultado é um erro somente e o arquivo `index.js` completamente alterado.

```bash
λ npm run linter:fix 

> pretalab-ci-cd-tutorial@0.0.1 linter:fix ...\pretalab-ci-cd-tutorial
> eslint --fix **/*.js


...\pretalab-ci-cd-tutorial\index.js
  11:3  warning  Unexpected console statement  no-console

✖ 1 problem (0 errors, 1 warning)
```

O erro apontado pelo ESLint foi ignorado passando a instrução para ignorar o comando de console na linha seguinte, o trecho de código ficou assim:

```javascript
// eslint-disable-next-line no-console
console.info(`Example app listening at http://localhost:${port}`);
```

Após essa alteração a execução do `npm run linter` não indica mais erros.

```bash
λ npm run linter

> pretalab-ci-cd-tutorial@0.0.1 linter ...\pretalab-ci-cd-tutorial

> eslint **/*.js
```

Adicione a execução do linter no arquivo `.travis.yml`:

```yaml
language: node_js
os: linux
node_js:
  - 14

stages:
  - build
  - linter
  - deploy

jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install

    - stage: linter
      name: Valida a sintaxe e estilo
      script: npm run linter

    - stage: deploy
      name: Conecta no Heroku e faz o deploy
      script: skip
      deploy:
        provider: heroku
        api_key: $HEROKU_API
        app: pretalab-ci-cd-marylly
        on: master
```

Após fazer o commit com essa alteração a execução do pipeline no Travis e o deploy no Heroku deverão acontecer com sucesso.

### 6. Testes Unitários ou de Unidade

Para os testes automatizados, escolhemos usar o Jest, e a referência para instalação e configuração podem ser encontradas [aqui](https://jestjs.io/docs/getting-started). E para efetuar a chamada da api durante os testes, iremos usar a biblioteca do supertest, que temos referências para instalação [aqui](https://github.com/visionmedia/supertest#readme).

Criamos um teste simples para avaliar se o retorno é status code 200 de sucesso e uma mensagem de `Hello World`:

```javascript
const request = require('supertest');
const app = require('./index');

describe('Test the `/` path', () => {
  test('It should response the GET method and return HttpStatusCode 200 and Hello World message', () => {
    request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World do Nosso tutorial');
      });
  });
});
```

Atualize a seção de scripts para rodar o comando npm para testes:

```json
...
"scripts": {
    "start": "node src/server.js",
    "test": "jest",
    "linter": "eslint src/**/*.js",
    "linter:fix": "eslint --fix src/**/*.js"
  },
...
```

Execute os testes localmente com o comando `npm test`:

```bash
➜  pretalab-ci-cd-tutorial git:(main) ✗ npm test

> pretalab-ci-cd-tutorial@0.0.1 test ../pretalab-ci-cd-tutorial
> jest

 PASS  src/index.test.js
  Test the `/` path
    ✓ It should response the GET method and return HttpStatusCode 200 and Hello World message (7 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.106 s
Ran all test suites.
```

Após a criação do testes, podemos adicionar os testes no pipeline:

```yaml
language: node_js
os: linux
node_js:
  - 14

stages:
  - build
  - linter
  - unit tests
  - deploy

jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install

    - stage: linter
      name: Valida a sintaxe e estilo
      script: npm run linter
    
    - stage: unit tests
      name: Testes unitários
      script: npm test

    - stage: deploy
      name: Conecta no Heroku e faz o deploy
      script: skip
      deploy:
        provider: heroku
        api_key: $HEROKU_API
        app: pretalab-ci-cd-marylly
        on: master
```
Após fazer o commit com essa alteração a execução do pipeline no Travis e o deploy no Heroku deverão acontecer com sucesso.