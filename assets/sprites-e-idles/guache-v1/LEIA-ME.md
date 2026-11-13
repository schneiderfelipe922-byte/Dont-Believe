# Sprites em guache — integrados em 13/11/2026

Os dez personagens agora usam estas artes no jogo. Caminhadas de frente e costas usam as folhas corrigidas v2; laterais e idles conservam as folhas aprovadas. Pais permanecem com idle. `javascript/painted-sprites.js` registra recortes, âncoras, escala e imagens; `character-sprites.js` resolve os quadros. Os PNGs originais foram preservados.

Validação: 131 testes aprovados, incluindo ciclo de seis frames, seleção das folhas corrigidas, estabilidade dos pés, falha de imagem e seis finais. Revisão no navegador em computador, celular e horizontal. Há texturas e resíduos sutis de alpha nas fontes geradas; não impedem a leitura nas capturas revisadas. Suavização da cauda de Mel pode receber polimento futuro. A prévia continua disponível em `previa.html`.

Critérios: clareza atende por identidade, direção e apoio dos pés preservados; pistas e escolhas atendem por preservação; seis finais atendem por preservação de regras e rotas testadas. Sem teste com jogador novo. Backup dos módulos anteriores em `backups/antes-sprites-guache-2026-11-13`.

---

## Histórico da preparação e revisão anterior à integração

# Sprites em guache — prévia v1

Abra `previa.html` no navegador. Não é necessário instalar dependências ou iniciar o jogo. Use os controles para escolher caminhada/repouso, pausar, reduzir a velocidade e comparar com a escala atual do jogo.

## Conteúdo

Dez personagens: Kali, Mira, Eron, Noah, Tomas, Vigia, Líder, Daty, Inauri e Mel. Cada personagem possui quatro direções: frente, esquerda, direita, costas, nesta ordem de linhas. Caminhada: seis frames por direção, oito personagens. Repouso: quatro frames por direção, dez personagens. Os pais não receberam caminhada. Total previsto: 18 folhas e 352 poses.

As imagens seguem guache seco, formas angulares orgânicas, cabelo em grandes massas, contornos seletivos e sombras violetas. Identidades baseadas nos retratos aprovados. Manter a expressão contida; a arte de Tomas é genérica para movimentação, não substitui a revelação de privação na cela.

Os PNGs gerados são preservados sem repintura automática. `frames.json` descreve os recortes e as âncoras usados na prévia. Uma escala comum por folha preserva proporções entre frames; o alinhamento inferior estabiliza os pés. A prévia adapta folhas de resoluções diferentes para a altura atual de cada personagem. Mel permanece mais baixa em repouso.

## Estado

Solicitação do usuário: criar arquivos e prévia animada primeiro. **Não integrado ao jogo, não enviado ao GitHub.** Os sprites ativos, recortes, colisões, salvamentos, pistas, decisões e finais continuam intactos.

Antes da integração, aprovar o movimento e a aparência em escala pequena. A aprovação da folha estática não basta: conferir ritmo, contato dos pés, alterações de silhueta e transição entre idle e caminhada. A avaliação com jogador novo ainda não foi realizada.

Ferramenta de criação: image_gen integrada. Prompts e referências: `generation.json`. Leitura de transparência e geração de metadados: `tools/inspect-painted-sprites.cjs`. Prévia: HTML Canvas, sem modificar os PNGs.

## Revisão realizada

18 folhas carregadas; 352 recortes não vazios, sem contato com as bordas externas. Prévia verificada no computador e celular, incluindo avanço dos frames e pausa. Os recortes são identificados pela silhueta, pois a geração não garantiu uma grade perfeitamente regular. Algumas folhas de caminhada contêm resíduos de alpha muito baixo no fundo: revisar a limpeza fina em fundos claros antes da integração definitiva. A prévia é para avaliação da direção visual e movimento, não um atlas final aprovado.

## Correção de frente e costas — v2

Oito folhas adicionais `*-walk-front-back-v2.png`, cada uma com duas linhas e seis colunas: frente e costas. Substituem apenas essas direções na prévia. As folhas originais continuam preservadas e fornecem as caminhadas laterais; os idles não foram alterados. Total: 26 folhas, com 96 novas poses e 352 poses utilizadas pela prévia.

`tracks.walk.directions[0]` e `[3]` em `frames.json` indicam os arquivos, recortes e escala dessas direções; consumidores devem respeitar essas substituições. Não usar apenas a folha antiga para integrar frente/costas. Criação pela image_gen integrada; prompts e origens na seção `corrections` de `generation.json`.

Os contatos de apoio dos frames 1 e 4 usam pernas opostas. A prévia inclui “Próximo frame”, contador e velocidade reduzida. Validação: 96 recortes novos completos; carregamento dos dez personagens, animação, pausa, avanço manual e retorno após seis frames; computador e celular sem erro de JavaScript ou transbordamento horizontal. Capturas de comparação em `previas/sprites-guache/apoio-frame-1.png` e `apoio-frame-4.png`.

Critérios: clareza atende ao tornar o passo alternado visível; pistas e escolhas atendem por preservação integral; consequências dos seis finais atendem por preservação integral. Escopo somente visual na prévia, sem mudança de história, controles ou dados salvos. Nenhum teste com jogador novo. Continua sendo material de revisão: limpeza fina de alpha e suavização de transições, especialmente a cauda de Mel, devem ser revistas antes de integrar.
