# Artes do prólogo — 30/10/2026

Geradas com a ferramenta integrada image_gen. Referências: mapa atual, foto da família e atlas de sprites do projeto. A integração atual está descrita em `../../documentacao/ATUALIZACAO-30-10-2026.md`.

Desde 01/11/2026, o jogo usa `estrada-noturna-desenho-simples-v4.png`, `kali-banco-traseiro-pai-corrigido-v4.png`, `pais-no-carro-desenho-simples-v5.png` e a prancha `kali-crianca-sprites.png`. As três imagens têm traços limpos, cores chapadas e poucos detalhes. As cenas do acidente têm menos fogo. Os prompts finais estão em `desenhos-simples-2026-11-01-prompts.md`. As versões anteriores foram preservadas como fontes.

- `estrada-noturna-carro-azul.png`: cenário separado, sem personagens.
- `kali-crianca-sprites.png`: prancha de 16 poses, quatro direções por quatro quadros. Direções por linha: frente, esquerda, direita, costas.
- `pais-feridos-sprites.png`: quatro poses, mãe na linha superior e pai na inferior, cada um de costas no chão e de lado. Ferimentos estilizados sem detalhes gráficos.

Kali criança é desenhado diretamente da prancha, com recortes e alinhamento definidos em `javascript/prologue.js`. A prancha dos pais deitados permanece como fonte: a interação com o carro usa a ilustração em tela cheia.

## Prompts completos

### estrada-noturna-carro-azul.png

Fundo transparente solicitado: não.

Use case: stylized-concept. Create a NEW environment asset for the prologue of the pixel-art RPG DON'T BELIEVE. The attached map is a STYLE AND CAMERA REFERENCE ONLY: match its detailed dark 2D RPG pixel-art textures, crisp pixel clusters, overhead three-quarter orthographic view, and dramatic warm lights. Do not reproduce the interior map. Primary scene: a completely isolated rural asphalt road at night far from any town, surrounded by dark dense forest, in light rain after a crash. A BLUE passenger car lies fully upside down ON ITS ROOF, wheels pointing up, on the muddy road shoulder, visibly burning with orange flames and black smoke. The blue body must remain very clearly visible despite the fire. Road is a broad horizontal playable strip across the composition, exiting both left and right edges; dark forest above and below; broad muddy shoulder around car, plenty of empty traversable foreground area for separate character sprites. Show wet asphalt, worn center markings, skid marks toward the wreck, a few scattered fragments, faint moonlight, warm fire reflected on wet road. Camera looks down from high overhead like the provided RPG map, no horizon or cinematic vanishing point. Wide landscape 16:9 composition. The wreck is the focal point, small enough to leave space for characters beside it. Environment only: no people, no bodies, no other vehicles, no buildings, no streetlights, no text, no borders, no UI. This is a game background asset, not a poster or sprite sheet.

### kali-crianca-sprites.png

Fundo transparente solicitado: sim.

Use case: stylized-concept. Asset type: transparent pixel-art RPG character sprite sheet. Image 1 is CHARACTER IDENTITY reference: Kali is the red-haired boy with glasses in the middle of the family photograph. Image 2 is the GAME SPRITE STYLE reference: match its chibi JRPG proportions, crisp pixel clusters, dark outlines, 3/4 overhead game camera. Create Kali as a YOUNGER CHILD approximately 7 years old, clearly shorter, small body and slightly larger head proportions than teenage Kali. Preserve tousled deep-red hair, rectangular dark glasses, warm light skin, dark short-sleeved shirt over cream long sleeves, dark trousers and shoes, small metal pendant. Fully clothed, uninjured, anxious. Exact regular sheet: FOUR ROWS by FOUR COLUMNS, 16 full-body poses, one character in each equally sized cell, no extra poses. Rows in order: facing front/down, facing left, facing right, facing back/up. Columns are a four-frame WALK cycle, neutral/contact/passing/opposite-contact with visible alternating arms and feet; first frame of each row can serve as idle. Constant body scale, identical clothing, centered horizontally, aligned feet baseline within each cell, ample transparent padding, no touching or overlap. Entire background TRUE alpha transparency, including between limbs; no floor, no shadows, no checkerboard drawn, no scenery, no labels, no typography, no grid lines. Crisp low-resolution game pixel-art appearance, not a detailed portrait. Every character entirely visible with no cropping.

### pais-feridos-sprites.png

Fundo transparente solicitado: sim.

Use case: stylized-concept. Asset type: transparent 2D RPG pixel-art prop character sheet, two adult parents lying injured after an offscreen car accident, for a dark fictional game prologue. Image 1 is the family identity reference: mother at left has shoulder-length wavy brown hair, off-white long coat with dark lapel trim, charcoal top, blue jeans, black shoes; father at right has receding brown hair, navy button-up shirt with sleeves rolled, light cream trousers, black belt and black shoes. Image 2 is pixel-art sprite style reference. Match game-ready chibi JRPG sprite proportions, crisp pixel clusters, dark outlines, 3/4 overhead camera viewing people lying on the ground. TWO ROWS by TWO COLUMNS, exactly FOUR separate full-body sprites. Top row mother: first lying on her back, head to left, feet right; second lying on her side, head left, feet right. Bottom row father, same two poses and orientation. Adults are lying motionless with closed eyes and relaxed limbs; show a small restrained dark-red blood stain on clothing and a small dark-red patch immediately near the shoulder/head to communicate injury. Mild non-graphic blood only, no visible open wounds, no exposed anatomy, no dismemberment, no burns, no gruesome detail. Fully clothed. Every adult recognizable and entirely in frame, consistent proportions and scale, same identity in both poses, each sprite centered in one equal grid cell, wide transparent gutters, no overlapping. Background TRUE alpha transparency, no drawn checkerboard, no floor, no scenery, no car, no child, no captions, no labels, no grid. Render as small game sprites, not realistic bodies or portraits.
