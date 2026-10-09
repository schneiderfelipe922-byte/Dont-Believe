# Don't Believe — colisões e finais

Revisão de 7 de outubro de 2026, realizada com a skill Game Playtest do Game Studio.
Projeto principal: `/Users/Admin/Desktop/dont-believe-5/index.html`.

## Problemas corrigidos

- **Portas fechadas:** o bloqueio tinha apenas 8 pixels de altura, apesar de a folha ocupar uma faixa muito maior da imagem. Agora toda a faixa visível bloqueia os pés. O fechamento verifica essa mesma área para o jogador e outros personagens.
- **Sobreposição visual:** personagens eram desenhados por cima das portas e de todo o cenário. Portas, móveis e personagens agora são ordenados pela posição dos pés, mantendo a cobertura correta de quem está atrás.
- **Móveis e janelas:** cadeiras, pés das camas, bancos, mesas, bancadas, obelisco e trechos das paredes laterais tinham áreas sem bloqueio. Os limites físicos foram ajustados à imagem do mapa.
- **Passagens:** uma exceção ampla ignorava sólidos dentro dos retângulos de passagem. Agora apenas os vãos reais são recortados das paredes; objetos e laterais continuam sólidos.
- **Sala de observação:** a passagem atravessava uma parede desenhada. O acesso agora tem um vão visível e livre.
- **Noah:** seguir a trilha do vigia alterava sua posição diretamente. O acompanhante agora passa pela mesma verificação de colisões usada pelo jogador.
- **Rotas:** o percurso considera a largura dos pés em cada segmento e usa uma malha menor para encontrar os espaços estreitos junto às bancadas. Objetivos e personagens são reposicionados em piso alcançável; partidas antigas recuperam posições que ficaram obstruídas.

## Finais verificados

Uma partida desde o prólogo foi simulada para cada final com escolhas válidas, deslocamento pelo motor real de colisão, desbloqueios, preparações e resolução do cerco.

| Final | Condição exercitada | Resultado |
|---|---|---|
| A Voz | Mira livre, Eron aliado, rota combinada e apoio ao grupo | Passou |
| A Luz | Mira livre, Eron aliado e trinco aberto por Noah | Passou |
| Sobrevivente | Trajeto aprendido e fuga individual | Passou |
| Traição | Seguir Noah sem verificar a oferta | Passou |
| Isolamento | Fugir sozinho sem aprender o trajeto | Passou |
| Sob Vigilância | Tentar uma fuga coletiva sem preparação suficiente | Passou |

Também foram conferidos a perda da prova no cerco, que pode cancelar a fuga coletiva, e o retorno com chave após a transferência de Tomas, que não deve inventar um resgate impossível.

No navegador, os salvamentos produzidos por essas rotas foram usados para verificar as últimas escolhas, as seis telas de epílogo, o registro na coleção, a releitura e o retorno ao menu. As decisões finais foram executadas pelos controles da interface.

## Verificação

- **75 testes automatizados aprovados; nenhuma falha.** Incluem os testes existentes de diálogos, moradores, Mel, sprites, fotos, pedidos e salvamento.
- Varredura dos pontos de piso, colisões contra móveis, janelas e paredes, diagonais e movimentos grandes.
- Duas portas testadas por teclado: bloqueio ao aproximar pelo norte e sul, abertura com E, passagem quando abertas e recusa ao fechar sobre o jogador.
- Carregamento das imagens, ausência de erros JavaScript e visualização em 1440 × 1000 e 390 × 844.
- As verificações foram feitas em Chromium. Safari e outros navegadores não foram executados nesta revisão.

Evidências: [testes](testes.txt), [resultado do navegador](verificacao-browser.json), [mapa de colisões](mapa-colisoes.png), [grade fechada](cell-fechada.png), [grade pelo norte](cell-norte-fechada.png), [porta dos arquivos pelo norte](archive-norte-fechada.png).

Telas finais: [A Voz](final-voz.png), [A Luz](final-luz.png), [Sobrevivente](final-sobrevivente.png), [Traição](final-traicao.png), [Isolamento](final-isolamento.png), [Sob Vigilância](final-captura.png).

## Repetir os testes

Na pasta principal do projeto:

```sh
node --test tests/*.test.cjs
```

A verificação do navegador está em `tools/playtest-browser.cjs`; exige Playwright e Chromium disponíveis. Pode usar `NODE_PATH` para encontrar uma instalação já existente de Playwright, ou `PLAYWRIGHT_MODULE_PATH` para indicar o módulo. `PLAYWRIGHT_BROWSERS_PATH` pode indicar o navegador de teste.

Os arquivos anteriores às correções estão em `backups/antes-colisoes-2026-10-07/`. A cópia interna `Dont-Believe/` não é o projeto principal revisado; use o `index.html` da raiz indicado acima.
