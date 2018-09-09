(function () {
  'use strict';

  // Animação inicial no topo da página
  setInterval(function () {
    const animacaoInicial = document.querySelector('.topPage');
    animacaoInicial.classList.add('active');
  }, 500);

  // ########################################################## VARIÁVEIS PRINCIPAIS

  // Número do pokémon que a pokédex irá iniciar
  const numInicialPokedex = 0;
  // Intervalo de pokemons que irá carregar por vez
  var intervaloPokedex = 18;
  // Quantos pokémons quer trazer no total
  const numeroDePokemonsTotal = 151;
  // URL inicial da API
  const urlAPI = `https://pokeapi.co/api/v2/pokemon/?limit=${intervaloPokedex}&offset=${numInicialPokedex}`;
  // Modal
  const modal = document.querySelector('.modal');

  // ########################################################## /VARIÁVEIS PRINCIPAIS

  // Função para retornar os primeiros pokémons da API
  function rodaPokedex(url) {
    const ajaxPokedex = new XMLHttpRequest();
    ajaxPokedex.open('GET', url);
    ajaxPokedex.send();
    ajaxPokedex.onreadystatechange = function () {
      if (ajaxPokedex.readyState === 4 && ajaxPokedex.status === 200) {
        var pokeDex = JSON.parse(ajaxPokedex.responseText);
        document.querySelector('.list').innerHTML +=
          '<p class="loader-text">Carregando Pokédex...</p><div class="loader"><div></div><div></div><div></div><div></div></div>';
        const pokemonsScroll = [];
        pokeDex.results.forEach(function (elem) {
          pegaInfoPokemon(elem.url, pokemonsScroll);
        });
      }
    };
  }

  // Pega informações de cada Pokemon
  function pegaInfoPokemon(url, arr) {
    const ajaxPokemon = new XMLHttpRequest();
    ajaxPokemon.open('GET', url);
    ajaxPokemon.send();
    ajaxPokemon.onreadystatechange = function () {
      if (ajaxPokemon.readyState === 4 && ajaxPokemon.status === 200) {
        var pokemon = JSON.parse(ajaxPokemon.responseText);
        var infoPokemon = {
          id: pokemon.id,
          nome: pokemon.name,
          src: pokemon.sprites.front_default,
          tipos: pokemon.types
        };
        arr.push(infoPokemon);
        arr = arr.sort((a, b) => a.id - b.id);
        if (arr.length === intervaloPokedex) {
          document.querySelector('.loader').remove();
          document.querySelector('.loader-text').remove();
          renderizaPokemons(arr);
        }
      }
    };
  }

  // Função para inserir cards dos pokemons
  function renderizaPokemons(arr) {
    for (var i = 0; i < arr.length; i++) {
      const content = '<div class="pokemon">' + '<div class="pokemon-name">' + '  <h3><span data-numero="' + arr[i].id + '">' + arr[i].id + '</span></h3>' + '  <h2 data-nome="' + arr[i].nome + '"><span>' + arr[i].nome + '</span></h2>' + '</div>' + '<div class="pokemon-image lazy-container">' + '  <img src="" ' + 'data-src="' + arr[i].src + '">' + '</div>' + '<div class="pokemon-type">' + '<h4 data-type01="' + arr[i].tipos[0].type.name + '">' + arr[i].tipos[0].type.name + '</h4>' + verificaSegundoTipo(arr[i].tipos[1]) + '</div>' + '</div>';
      document.querySelector('.list').innerHTML += content;
    }
    abreModal();
    lazyLoad();
    scrollInifinito();
  }

  // Função que verifica segundo tipo do pokémon
  function verificaSegundoTipo(pokemon) {
    return pokemon
      ? `<h4 data-type02="${pokemon.type.name}">${pokemon.type.name}</h4>`
      : '';
  }

  // Função LazyLoad para imagens
  function lazyLoad() {
    const lazyArray = document.querySelectorAll('.pokemon');
    lazyArray.forEach(function (elemento) {
      var lazyImg = elemento.querySelector('img');
      var url = lazyImg.dataset.src;
      var pokedexTop = window.innerHeight + 50;
      var elemTop = elemento.offsetTop + pokedexTop;
      document.addEventListener('scroll', function () {
        var screenTop = window.scrollY;
        var screenBottom = screenTop + window.innerHeight;
        if (elemTop < screenBottom) {
          lazyImg.setAttribute('src', url);
        }
      });
    });
  }

  // Função Scroll Infinito
  function scrollInifinito() {
    const contentPokedex = document.querySelector('.list');
    var elemBottom = contentPokedex.offsetTop + contentPokedex.offsetHeight;
    var carregandoAtivo = false;
    document.addEventListener('scroll', function () {
      var screenTop = window.scrollY;
      var screenBottom = screenTop + window.innerHeight;
      if (elemBottom < screenBottom && !carregandoAtivo) {
        carregandoAtivo = true;
        const offset =
          document.querySelectorAll('.pokemon').length + numInicialPokedex;
        verificaLimitePokemons(offset);
      }
    });

    // Funcão para trazer os pokémons até o limite estipulado pela variável "numeroDePokemonsTotal"
    function verificaLimitePokemons(pokemonsJaCarregados) {
      if (pokemonsJaCarregados == numeroDePokemonsTotal + numInicialPokedex) {
        return false;
      } else if (
        pokemonsJaCarregados + intervaloPokedex >
        numeroDePokemonsTotal + numInicialPokedex
      ) {
        intervaloPokedex =
          numeroDePokemonsTotal + numInicialPokedex - pokemonsJaCarregados;
        var newAPI = `https://pokeapi.co/api/v2/pokemon/?limit=${intervaloPokedex}&offset=${pokemonsJaCarregados}`;
        return rodaPokedex(newAPI);
      } else {
        var newAPI = `https://pokeapi.co/api/v2/pokemon/?limit=${intervaloPokedex}&offset=${pokemonsJaCarregados}`;
        return rodaPokedex(newAPI);
      }
    }
  }

  // Funcionamento do modal
  function abreModal() {
    const modalCard = document.querySelectorAll('.pokemon');
    const bgModal = document.querySelector('.modal-bg');
    const modalFechar = document.querySelector('.btn-fechar');
    modalCard.forEach(function (card) {
      card.addEventListener('click', function () {
        limpaModal();
        modalEstaAberto(false);
        carregaDadosModal(card);
        bgModal.addEventListener('click', function () {
          modalEstaAberto(true);
        });
        modalFechar.addEventListener('click', function () {
          modalEstaAberto(true);
        });
      });
    });
  }

  // Verifica se o modal já está aberto
  function modalEstaAberto(value) {
    if (value) {
      document.querySelector('.poke-modal').classList.remove('open');
      document.querySelector('body').classList.remove('no-scroll');
    } else {
      document.querySelector('.poke-modal').classList.add('open');
      document.querySelector('body').classList.add('no-scroll');
    }
  }

  // Limpa os dados do modal assim que é fechado
  function limpaModal() {
    const modal = document.querySelector('.modal');
    const dadosModal = modal.querySelectorAll('.modal-data');
    dadosModal.forEach(function (elem) {
      elem.textContent = '';
    });
    modal.querySelector('[data-src]').removeAttribute('src');
  }

  // Carrega os dados para o modal de acordo com o pokemon clicado
  function carregaDadosModal(pokemonClicado) {
    const elemType02 = pokemonClicado.querySelector('[data-type02]');
    var setType = '';
    if (elemType02) {
      setType = elemType02.dataset.type02;
    }
    var dadosPokemon = {
      id: pokemonClicado.querySelector('[data-numero]').dataset.numero,
      nome: pokemonClicado.querySelector('[data-nome]').dataset.nome,
      src: pokemonClicado.querySelector('[data-src]').dataset.src,
      type01: pokemonClicado.querySelector('[data-type01]').dataset.type01,
      type02: setType
    };
    preencheModal(dadosPokemon);
  }

  // Preenche o modal com todas informações
  function preencheModal(infoCardPokemon) {
    modal.querySelector('[data-number]').textContent = infoCardPokemon.id;
    modal.querySelector('[data-name]').textContent = infoCardPokemon.nome;
    modal.querySelector('[data-src]').setAttribute('src', infoCardPokemon.src);
    modal.querySelector('[data-type01]').textContent = infoCardPokemon.type01;
    modal.querySelector('[data-type01]').dataset.type01 =
      infoCardPokemon.type01;
    modal.querySelector('[data-type02]').textContent = infoCardPokemon.type02;
    modal.querySelector('[data-type02]').dataset.type02 =
      infoCardPokemon.type02;
    pegaDadosApiModal(infoCardPokemon.id);
  }

  // Pega os dados da API de acordo com o pokémon clicado
  function pegaDadosApiModal(id) {
    const ajaxModal = new XMLHttpRequest();
    ajaxModal.open('GET', `https://pokeapi.co/api/v2/pokemon/${id}`);
    ajaxModal.send();
    ajaxModal.onreadystatechange = function () {
      if (ajaxModal.readyState === 4 && ajaxModal.status === 200) {
        var pokemonModal = JSON.parse(ajaxModal.responseText);
        var statusPokemon = {
          height: pokemonModal.height,
          weight: pokemonModal.weight,
          exp: pokemonModal.base_experience,
          speed: pokemonModal.stats[0].base_stat,
          spdef: pokemonModal.stats[1].base_stat,
          spatk: pokemonModal.stats[2].base_stat,
          def: pokemonModal.stats[3].base_stat,
          atk: pokemonModal.stats[4].base_stat,
          hp: pokemonModal.stats[5].base_stat
        };
        modal.querySelector('[data-height]').textContent = statusPokemon.height;
        modal.querySelector('[data-weight]').textContent = statusPokemon.weight;
        modal.querySelector('[data-exp]').textContent = statusPokemon.exp;
        modal.querySelector('[data-speed]').textContent = statusPokemon.speed;
        modal.querySelector('[data-spdef]').textContent = statusPokemon.spdef;
        modal.querySelector('[data-spatk]').textContent = statusPokemon.spatk;
        modal.querySelector('[data-def]').textContent = statusPokemon.def;
        modal.querySelector('[data-atk]').textContent = statusPokemon.atk;
        modal.querySelector('[data-hp]').textContent = statusPokemon.hp;
      }
    };
  }

  // ################################################# Inicia toda a consulta para a API
  rodaPokedex(urlAPI);
  // ################################################# /Inicia toda a consulta para a API
})();
