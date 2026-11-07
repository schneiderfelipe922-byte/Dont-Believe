# Exploração e versão móvel — 29/10/2026

A faixa externa com o título foi removida da tela inicial. O menu conserva sua ilustração original e passa a começar no topo da janela.

O atlas atual é carregado com uma revisão calculada por SHA-256, junto das revisões de scripts e CSS. As dimensões do atlas também são verificadas. O renderer deixou de substituir o personagem por desenhos procedurais antigos quando a imagem está ausente; nesse caso, iniciar/continuar oferece nova tentativa. A preparação não altera nem limpa os salvamentos.

Os objetos de chão passaram para uma camada anterior aos personagens. Cartas, documentos, fotos, livros, chaves e outros itens têm sprites próprios, inclusive as miniaturas das fotografias de família e de Eron/Tomas. A coleta e os requisitos narrativos permanecem os mesmos.

Os dois criados-mudos do dormitório têm gavetas que abrem e fecham com E ou Interagir no celular. A frente do móvel muda, mantendo o tampo e a vela existentes. Abertura e fechamento não gastam ações nem alteram relações, inventário ou pistas. O estado é salvo em `world.drawers`; saves anteriores recebem gavetas fechadas.

## Arte

Artes criadas com a ferramenta integrada de geração de imagens. Brief utilizado: objetos pequenos de RPG gótico em pixel art, madeira escura, papel envelhecido, luz âmbar, cartas e fotografias deitadas, transparência real; criado-mudo idêntico em duas poses, gaveta fechada e aberta em direção ao jogador. Referências: mapa atual e as duas fotografias existentes. Os prompts completos e as saídas de geração estão registrados nesta conversa. Fontes raster preservadas em `assets/exploracao/fontes/`; normalização técnica reproduzível em `tools/normalize-exploration-art.py`.

## Verificação e distribuição

- Testes de regras e integração: `previas/exploracao/testes.txt`.
- Playtest: `tools/playtest-exploration.cjs`. Aquece o cache com um atlas e script antigos de teste, abre a nova versão e compara o hash do atlas carregado. Confere toque e teclado, gavetas persistidas, ausência de alterações na história, itens sob Kali, coleta da foto e recuperação após falha do atlas.
- Capturas de computador, celular com toque e orientação horizontal: `previas/exploracao/`.
- Regressões de controles, tela cheia e diálogos: relatórios `.txt` no mesmo diretório.
- `python3 tools/package-web.py` prepara a distribuição e atualiza as revisões. O ZIP em `output/` contém uma pasta completa, incluindo o retrato e os sprites atuais de Mel. Extraia a pasta inteira e substitua a versão anterior.

A verificação móvel usa emulação do Chromium. Não houve acesso ao aparelho nem ao endereço em que a cópia anterior foi aberta, portanto o cache não foi confirmado como a causa específica naquele aparelho; tanto o cache antigo quanto a falha do atlas foram tratados e reproduzidos no teste.
