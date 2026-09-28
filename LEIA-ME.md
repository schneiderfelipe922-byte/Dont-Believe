# DON’T BELIEVE — O Obelisco · 2D Top-Down

Uma aventura de exploração em HTML, CSS e JavaScript puro. Você controla Kali por um orfanato vigiado pela Actras, conversa com moradores, interage com objetos, descobre o altar e toma decisões que levam a seis finais.

Os quatro protagonistas usam os sprites enviados pelo usuário: Mira recebe o primeiro conjunto de GIFs, Eron o segundo conjunto, Kali a folha PNG de 35 quadros e Noah o conjunto com sufixo `-2`. As mesmas artes aparecem no mapa, nos retratos dos diálogos e nas ilustrações dos finais.

## Artes atualizadas

A tela inicial volta à ilustração original do orfanato OldHood enviada pelo usuário, com seis áreas clicáveis: Jogar, Capítulos, Opções, Conquistas, Créditos e Sair. Jogar permite continuar uma partida existente ou iniciar outra. Capítulos apresenta o capítulo único; Conquistas mostra os finais. Sair preserva o progresso e informa que a aba pode ser fechada. Os botões da tela inicial, incluindo Continuar, ficam vermelhos no hover, no foco de teclado e ao pressionar.

Todos os oito ambientes usam pixel art original: piso de tábuas envelhecidas, paredes em tons escuros de vinho e roxo com lambris envelhecidos, móveis de madeira, cortinas escuras, tapetes e luz de velas. O dormitório preserva cama, armário, baú, escrivaninha, janela, tapete redondo, livros e papéis do quarto anterior. O altar de ametista e a moldura dos diálogos seguem o estilo pixel art. A referência atual orienta as tábuas horizontais avermelhadas, paredes vinho, madeira gasta, pilhas de livros, geladeira azul-acinzentada na cozinha e janelas de luz alaranjada. Os ambientes mantêm sombras profundas e luz quente ao redor das velas. À noite, a penumbra aumenta; personagens e objetivos continuam visíveis.

## Sprites importados

| Personagem | Arquivo de origem |
| --- | --- |
| Mira | `Idle_walking-4-frames_{south,west,east,north}.gif` |
| Eron | `Walking_to_8_positiv_walking-4-frames_{south,west,east,north}.gif` |
| Kali | `A-complete-full-body-2D-top-down-pixel-art-sprite--max-px-frames-35-rows-5-cols-7.png` |
| Noah | `Idle_walking-4-frames_{south,west,east,north}-2.gif` |

Os GIFs são decodificados em quatro quadros por direção, mantendo cores, transparência e duração relativa dos quadros. Kali usa sequências direcionais selecionadas da grade 5 × 7. O primeiro quadro de cada direção é a pose parada. A imagem original de Kali contém marcas d’água, que permanecem no jogo. Não foi feito retoque nas artes fornecidas.

`character-data.js` registra os recortes e âncoras. `character-sprites.js` faz a animação, preserva as proporções e alinha os pés. `tools/import-characters.py` recria os atlas a partir dos originais preservados em `assets/characters/source/`; esse preparo requer Python e Pillow, mas o jogo pronto funciona sem instalação. Vigias e líder continuam com capa preta e animação nativa.

Mira, Eron e Noah fazem pequenos deslocamentos perto dos pontos de encontro e param ao se aproximar de Kali. Diálogos e menus pausam o movimento. As sombras dark, a iluminação das velas e os hovers vermelhos permanecem.

## História revisada

As pistas conectam o desaparecimento de Tomas, a caixa da cozinha e os registros sob o altar. Mira fala por alusões, Eron orienta sobre rondas e passagens, e Noah deixa contradições na relação com a Actras. O interrogatório responde ao que Kali revelou anteriormente. Os seis finais e os salvamentos continuam compatíveis.

## Créditos

Pesquisa: Enzo Raphael dos Reis Pessoa.

Ideia, História e Arte: Felipe Bertol Schneider.

Desenvolvimento: Enzo Raphael dos Reis Pessoa, Felipe Bertol Schneider.

## Abrir e jogar

Extraia toda a pasta e abra `index.html` em um navegador moderno. Não é necessário instalar nada, executar comandos ou ter conexão com a internet. A versão avulsa `Dont-Believe-Jogar.html` contém o jogo completo em um único arquivo: basta baixá-la e abri-la no navegador.

## Controles

| Ação | Computador | Celular |
| --- | --- | --- |
| Andar | WASD ou setas | Direcional na tela |
| Interagir / avançar fala única | E ou Espaço | Botão Interagir / botão da fala |
| Escolher resposta | Teclas 1–4 ou clique | Toque na escolha |
| Andar furtivamente | Segurar Shift | Ativar Furtivo |
| Abrir mapa | M ou botão MAPA | Botão MAPA |
| Diário | J ou botão DIÁRIO | Botão DIÁRIO |
| Pausar | Esc ou MENU | MENU |

O marcador dourado indica com quem conversar ou o que examinar. Uma seta na borda aponta para o objetivo quando ele está fora da tela. O mapa mostra a posição de Kali e um caminho sugerido. A interação exige proximidade: caminhe até o personagem ou objeto.

## Exploração e história

O orfanato contém dormitório, sala de leitura, corredores, salão do obelisco, cozinha, ala restrita, sala de observação e arquivos. Móveis e paredes bloqueiam o movimento. O acesso à ala restrita e aos arquivos depende da fase da história.

As 29 cenas do roteiro foram ligadas a 23 pontos de missão, com diálogos e escolhas no mapa. As relações com Mira, Eron, Noah e os adultos continuam alterando pistas, rotas e finais. No momento apropriado, interagir com a base do altar abre a descida para os arquivos. Você precisa encontrar o símbolo e se aproximar do líder para o confronto.

Camas, livros, personagens e o altar também oferecem interações de ambientação. Os diálogos de ambientação não concedem pontos repetidamente. Examinar os detalhes do altar mostra o altar recriado em pixel art.

## Telas de encerramento

Cada um dos seis finais abre uma tela exclusiva, com ilustração pixel art, título, frase e epílogo completo. A Voz mostra a saída coletiva; A Luz, o amanhecer e a porta segurada por Noah; Sobrevivente, Kali sozinho na floresta; Traição, Noah diante dos adultos; Isolamento, o corredor sem saída; Sob Vigilância, a cela e a câmera.

Nessa tela, movimento e patrulhas ficam pausados. É possível voltar ao menu, iniciar novamente ou abrir a coleção. Conquistas permite rever apenas finais já descobertos, sem alterar a rota salva. Continuar uma partida concluída reabre sua tela de final. Uma nova partida preserva a coleção de finais. As telas têm rolagem em telas pequenas e navegação por teclado.

## Vigias e furtividade

Três vigias patrulham. Nas cenas noturnas, a visão deles passa a representar perigo. O campo de visão é direcional e é bloqueado por paredes e móveis. Segurar Shift reduz a velocidade e o alcance em que Kali pode ser percebido.

A barra de vigilância mostra a detecção em andamento. Quando completa, aumenta a suspeita da Actras; cada missão gera no máximo uma advertência desse tipo. Nas fases finais, ser descoberto com suspeita elevada pode levar à captura. Vigias e movimento ficam pausados enquanto você lê diálogos, usa o mapa ou abre um menu.

O botão COMO JOGAR inclui opções para ocultar os campos de visão e reduzir a animação dos marcadores. Som ambiente é opcional e começa desligado.

## Salvamento

O progresso, objetos, escolhas e posição são salvos automaticamente neste navegador. O modo 2D usa um salvamento próprio e não sobrescreve a partida da edição narrativa anterior. Os finais já descobertos usam a mesma coleção quando o navegador permite compartilhar esse armazenamento.

**Continuar partida** retoma a posição e a história. Iniciar novamente substitui a partida 2D, mantendo os finais descobertos. O armazenamento pode não persistir em modo privado, depois de limpar os dados ou quando o navegador bloqueia armazenamento em arquivos locais. O jogo informa quando não consegue salvar. Mover o arquivo ou usar outra versão/navegador pode separar os salvamentos.

## Código

- `index.html`: interface, menus, diálogos e controles de toque.
- `style.css`: aparência e layouts para computador e celular.
- `story.js`: roteiro, efeitos, requisitos e seis finais.
- `world.js`: mapa, móveis, colisões, visibilidade e objetivos.
- `assets.js`: carregamento das artes e mapeamento dos retratos.
- `pixel-art.js`: paleta, desenho dos oito cômodos, sprites direcionais e retratos.
- `render.js`: câmera, iluminação, personagens em cena, obelisco e minimapa.
- `tools/build-art.cjs`: gerador reproduzível dos retratos, menu e detalhe do altar; requer Node.js e `@napi-rs/canvas` apenas para recriar as imagens.
- `endings.js`: seis composições originais em Canvas e temas dos encerramentos.
- `game.js`: movimento, patrulhas, interações, diálogos, salvamento e áudio.
- `assets/altar-pixel.png`: detalhe do altar em pixel art.
- `assets/portraits.png`: atlas dos seis retratos.
- `assets/sprites.png`: atlas nativo de apoio, usado pelos adultos.
- `character-data.js` e `character-sprites.js`: recortes e reprodução dos sprites enviados.
- `assets/*-uploaded.png`: atlas ativos de Mira, Eron, Kali e Noah.
- `assets/menu-original.png`: tela inicial original restaurada.
- `historia-original.md`: roteiro original fornecido.

Para alterar o mapa, edite as salas e objetos em `world.js`. Para mudar a narrativa, edite `scenes` em `story.js` e os objetivos correspondentes em `world.js`. Os personagens e a arte são definidos em `pixel-art.js`. O jogo pronto não depende de Node.js ou bibliotecas externas.

## Verificação

Os 24 ciclos direcionais foram renderizados para verificar poses distintas. A movimentação dos moradores foi simulada para verificar colisões, parada e orientação ao se aproximar de Kali.

Foram verificados os 94.128 estados da narrativa, a possibilidade de alcançar as 29 cenas e os seis finais, os 23 pontos de missão e as colisões/linhas de visão. As seis telas de final foram verificadas em simulação: texto e ilustração correspondentes, retomada de partida concluída, pausa do movimento, revisão pela coleção e reinício preservando finais. A simulação da interface percorreu 75 interações nas rotas dos seis finais e verificou movimento por teclado e toque, salvamento de posição, mapa, diário, inventário, passagem do altar, portas restritas, detecção e captura por vigias.

Os oito ambientes, os seis personagens, o menu e a composição dos retratos foram renderizados e inspecionados com Canvas nativo. O carregamento seleciona o recorte correto de cada personagem; essa seleção também foi testada em simulação. A interface HTML/CSS completa não foi inspecionada em um navegador nesta execução: a política do navegador de teste bloqueia a abertura dos arquivos locais. O jogo inclui layout responsivo e controles de toque.

## Referências

Esta versão usa a história e a imagem anexadas. O Figma informado anteriormente não pôde ser consultado por falta de acesso da conta conectada; este mapa e esta interface são uma adaptação original. A trama mantém Kali, o Luzitruismo, a Actras e os finais A Voz, A Luz, Sobrevivente, Traição, Isolamento e Sob Vigilância. Inclui suspense, coerção e perseguição religiosa, sem imagens de violência explícita.
