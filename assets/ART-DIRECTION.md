# Direção de arte — edição pixel art

Referência atual: `5136987070467058.jpg`, ambiente pixel art sombrio com tábuas horizontais avermelhadas, paredes de vinho escuro, janelas alaranjadas, madeira gasta e pilhas de livros. O ambiente continua em vista superior jogável. Os elementos narrativos do quarto anterior permanecem: cama com coberta azul-esverdeada, criado-mudo com livro, janela, armário, baú, escrivaninha, livros, papéis e tapete redondo.

Todos os oito ambientes são desenhados por `pixel-art.js`, com a mesma paleta e linguagem de móveis. Não há fotografias ou pinturas realistas recortadas nos cenários. A paleta é avermelhada e dessaturada, com sombras mais profundas e velas quentes abrindo áreas de luz na penumbra; movimento e sprites usam coordenadas arredondadas e interpolação desativada.

## Personagens — importação atual

A atribuição segue a ordem explícita do usuário: Mira = primeiro conjunto `Idle_walking`; Eron = conjunto `Walking_to_8_positiv`; Kali = PNG com 35 quadros; Noah = conjunto `Idle_walking` com sufixo `-2`. As cores e roupas são as dos arquivos fornecidos, substituindo as interpretações anteriores. As artes de origem permanecem em `characters/source/`.

Os atlas ativos preservam os pixels dos GIFs e o PNG original. Nenhuma marca ou transparência do arquivo de Kali foi removida. Os retratos são recortes dessas mesmas artes. Adultos continuam usando os retratos e sprites nativos de capa preta. Os pontos de apoio são registrados em `character-data.js` para manter os pés alinhados entre as direções.

`menu-original.png` restaura a tela inicial original do casarão OldHood, conforme a revisão solicitada, com as seis áreas interativas existentes. A alternativa `menu-pixel.png` está arquivada e não é exibida. `altar-pixel.png` é a inspeção do altar de ametista. `tools/build-art.cjs` recria ambos e o atlas a partir do código, sem acesso à rede. As outras versões realistas antigas permanecem em `references/` apenas como referências de origem.

A moldura dos diálogos é construída em CSS com bordas de madeira. Os cenários, personagens e retratos são desenhos nativos em Canvas, não filtros de redução de uma imagem realista. O nome Leonard da captura antiga não substitui os personagens do roteiro.

## Encerramentos e menu

A tela inicial original continua ativa. Os estados de hover, foco e pressão de seus botões são vermelhos. `endings.js` desenha seis composições distintas vinculadas aos seis desfechos reais do roteiro, com título, epílogo e ações de navegação. A coleção permite rever finais desbloqueados. Todas as ilustrações de encerramento são construídas com arte nativa em Canvas.

## Revisão dark e sprites animados

O atlas de movimento contém seis personagens × quatro direções × nove quadros (uma pose parada e oito passos), totalizando 216 células de 32 × 40 pixels. A folha exportada está em `sprites.png`; o jogo cria e reutiliza o mesmo atlas em Canvas. As cores identificadoras permanecem, enquanto os cenários usam madeira vinho dessaturada, sombras azul-violeta, paredes desgastadas e focos de vela. Há balanço de braços, pernas alternadas, movimento das capas, respiração discreta e orientação para o jogador. As transições dos personagens não atravessam os móveis.

## Créditos solicitados

Pesquisa: Enzo Raphael dos Reis Pessoa.

Ideia, História e Arte: Felipe Bertol Schneider.

Desenvolvimento: Enzo Raphael dos Reis Pessoa, Felipe Bertol Schneider.
