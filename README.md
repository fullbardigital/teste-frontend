# PokeAPI - Márcio Scavassa

## Instalar as dependências:

Entrar na pasta raíz do projeto através do terminal e executar o seguinte comendo:

$ npm install

# 

## Rodar o projeto:

Ainda na pasta do projeto, executar o comando:

$ gulp

Ele rodará o projeto, criando toda a estrutura da pasta /prod (esta é a pasta que será enviada para produção) e rodando o browserSync para visualização do desenvolvimento no navegador.

Obs: O desenvolvimento é feito somente na pasta /dev.

#

## Opções de desenvolvimento

##### Alterar a index de desenvolvimento:

Caso seja necessário trabalhar em uma nova página, no arquivo gulpfile, a função browser() permite alterar a index de carregamento, evitando ter que entrar toda vez que o navegador é carregado novamente.
