# Don’t Believe — O Obelisco

Jogo narrativo de exploração e investigação em 2D, desenvolvido com HTML, CSS e JavaScript. Explore OldHood, converse com personagens, reúna pistas e acompanhe as consequências de suas escolhas.

## Executar

Abra `index.html` no navegador, mantendo as pastas `assets`, `css` e `javascript` junto dele. Para testar por HTTP, execute `python3 -m http.server 8000` na raiz e acesse <http://localhost:8000>.

**Controles:** WASD ou setas para mover; E para interagir; C para controles; J para diário; I para objetos; T para pedidos; M para mapa; F para tela cheia. Celulares possuem controles de toque.

## Checklist dos critérios de avaliação

Cada critério vale **2,0 pontos**, totalizando **10,0 pontos**. A tabela registra a implementação e o alcance das verificações; a pontuação final depende da avaliação.

| Critério | Situação | Por que atende / evidências |
| --- | --- | --- |
| Deploy e funcionamento | Implementado; validação do endereço público pendente | `index.html` é a entrada da aplicação. `vercel.json` configura o build `node tools/build-vercel.cjs` e a saída `vercel-dist`. O build verifica os recursos referenciados e copia HTML, CSS, JavaScript, imagens e fontes para publicação. É necessário registrar e testar o link publicado para confirmar carregamento sem tela branca, listagem de pastas ou erros de recursos. |
| Interatividade sem recarregamento | Atendido nos fluxos do jogo | Cliques abrem menus, avançam diálogos, alternam abas e marcam ou removem objetivos via JavaScript, atualizando a interface sem navegar ou recarregar. `javascript/game.js` usa `addEventListener` e `preventDefault()` nos eventos com comportamento nativo a cancelar, incluindo teclado, toque e fechamento do modal. O projeto não possui formulários nem cadastro CRUD: cadastrar, editar e remover itens de formulário não se aplicam ao jogo. |
| Persistência de dados | Implementado | `javascript/game.js` lê e grava o progresso em `localStorage`, com serialização JSON e tratamento de falhas. Após F5, a opção **Continuar partida** recupera o progresso salvo; não é necessário iniciar uma nova partida. A persistência depende de o navegador permitir armazenamento local e de usar a mesma origem. |
| Estabilidade do console | Verificado nos fluxos automatizados registrados | As verificações do diário e dos diálogos registram `errors: []`, sem exceções JavaScript capturadas durante esses fluxos. Evidências: `previas/diario/verificacao.json` e `previas/dialogos-compactos/verificacao.json`. Isso não substitui a inspeção completa do Console e da aba Network na versão publicada. |
| Adaptabilidade e responsividade | Verificado nos layouts registrados | CSS com media queries, dimensões adaptáveis, áreas de toque e rolagem interna. O diário foi verificado em 1280×900, 390×844 e 844×390, incluindo ausência de transbordamento horizontal no conteúdo móvel; os diálogos verificam paginação sem cortes. `index.html` utiliza `lang="pt-BR"`, viewport, tags semânticas como `main`, `section`, `button` e `dialog`, textos `alt` nas imagens e nomes acessíveis nos controles e canvas. |

## Roteiro de conferência para entrega

- [ ] Inserir aqui o **link público da aplicação** após a publicação.
- [ ] Abrir esse link em uma janela privada e confirmar que CSS, JS, imagens e fontes carregam, sem erros no Console ou na aba Network.
- [ ] Jogar, abrir o diário, alternar abas e marcar/remover um objetivo, confirmando que a página não recarrega.
- [ ] Salvar progresso, pressionar F5 e escolher **Continuar partida** para conferir a recuperação dos dados.
- [ ] Exercitar menus, opções, diálogos, mapa e controles com o Console aberto.
- [ ] Testar celular em retrato e paisagem, conferindo leitura, toque e ausência de rolagem horizontal indesejada.

## Verificações e publicação

```sh
node --test tests/*.test.cjs
node tools/build-vercel.cjs
```

Os scripts `tools/playtest-notebook.cjs` e `tools/playtest-compact-dialogue.cjs` usam Playwright e um navegador Chromium instalado para verificar a interface. Relatórios e capturas ficam em `previas/`.

Para publicar na Vercel, utilize a configuração existente em `vercel.json`. A pasta gerada `vercel-dist` contém a versão web distribuível.

## Organização

- `javascript/`: regras, renderização, interações e salvamento.
- `css/`: tema e layouts responsivos.
- `assets/`: imagens, sprites e fontes locais com suas licenças.
- `tests/` e `tools/`: testes e ferramentas de verificação/build.
- `documentacao/`: documentação detalhada.
- `Dont believe/`: projeto Unity independente da aplicação web.

Consulte também [o guia do jogo](sobre-o-jogo.md) e [as orientações de execução](LEIA-ME.txt).
