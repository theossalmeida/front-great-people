# Sistema de Pesquisas - Frontend

Este repositório é o frontend do Sistema de Pesquisas. Nele, você pode visualizar os dados das pesquisas e fazer uploads de arquivos. A aplicação é construída com React e usa React Router para alternar entre a tela de listagem e a de upload.

## Funcionalidades

- Exibe os resultados das pesquisas em uma tabela.
- Permite buscar, adicionar, editar e excluir pesquisas.
- Realiza uploads de arquivos para o backend.
- Comunica-se com a API para obter e enviar dados.

## Instalação

1. Clone o repositório:
git clone https://github.com/theossalmeida/front-great-people


2. Instale as dependências: npm install

3. Inicie o servidor de desenvolvimento: npm start


*Obs.: Certifique-se de que o backend esteja funcionando e ajuste a URL base da API em "api.js", se necessário.*

## Estrutura do Projeto

- **App.js:** Configura as rotas e o layout principal.
- **index.js:** Ponto de entrada da aplicação.
- **api.js:** Funções para comunicação com o backend (busca, upload, salvar e excluir).
- **DataTable.js:** Exibe os dados das pesquisas com busca, paginação e ações de edição/exclusão.
- **UploadScreen.js:** Tela para upload de arquivos.
