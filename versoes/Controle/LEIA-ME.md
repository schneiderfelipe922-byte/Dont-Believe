# DON’T BELIEVE — O Obelisco · 2D Top-Down

Uma aventura de exploração em HTML, CSS e JavaScript puro. Você controla Kali por um orfanato vigiado pela Actras, conversa com moradores, interage com objetos, descobre o altar e toma decisões que levam a seis finais.

## Sprites, Mel e portas

Os oito personagens usam um único atlas otimizado sem perda de pixels: `assets/sprites.png`. São 240 quadros, incluindo poses e caminhadas de Kali, Mira, Eron, Noah, vigia, Mel, Tomas e líder. O vigia usa o conjunto `A_hooded_figure_in_a.zip`; Mel usa `White_cat-Idle.zip`, ambos fornecidos com o projeto. As poses paradas e os pontos de apoio mantêm os pés alinhados. Todos os retratos dos diálogos usam a pose parada frontal, sem animação.

Mel começa no tapete do dormitório e passeia pelo orfanato, alternando caminhada e pequenas pausas. Ela só atravessa portas abertas e contorna paredes e móveis; salas trancadas ficam fora do passeio até serem liberadas. Ao se aproximar, ela para para receber carinho. A posição dela é salva e aparece atualizada no mapa e no minimapa. Aproxime-se e pressione **E** ou o botão de interação de toque para ler: “Você faz carinho em Mel. Ela não responde, mas gosta de você.” O carinho pode ser repetido e não altera história, inventário, relações ou prazo. Não há animação de carinho.

As portas comuns abrem e fecham com **E** a até 96 pixels de distância do centro (quatro casas do mapa). Quando fechadas, bloqueiam movimento e visão. Uma porta não fecha sobre o jogador ou outro personagem. A grade da ala leste depende da chave, arame ou distração da história; os arquivos dependem do mecanismo do altar. O portão permite passagem depois da preparação de saída ou do trinco de Noah. O estado das portas é salvo.

O mapa tem passagens mais largas e uma galeria de serviço ligando cozinha, observação e arquivos. O dormitório tem duas camas e um tapete para Mel; os móveis visíveis seguem a geometria de colisão. Os pisos distinguem madeira e pedra. As patrulhas respeitam os obstáculos. Salvamentos antigos recuperam uma posição livre próxima se um móvel ou porta ocupar a posição anterior.

O mapa (M) mostra uma rota que considera as portas comuns abríveis com E e respeita as trancas da história. Mel é marcada em branco. Objetivos permanecem dourados e preparações, azuis.

### Arquivo único dos sprites

`assets/sprites.zip` reúne os originais atuais dos oito personagens, o manifesto de importação e uma cópia do atlas e de seus metadados na pasta `runtime/`. As antigas folhas individuais, GIFs, ZIPs soltos e exportações substituídas foram removidos. As referências de arte e os documentos do projeto foram preservados.

`character-data.js` registra os recortes, tempos e âncoras; `character-sprites.js` desenha personagens e retratos. Para reconstruir o atlas e atualizar o ZIP:

```sh
python3 tools/import-characters.py
```

O importador requer Pillow. O jogo pronto não requer Python, Node.js, instalação ou internet: abra `index.html`, mantendo a pasta `assets` ao lado. A tela inicial original, a história e os créditos foram preservados.

## Personalidades, relações e 12 tarefas

Mira começa tímida e atenta ao corredor; conforme a confiança cresce, compartilha lembranças e desenhos. Eron fala pouco e guarda as lembranças de Tomas, seu melhor amigo desaparecido. Noah conversa desde o começo, observa as regras e acompanha um vigia com espaço entre os dois. Os vigias fazem perguntas diretas e dão instruções curtas.

Cada grupo oferece **três pedidos em sequência**, totalizando 12. Converse de perto para aceitar, recolha os objetos com **E** e volte ao personagem para entregar. A recompensa de relação só é concedida uma vez. O próximo pedido aparece depois da entrega anterior.

| Quem | Pedidos |
| --- | --- |
| Mira | Livro de capa verde, fita azul, caderno de desenhos |
| Eron | Chave e carta de Tomas, peça do tabuleiro, bilhete confiscado |
| Noah | Lista de presença, recado da ronda, livro de horários |
| Vigias | Registro de mantimentos, chave da despensa, ficha de manutenção |

**T — Tarefas** mostra andamento, requisitos, recompensa e marcação do próximo passo no mapa. **I — Inventário** permite consultar objetos e ler bilhetes e livros. Chaves de pedidos têm uso próprio e não substituem a chave da ala leste. O bilhete nos arquivos exige abrir a passagem pelo altar. Durante o prazo de transferência, recolher ou entregar custa uma ação; ler e consultar os painéis não custa.

As quatro barras acima do cenário mostram as relações com Mira, Eron, Noah e os vigias, na escala de 0 a 9. As decisões da história continuam afetando esses mesmos valores. Tarefas, inventário, relações e posições ficam no salvamento existente.

Mira e Eron circulam entre dormitório, salão e outros cômodos. Noah acompanha um vigia por mais de um cômodo, mantendo distância. Os moradores abrem portas comuns, respeitam móveis e trancas da história e param durante os diálogos. Captura, resgate e outras situações do roteiro continuam controlando onde eles podem estar. Os marcadores do mapa acompanham as posições atuais.

## Investigação e escolhas com consequências

A aventura tem 43 cenas em cinco atos. A investigação segue uma cadeia concreta: a etiqueta T-17 na cama de Tomas, o registro sem destino na sala de leitura, a caixa na cozinha, a ala leste e a ordem de transferência nos arquivos. Cada descoberta explica o próximo objetivo e fica no diário.

As alternativas de acesso são físicas: conseguir a chave com os adultos e usá-la na grade; combinar a distração de Eron; consumir o arame na fechadura; ou estudar a ronda e aproveitar seu intervalo. O mecanismo do altar usa a sequência sino → chama → raiz, ensinada pelas pistas. Errar aumenta a vigilância e permite uma nova tentativa.

O resgate altera o mundo: a grade abre, as celas ficam vazias e Mira e Tomas passam a esperar na cozinha. O arame e o pão saem do inventário quando usados. A distração remove dois vigias da patrulha. A suspeita amplia o alcance e a velocidade dos restantes. Noah precisa abrir o trinco diante de Kali; uma promessa, sozinha, não prepara essa rota.

Antes do confronto, existe uma fase de preparação sob prazo. É possível voltar, resgatar quem ficou, conversar sobre outros assuntos, mostrar provas, entregar pão, recuperar confiança e combinar tarefas. As opções finais informam o que foi preparado e o que falta, inclusive quando uma tentativa leva à captura, traição ou isolamento.

O diário (J) reúne objetivo, relações, pistas conectadas, preparações, condições das fugas e histórico de consequências. Os botões de marcação levam aos pontos correspondentes no mapa. Ouro indica missão; azul indica interação opcional. Se a grade estiver fechada, marcar Mira ou Tomas indica primeiro a fechadura.

Cada final apresenta o resultado específico da partida: quem foi libertado, quem atravessou, se Tomas ficou, se a ordem foi atrasada, se a prova saiu e o que Noah efetivamente fez. A coleção guarda o resultado mais recente de cada final; os descobertos antes desta atualização continuam acessíveis.

## Perigo e consequências persistentes - versão 10

- Revistas recorrentes durante a exploração: sacrificar a braçadeira, o pão ou a prova; denunciar Eron; ou resistir e se ferir. Nenhuma resposta é gratuita. Há 12 segundos de recuo após uma revista.
- Três advertências anteriores ou vigilância 8 fazem a próxima detecção terminar em captura. Dois ferimentos reduzem a velocidade em 30%; resistir novamente encerra a tentativa. A patrulha acelera por 20 segundos após uma resistência.
- Denunciar Eron no interrogatório ou em uma revista o envia à cela, encerra sua ajuda e bloqueia as rotas de grupo. Perder o registro elimina a prova e pode invalidar a mobilização coletiva no portão.
- O confinamento inicia um prazo de 10 ações para Tomas. Escolhas e preparações custam 1; revistas custam 2. Caminhar, ler, revisar tarefas, consultar o diário e recuar da fechadura não custam ações. Confirmar o confronto encerra a preparação.
- Destruir a ordem ganha 3 ações, mas elimina a prova. No último ponto do prazo, ainda é possível resgatar Tomas. Ao chegar a zero sem resgatá-lo, ele desaparece da cela e não pode ser recuperado nesta partida.
- Travessias coletivas, individuais e pela rota de Noah têm uma revista final obrigatória. A saída por disfarce exige que a autorização não tenha sido confiscada.
- HUD, diário, respostas dos personagens e epílogos registram essas perdas. Revistas pendentes e ferimentos persistem ao salvar e continuar.
- A chave abre a grade silenciosamente mesmo com vigilância alta. Arame e ronda continuam sujeitos ao limite de captura por ruído em vigilância 7.

O fluxograma foi atualizado para 11 etapas, incluindo o ciclo das revistas e o prazo de transferência. Os testes de regras verificam bloqueios por denúncia, prova confiscada, perda de itens, ferimentos, prazo, resgate na última ação, migração e persistência de revistas. A atualização de personalidades passou por 33 testes automatizados, incluindo as 12 tarefas, recompensas únicas, persistência e circulação por vários cômodos. No Chrome, foram conferidos aceitação, coleta, leitura, entrega e atualização da barra de relação, além dos painéis em 390 px de largura, sem erros de JavaScript.

## Créditos

Pesquisa: Enzo Raphael dos Reis Pessoa.

Ideia, História e Arte: Felipe Bertol Schneider.

Desenvolvimento: Enzo Raphael dos Reis Pessoa, Felipe Bertol Schneider.

## Abrir e jogar

Extraia toda a pasta e abra `index.html` em um navegador moderno. Não é necessário instalar nada, executar comandos ou ter conexão com a internet.

## Controles

| Ação | Computador | Celular |
| --- | --- | --- |
| Andar | WASD ou setas | Direcional na tela |
| Interagir / avançar fala única | E ou Espaço | Botão Interagir / botão da fala |
| Escolher resposta | Teclas 1–9 ou clique | Toque na escolha |
| Andar furtivamente | Segurar Shift | Ativar Furtivo |
| Abrir mapa | M ou botão MAPA | Botão MAPA |
| Diário | J ou botão DIÁRIO | Botão DIÁRIO |
| Inventário e leitura | I ou botão INVENTÁRIO | Botão INVENTÁRIO |
| Pedidos dos moradores | T ou botão TAREFAS | Botão TAREFAS |
| Pausar | Esc ou MENU | MENU |

O marcador dourado indica com quem conversar ou o que examinar. Uma seta na borda aponta para o objetivo quando ele está fora da tela. O mapa mostra a posição de Kali e um caminho sugerido. A interação exige proximidade: caminhe até o personagem ou objeto.

## Exploração e história

O orfanato contém dormitório, sala de leitura, corredores, salão do obelisco, cozinha, ala restrita, sala de observação e arquivos. Móveis e paredes bloqueiam o movimento. O acesso à ala restrita depende de abrir a grade. Os arquivos exigem resolver a abertura do altar.

As 37 etapas jogáveis têm destinos no mapa; outras seis cenas são os desfechos. A interação exige aproximar Kali do objeto ou personagem. Perto de dois pontos, o mais próximo recebe prioridade. Nos diálogos dos aliados, “Outros assuntos” permite acessar ações opcionais sem adiantar a missão principal.

Objetos e conversas opcionais não concedem confiança repetidamente: cada entrega, prova ou compromisso é registrado. O mapa considera as grades fechadas e não sugere atravessá-las. Os requisitos das escolhas aparecem nos próprios botões.

## Telas de encerramento

Cada um dos seis finais abre uma tela exclusiva, com ilustração pixel art, título, frase e epílogo completo. A Voz mostra a saída coletiva; A Luz, o amanhecer e a porta segurada por Noah; Sobrevivente, Kali sozinho na floresta; Traição, Noah diante dos adultos; Isolamento, o corredor sem saída; Sob Vigilância, a cela e a câmera.

Nessa tela, movimento e patrulhas ficam pausados. É possível voltar ao menu, iniciar novamente ou abrir a coleção. Conquistas permite rever apenas finais já descobertos, sem alterar a rota salva. Continuar uma partida concluída reabre sua tela de final. Uma nova partida preserva a coleção de finais. As telas têm rolagem em telas pequenas e navegação por teclado.

## Vigias e furtividade

Três vigias patrulham. Nas cenas noturnas, a visão deles passa a representar perigo. O campo de visão é direcional e é bloqueado por paredes e móveis. Segurar Shift reduz a velocidade e o alcance em que Kali pode ser percebido.

A barra de vigilância mostra a detecção em andamento. Quando completa, aumenta a suspeita da Actras; cada missão gera no máximo uma advertência desse tipo. Nas fases de resgate e fuga, ser descoberto e alcançar suspeita 7 ou mais leva à captura. Forçar a grade e atingir esse mesmo limite também leva à captura; a escolha avisa antes. Uma chave não aumenta a suspeita. Vigias e movimento ficam pausados enquanto você lê diálogos, usa o mapa ou abre um menu.

O botão COMO JOGAR inclui opções para ocultar os campos de visão e reduzir a animação dos marcadores. Som ambiente é opcional e começa desligado.

## Salvamento

O progresso, objetos, escolhas e posição são salvos automaticamente neste navegador. O modo 2D usa um salvamento próprio e não sobrescreve a partida da edição narrativa anterior. Os finais já descobertos usam a mesma coleção quando o navegador permite compartilhar esse armazenamento.

**Continuar partida** retoma a posição e a história. Iniciar novamente substitui a partida 2D, mantendo os finais descobertos. O armazenamento pode não persistir em modo privado, depois de limpar os dados ou quando o navegador bloqueia armazenamento em arquivos locais. O jogo informa quando não consegue salvar. Mover o arquivo ou usar outra versão/navegador pode separar os salvamentos.

## Código

- `index.html`: interface, menus, diálogos e controles de toque.
- `style.css`: aparência e layouts para computador e celular.
- `story.js`: roteiro, efeitos, requisitos e seis finais.
- `world.js`: mapa, móveis, colisões, visibilidade e objetivos.
- `adventure.js`: revisão ativa dos cinco atos, interações opcionais, pistas, consequências, relações e condições das fugas. Carregado depois de `story.js` e `world.js`.
- `assets.js`: carregamento das artes e mapeamento dos retratos.
- `pixel-art.js`: paleta, desenho dos oito cômodos, sprites direcionais e retratos.
- `render.js`: câmera, iluminação, personagens em cena, obelisco e minimapa.
- `tools/build-art.cjs`: gerador dos retratos e detalhe do altar; requer Node.js e `@napi-rs/canvas` apenas para recriar as imagens.
- `endings.js`: seis composições originais em Canvas e temas dos encerramentos.
- `danger.js`: revistas persistentes, custos, ferimentos, prazo e desfechos reativos.
- `game.js`: movimento, patrulhas, interações, diálogos, salvamento e áudio.
- `assets/altar-pixel.png`: detalhe do altar em pixel art.
- `assets/portraits.png`: atlas dos seis retratos.
- `assets/sprites.png`: atlas único dos oito personagens.
- `character-data.js` e `character-sprites.js`: recortes e reprodução dos sprites enviados.
- `assets/sprites.zip`: sprites atuais reunidos, originais e metadados.
- `tools/import-characters.py`: reconstrói o atlas e o ZIP.
- `social.js`: personalidades, 12 tarefas, itens e recompensas.
- `residents.js`: circulação dos moradores e acompanhamento do vigia por Noah.
- `tests/*.test.cjs`: testes de mapa, portas, sprites, interação, tarefas e circulação.
- `assets/menu-original.png`: tela inicial original restaurada.
- `historia-original.md`: roteiro original fornecido.

Para alterar o mapa, edite as salas e objetos em `world.js`. Para mudar a narrativa atual, edite as cenas e ações em `adventure.js`; `story.js` conserva a estrutura inicial e o motor de escolhas. Os objetivos revisados são registrados pelo módulo de aventura. Os personagens e a arte são definidos em `pixel-art.js`. O jogo pronto não depende de Node.js ou bibliotecas externas.

## Verificação desta atualização

Execute `node --test tests/*.test.cjs` (Node.js 18 ou mais recente). Os 33 testes cobrem mapa, colisões, portas, trancas, sprites, retratos estáticos, Mel, salvamentos e as 12 tarefas. Incluem sequência dos pedidos, requisitos de chaves, recompensas únicas, movimentação entre cômodos, proximidade de Noah ao vigia e atualização dos marcadores. A interface foi verificada também no Chrome, em computador e tela estreita, com coleta, leitura e entrega do livro de Mira e persistência da recompensa.

## Referências

Esta versão usa a história e a imagem anexadas. O Figma informado anteriormente não pôde ser consultado por falta de acesso da conta conectada; este mapa e esta interface são uma adaptação original. A trama mantém Kali, o Luzitruismo, a Actras e os finais A Voz, A Luz, Sobrevivente, Traição, Isolamento e Sob Vigilância. Inclui suspense, coerção e perseguição religiosa, sem imagens de violência explícita.

## Artes dos finais

Os seis finais usam a prancha `assets/finais/telas-finais-personagens-mel.png`, com roupas baseadas nos sprites e Mel junto a Kali em Sobrevivente e Isolamento. O jogo recorta somente as ilustrações: os títulos e botões pintados na prancha não são exibidos, mantendo os textos, consequências e controles reais da interface. A cena inteira permanece visível em computador e celular. Se a imagem não carregar, o desenho anterior serve de alternativa.
