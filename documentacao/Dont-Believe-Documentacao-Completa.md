> Atualização de 25/09/2026: vigia com os novos sprites fornecidos; gata Mel no dormitório com interação de carinho; mapa reestruturado e portas físicas com estado salvo. O atlas ativo agora é `assets/sprites-e-idles/sprites.png` para os oito personagens, e `assets/sprites-e-idles/sprites.zip` reúne os originais atuais. Consulte `LEIA-ME.md` para a estrutura e os testes atuais. As descrições históricas abaixo sobre atlas individuais e exportações antigas foram superadas.

# DON’T BELIEVE — O Obelisco
## Documentação completa do projeto, história e implementação

**Atualizado em:** 25 de setembro de 2026.  
**Estado documentado:** jogo e código entregues na versão 12, após a correção das poses paradas de todos os personagens e do retrato estático de Kali.  
**Idioma:** português brasileiro.  
**Aviso:** este documento contém spoilers de todos os caminhos e finais.

Este arquivo reúne o que foi solicitado, construído, revisado e verificado nesta conversa. As regras atuais foram conferidas nos arquivos do jogo. Solicitações anteriores que foram substituídas estão identificadas como histórico. A versão 12 se refere à entrega do arquivo; números internos de salvamento e de revisão narrativa são independentes.

## Sumário

1. Identidade e objetivo do jogo
2. Créditos
3. História e universo
4. Personagens
5. Estrutura narrativa e investigação
6. Exploração, mapa e controles
7. Relações, objetos e interações
8. Perigo, revistas e prazo de Tomas
9. Rotas e seis finais
10. Consequências visíveis
11. Direção visual e interface
12. Sprites, idles e retratos
13. Salvamento, acessibilidade e áudio
14. Histórico das alterações
15. Arquitetura e arquivos
16. Fluxograma e entregas
17. Testes e limites de verificação
18. Cuidados para continuar o projeto
19. Catálogo das cenas e escolhas
20. Catálogo das interações opcionais

## 1. Identidade e objetivo do jogo

- **Título:** DON’T BELIEVE.
- **Capítulo único:** O Obelisco.
- **Gênero:** aventura narrativa de suspense, investigação e furtividade.
- **Perspectiva:** 2D top-down, com exploração controlada pelo jogador.
- **Tecnologias:** HTML, CSS e JavaScript puro; desenho do mundo em Canvas 2D.
- **Protagonista jogável:** Kali.
- **Local principal:** orfanato OldHood, controlado pela Actras.
- **Estrutura atual:** 43 cenas, sendo 37 etapas com objetivos no mapa e seis encerramentos, distribuídas narrativamente em cinco atos.
- **Objetivo dramático:** preservar a própria identidade, descobrir o destino dos moradores desaparecidos, recuperar o símbolo confiscado e decidir como sair — e por quem voltar.
- **Objetivo de design:** fazer a confiança depender de ações verificáveis e dar às escolhas consequências materiais, compreensíveis e persistentes.

O jogo pode ser aberto localmente. Não requer instalação, servidor, conta, banco de dados ou conexão com a internet para jogar. Há uma entrega em HTML único e outra com código e recursos separados.

## 2. Créditos

**Pesquisa:** Enzo Raphael dos Reis Pessoa.  
**Ideia, História e Arte:** Felipe Bertol Schneider.  
**Desenvolvimento:** Enzo Raphael dos Reis Pessoa, Felipe Bertol Schneider.

Esses são os créditos solicitados pelo usuário e exibidos no menu do jogo.

## 3. História e universo

### 3.1. Prólogo

Kali viaja com os pais numa noite chuvosa. A família segue o Luzitruismo. Depois de uma colisão, ele é levado para OldHood e o símbolo religioso de sua família é confiscado e catalogado. A lembrança da mãe associa a crença à liberdade de decidir por si mesmo.

O roteiro original fornecido mostra perseguidores identificando os Luzitruistas, a tentativa de fuga e a captura da criança. A versão jogável apresenta a experiência em fragmentos da memória de Kali. Nos arquivos, a recuperação do objeto não revela automaticamente uma explicação completa sobre a morte dos pais; o texto deixa essa ausência explícita.

### 3.2. Anos depois

Kali tem quatorze anos. O orfanato impõe silêncio, obediência, vigilância e restrições de comunicação. Câmeras, sinos, chamadas e grades organizam a rotina. Perguntar por alguém pode expor a pessoa que respondeu.

O desaparecimento de Tomas inicia uma investigação. Mais tarde, Mira também é levada. As “transferências” anunciadas pelos adultos escondem retenção na ala leste e encaminhamento a outra unidade da própria Actras.

### 3.3. Actras e Luzitruismo

- **Actras:** culto que controla o orfanato. Os adultos exercem vigilância, interrogam, restringem circulação e usam permissões como forma de controle.
- **Luzitruismo:** crença de Kali e de sua família. Seu símbolo confiscado é uma lembrança pessoal e um elemento da história.
- **Obelisco de ametista:** centro visual do altar; sua base contém o mecanismo que abre a passagem para os arquivos.

Não foram definidos em detalhe um país, uma cidade, uma data histórica ou um sistema completo de doutrinas para essas crenças. Não se deve inventar esses dados como se já fossem parte estabelecida do jogo.

## 4. Personagens

| Personagem | Papel e relações | Aparência atual |
| --- | --- | --- |
| **Kali** | Protagonista. Investiga OldHood, tenta recuperar o símbolo e escolhe entre proteger, negociar, denunciar ou fugir. | Cabelo loiro comprido, túnica e gorro verdes, inspirado visualmente em Link. |
| **Mira** | Aliada desconfiada de promessas. Ajuda a interpretar as bandejas e a ala leste, deixa um aviso e pode organizar os moradores depois de libertada. | Cabelo preto, franja, blusa branca de mangas compridas e saia preta comprida. |
| **Eron** | Conhece a passagem de serviço e as rondas. Pode distrair os vigias e organizar a saída. Uma denúncia de Kali encerra sua colaboração. | Cabelo roxo comprido, roupa preta desgastada. |
| **Noah** | Tem ligação com a Actras e participa das denúncias. Pode entregar Kali; sua ajuda posterior precisa ser comprovada pela abertura do trinco. | Cabelo loiro curto, camisa azul-clara e calça azul muito escura. |
| **Tomas** | Morador desaparecido, identificado como T-17. Seu resgate dá um objetivo concreto à investigação e pode ser perdido pelo prazo. | Sprite de apoio; não recebeu um dos quatro ZIPs principais. |
| **Vigias** | Adultos que patrulham, controlam acessos, interrogam e revistam. | Conjunto encapuzado enviado, com caminhada nas quatro direções. |
| **Líder da Actras** | Representa a autoridade no confronto final. | Visual escuro próprio dos adultos. |
| **Pais de Kali** | Presentes na lembrança inicial e no significado do símbolo. | Não são personagens controláveis na exploração. |

**Histórico visual:** anteriormente Eron foi pedido com cabelo azul, Noah com camiseta vermelha e Mira segundo uma referência específica. Os arquivos enviados depois substituíram essas definições. A tabela acima registra as artes atualmente utilizadas.

## 5. Estrutura narrativa e investigação

### Ato I — O nome que falta

O prólogo leva ao dormitório, à primeira conversa com o vigia e ao altar. Kali decide como responder à imposição religiosa e como se aproximar de Mira e Noah. Revelar informações a Noah pode reaparecer no interrogatório.

### Ato II — Seguir as provas

Eron aponta a cama de Tomas. A cadeia de evidências foi construída para que cada descoberta indique um próximo lugar:

**Cama vazia → etiqueta T-17 → livro de chamadas → caixa da cozinha → requisição da ala leste → confirmação de que Tomas está retido.**

O livro também ensina a ordem dos símbolos do altar. Depois das provas, Kali escolhe entre preparar aliados, usar serviço e obediência para conseguir acesso ou observar a ronda por conta própria.

### Ato III — O preço da confiança

No interrogatório, Kali pode esconder informações, defender sua crença, proteger outras pessoas ou denunciar Eron. Mira desaparece e deixa um recado com sua localização e uma advertência sobre Noah.

Noah oferece uma suposta oportunidade de recuperar o símbolo. Segui-lo cegamente leva à armadilha. Investigar a porta permite perceber adultos esperando. Confrontá-lo abre a possibilidade de exigir uma reparação concreta: soltar o trinco do portão, cuja abertura ainda precisará ser verificada.

### Ato IV — Portas e promessas

O confinamento inicia o prazo de transferência de Tomas. Kali precisa abrir a grade por chave, distração, arame ou intervalo da ronda. Pode libertar Mira, adiar o resgate e voltar, ou deixá-la para trás. Tomas permanece atrás da divisória enquanto não for resgatado ou transferido.

O mecanismo do altar usa a sequência **sino → chama → raiz**. A sequência correta abre o acesso aos arquivos. Errar aumenta a vigilância; ler a inscrição não custa uma ação do prazo.

### Ato V — Antes do amanhecer

Nos arquivos, Kali encontra a ordem de transferência e escolhe entre levar o registro assinado ou destruí-lo para ganhar tempo. Recupera o símbolo e pode concluir resgates, combinar a fuga e verificar Noah.

A confirmação na mesa de planejamento encerra a preparação. O confronto define a rota. Nas rotas que passam pela Travessia, uma revista obrigatória pode cobrar o último recurso ou um ferimento. Ainda é preciso alcançar o portão.

## 6. Exploração, mapa e controles

### 6.1. Ambientes

O mapa usa uma grade de **62 × 46 células**, com **24 pixels por célula**, totalizando 1488 × 1104 pixels de coordenadas do mundo antes do zoom da câmera.

| Ambiente | Função |
| --- | --- |
| Dormitório | Início, câmera, camas, bilhete de Eron, pistas de Tomas e aviso de Mira. |
| Sala de leitura | Livro de chamadas, registro T-17 e código do altar. |
| Ala restrita | Grade, cela de Mira e divisória de Tomas. |
| Corredor dos vigias | Circulação principal, patrulha, confronto e acesso ao portão. |
| Salão do obelisco | Ritual, conversas com Mira e entrada oculta do altar. |
| Cozinha | Caixa T-17, ferramentas, pão, serviço, distração e preparação da fuga. |
| Sala de observação | Interrogatório, armadilha de Noah e chave da ala leste. |
| Arquivos subterrâneos | Registro assinado, ordem de transferência e símbolo confiscado. |

Paredes e móveis sólidos bloqueiam o movimento. A grade e a porta dos arquivos dependem de eventos da história. O cálculo de caminho do mapa considera esses bloqueios.

### 6.2. Controles

| Ação | Computador | Toque |
| --- | --- | --- |
| Andar | WASD ou setas | Direcional |
| Interagir | E ou Espaço | Interagir |
| Escolher resposta | Clique ou números 1–9 | Toque na opção |
| Avançar quando há uma única resposta | E ou Espaço | Botão exibido |
| Furtividade | Segurar Shift | Alternar Furtivo |
| Mapa | M ou MAPA | MAPA |
| Diário | J ou DIÁRIO | DIÁRIO |
| Pausa/menu | Esc ou MENU | MENU |

Durante um diálogo, Esc tenta fechá-lo. Revistas obrigatórias não podem ser descartadas dessa forma. O menu pode pausar a experiência, mas não apaga uma revista pendente.

### 6.3. Orientação do jogador

- Marcador dourado: objetivo principal.
- Marcador azul: preparação opcional.
- Seta na borda: aponta para objetivo fora da câmera.
- Mapa: localização, portas e caminho sugerido.
- Diário: pistas, relações, tarefas, requisitos das rotas e histórico.
- Inventário: objetos e indicação de onde utilizá-los.
- Interações exigem proximidade; quando há mais de um ponto próximo, o jogo compara as distâncias.

## 7. Relações, objetos e interações

### 7.1. Relações

`adults`, `mira`, `eron` e `noah` variam de 0 a 9. `suspicion`, também de 0 a 9, representa a vigilância acumulada. Números negativos são limitados a zero.

Confiança não substitui portas abertas ou tarefas executadas. Ter proximidade com Noah, por exemplo, não prova que o portão está destrancado. As escolhas podem ter requisitos que aparecem no botão antes de confirmar.

### 7.2. Objetos e usos

| Objeto ou informação | Uso e consequência |
| --- | --- |
| Etiqueta T-17 | Liga Tomas ao registro. |
| Cópia do registro / página original T-17 | Pista para a caixa da cozinha. Arrancar a página aumenta a vigilância e deixa um vestígio. |
| Requisição da ala leste | Confirma retenção; pode ser mostrada a Eron. |
| Trajeto de Eron | Ensina a passagem correta de saída. |
| Horário da ronda | Permite aproveitar a abertura da grade. |
| Arame | Abre a grade com ruído menor; é consumido. |
| Pão | Pode ser entregue a Mira ou perdido num suborno ao vigia. |
| Braçadeira de serviço | Sinal visual de serviço; pode ser confiscada para atravessar uma revista. |
| Chave da ala leste | Acesso silencioso à grade; pode permitir o retorno pelas celas. |
| Aviso de Mira | Localização da cela e contradição da oferta de Noah. |
| Registro de transferência | Prova assinada; ajuda a mobilizar moradores e altera o epílogo. Pode ser confiscada. |
| Símbolo do Luzitruismo | Lembrança recuperada da família de Kali. |

### 7.3. Preparações opcionais

Pegar pão, buscar arame, estudar a ronda, cobrir a câmera, conversar com Mira, preparar Eron, verificar Noah, libertar Tomas e retomar a grade são ações registradas. Entregas e compromissos específicos não podem ser repetidos para acumular recompensas indefinidamente.

A câmera coberta reduz a vigilância em um ponto, uma vez. Isso não impede a visão direta dos vigias. Entregar pão a Mira consome o item e aumenta sua confiança. Mostrar a requisição a Eron e assumir uma tarefa aumentam a confiança dele. Preparar a rota coletiva exige recuperar o símbolo e ter Eron com confiança suficiente.

## 8. Perigo, revistas e prazo de Tomas

### 8.1. Patrulhas e detecção

Há três patrulhas móveis, além dos adultos posicionados para encontros. Durante as cenas marcadas como noturnas, a visão dos patrulheiros pode detectar Kali. Paredes e móveis bloqueiam a linha de visão.

A suspeita amplia o alcance e a velocidade das rondas. A furtividade reduz a velocidade de Kali e a distância em que ele pode ser percebido. A barra de detecção precisa completar 100 para disparar a abordagem. Sem visão, a barra diminui.

**Regra atual:** as revistas são recorrentes. Não existe mais a proteção antiga de “uma advertência por missão”.

### 8.2. Respostas à revista

| Resposta | Requisito | Consequência permanente |
| --- | --- | --- |
| Entregar braçadeira | Braçadeira válida | Consome o item, reduz Adultos em 2 e bloqueia o disfarce no confronto. |
| Oferecer pão | Pão no inventário | Consome o pão; não poderá ser dado a Mira. |
| Entregar registro | Prova original em mãos | Destrói a prova e pode invalidar a rota coletiva se Mira tiver confiança menor que 2. |
| Denunciar Eron | A partir do ato III, antes do confronto, se ainda não denunciado | Eron é preso, sua confiança vira zero, a distração termina e a preparação coletiva se perde. Vigilância −2. |
| Resistir | Sempre apresentada, com aviso quando fatal | Até dois ferimentos: +1 ferimento e +2 vigilância. Se Kali já tem dois ferimentos, termina em captura. |

Uma revista resolvida soma uma advertência, até o indicador atingir três. Com **três advertências anteriores** ou **vigilância 8 ou mais**, a próxima detecção de patrulha causa captura direta.

Há **12 segundos de recuo sem nova detecção** após uma revista resolvida. Resistir acelera a patrulha por **20 segundos**. Esses tempos só avançam durante a exploração ativa.

A revista obrigatória da Travessia é uma exceção ao teste inicial de captura por advertências/vigilância: ela oferece suas respostas. Ainda é possível ser capturado ao resistir já com dois ferimentos, ou posteriormente pela patrulha.

### 8.3. Ferimentos

Cada ferimento reduz a velocidade de Kali em 15%, até 30% com dois ferimentos. Na versão atual não existe tratamento para removê-los.

A velocidade normal parte de 128 unidades do mundo por segundo e a furtiva de 64. O fator de ferimentos é aplicado às duas. A caminhada acompanha deslocamento real, inclusive quando essa velocidade é reduzida.

### 8.4. Prazo de Tomas

Ao entrar no confinamento, começa um orçamento de **10 ações** antes da transferência.

| Acontecimento | Custo ou efeito |
| --- | --- |
| Escolha de história que avança a preparação a partir do confinamento | Geralmente −1 ação. |
| Interação opcional executada nessa fase | −1 ação. |
| Revista resolvida com prazo ativo | −2 ações. |
| Destruir a ordem antes de Tomas ser transferido | +3 ações, com −1 pelo custo da própria escolha. |
| Caminhar, ler diálogos, consultar mapa ou diário | Sem custo. |
| Revisar tarefas na preparação | Sem custo. |
| Ler a inscrição do altar | Sem custo. |
| Recuar da fechadura para escolher outro método | Sem custo. |
| Confirmar o confronto | Encerra a preparação e o avanço desse prazo. |

O resgate é aplicado antes do desconto: é possível salvar Tomas na última ação. Se o prazo chegar a zero enquanto ele ainda está preso, ele é transferido, desaparece da cela e o resgate fica bloqueado. Destruir a ordem depois não desfaz a transferência.

### 8.5. Grade e ruído

- Chave: abre sem aumentar a vigilância; não provoca captura pelo teste de ruído, mesmo com vigilância alta.
- Arame: consome o item e soma 1 à vigilância.
- Ronda estudada: soma 2 à vigilância.
- Nos métodos ruidosos, se a vigilância resultante atingir 7 ou mais, ocorre captura.
- Distração de Eron: exige Eron livre e confiança 2; abre o acesso e retira as patrulhas da cozinha e do salão. A do corredor permanece.

O limite **7 da grade** e o limite **8 da detecção de patrulha** são regras diferentes.

## 9. Rotas e seis finais

### 9.1. Rota coletiva

Requisitos simultâneos:

1. Eron não denunciado.
2. Mira libertada.
3. Confiança de Eron ≥ 2.
4. Rota coletiva combinada (`escapePlan`).
5. Confiança de Mira ≥ 2 **ou** registro assinado preservado.

Se o plano estiver incompleto ao chamar o grupo, ocorre captura. Se estiver pronto, a rota segue por revista obrigatória, Travessia e portão. O apoio é verificado novamente no portão: entregar a prova durante a revista pode desmontar uma rota que dependia dela.

### 9.2. Rota de Noah

Exige Eron não denunciado, Eron com confiança ≥ 2, Mira livre e trinco aberto diante de Kali. A confiança numérica de Noah não substitui a verificação. Uma rota incompleta pode terminar em Traição; a rota preparada leva à Travessia e pode alcançar A Luz.

### 9.3. Rota do disfarce

Exige confiança dos adultos ≥ 3 e que a autorização não tenha sido confiscada (`coverBurned` falso). O teste atual não exige carregar a braçadeira: exige a confiança e a ausência da marca de confisco.

Ao passar, Kali pode fugir sozinho ou voltar pelos moradores. O retorno coletivo exige Eron não denunciado e uma destas condições:

- possuir a chave; ou
- ter distração organizada e Mira livre.

A volta com chave pode libertar Mira e Tomas; a transferência já consumada de Tomas continua irreversível. Sem acesso/apoio, o retorno termina em captura. A resolução por disfarce não passa pela revista obrigatória da cena Travessia.

### 9.4. Fuga individual

Se Kali conhece a passagem, pode seguir sozinho pela Travessia, enfrentar a revista e alcançar Sobrevivente. Sem conhecer o caminho, entra no ramal errado e chega a Isolamento. Libertar Mira também pode fornecer conhecimento da passagem; ele não vem exclusivamente da conversa com Eron.

### 9.5. Encerramentos

| Final | ID interno | Resultado principal |
| --- | --- | --- |
| **A Voz** | `voz` | Saída coletiva organizada, ou retorno bem-sucedido usando o disfarce. |
| **A Luz** | `luz` | Saída pela ajuda verificada de Noah; ele fica para segurar a porta e atrasar o vigia. Seu destino permanece desconhecido. |
| **Sobrevivente** | `sobrevivente` | Kali sai sozinho. O que fez antes determina o que deixou para trás e quais provas levou. |
| **Traição** | `traicao` | A confiança sem verificação entrega Kali aos adultos; pode ocorrer na armadilha de Noah ou numa rota final incompleta. |
| **Isolamento** | `isolamento` | Kali tenta fugir sem conhecer o percurso e encontra o ramal sem saída. |
| **Sob Vigilância** | `captura` | A captura interrompe o caminho por patrulha, ferimentos, ruído, falta de preparação ou retorno sem apoio. |

Os nomes dos seis finais são fixos, mas os relatos de consequências variam conforme as decisões. Resgatar Tomas não é requisito para desbloquear todos os finais; muda quem efetivamente pode sair e o epílogo.

## 10. Consequências visíveis

- Grade aberta e passagem para os arquivos desbloqueada.
- Mira libertada sai da cela e espera na cozinha.
- Tomas resgatado aparece junto à área de espera; transferido, desaparece da cela.
- Eron denunciado aparece preso e suas opções de ajuda ficam bloqueadas.
- Distração remove dois patrulheiros ativos; denunciá-lo cancela esse benefício.
- Trinco aberto fica registrado e visível.
- Braçadeira aparece em Kali enquanto válida e desaparece ao ser entregue.
- Câmera coberta, página arrancada e arame utilizado deixam sinais no mundo.
- Inventário perde os consumíveis usados ou entregues.
- HUD mostra advertências, ferimentos e prazo; diário guarda alterações e relações.
- Diálogos de Mira e dos arquivos reagem à transferência de Tomas.
- Encerramentos registram resgates, abandonos, prova preservada/perdida, denúncia e ferimentos.

## 11. Direção visual e interface

A solicitação começou com um Figma e imagens de referência. O arquivo indicado foi:

https://www.figma.com/design/r43JfKxKMadjgbsamZgs2C/Sem-t%C3%ADtulo?node-id=0-1

O acesso ao Figma não foi concluído pela conta conectada. Portanto, a implementação é uma adaptação baseada nas referências disponíveis e nas instruções, não uma reprodução certificada de cada medida do Figma.

A estética evoluiu de referências realistas para pixel art sombria. Os oito ambientes seguem madeira envelhecida, tábuas avermelhadas, paredes vinho/roxo, móveis gastos, pilhas de livros, sombras profundas, velas e janelas alaranjadas. A cozinha incorpora a referência da geladeira azul-acinzentada. O dormitório conserva os elementos pedidos: cama, armário, baú, escrivaninha, janela, tapete e papéis.

A tela inicial voltou à ilustração original de OldHood. Os botões recebem vermelho no hover, foco e pressão. Há Jogar, Capítulos, Opções, Conquistas, Créditos e Sair, além de Continuar quando existe salvamento.

Os diálogos têm nome do personagem, retrato, texto paginado, escolhas, requisitos e consequências. Os seis finais têm telas próprias com arte em Canvas, título, frase, história e marcas da partida. A coleção só permite rever finais já descobertos.

## 12. Sprites, idles e retratos

### 12.1. Fontes atuais

| Personagem | ZIP usado no importador |
| --- | --- |
| Mira | `14-year-old_girl_medium--Idle.zip` |
| Eron | `Teenager_boy_with_long_p-Idle.zip` |
| Kali | `blond_Long_hair_boy_dres-Idle-2.zip` |
| Noah | `14-year-old_boy_with_sho-Idle.zip` |

Cada exportação contém poses em `Idle/rotations/` e quadros de caminhada em `Idle/animations/Walking/`. Há oito rotações nos pacotes; o jogo atual utiliza quatro: sul/frente, oeste/esquerda, leste/direita e norte/costas.

São **96 quadros de caminhada** e **16 poses estáticas**, totalizando **112 imagens utilizadas**. Cada atlas reserva seis colunas para caminhar e uma para a pose parada, em quatro linhas direcionais.

### 12.2. Comportamento atual, após a correção

- Todos os personagens ficam estáticos quando parados na exploração.
- Os quatro principais usam a pose parada correspondente à direção.
- Adultos parados também deixaram de receber a oscilação visual de idle.
- Caminhada só usa quadros de movimento quando há deslocamento real.
- NPCs ainda podem fazer pequenos deslocamentos no espaço; nesses momentos caminham de fato.
- **Kali tem retrato frontal estático nos diálogos.**
- **Mira, Eron e Noah mantêm retratos animados nos diálogos**, conforme a solicitação anterior.
- Diálogos pausam jogador, patrulhas e prazo; a animação dos outros retratos tem um relógio separado.
- Menus sobrepostos e aba oculta pausam os retratos; reduzir animações os mantém parados.
- Limpar os comandos de movimento também zera o estado de caminhada do jogador.

As durações de referência são 200 ms por quadro. Na exploração, o índice de caminhada acompanha o progresso de deslocamento; nos retratos animados, acompanha o relógio da interface. As âncoras são calculadas por direção para alinhar os pés, incluindo quadros com tamanhos diferentes.

### 12.3. Histórico das artes

Antes dos ZIPs atuais foram utilizados GIFs de quatro quadros, uma folha de 35 quadros para Kali e, depois, GIFs de seis quadros. A antiga folha de Kali continha marcas d’água, que foram preservadas naquela etapa; ela foi substituída pelo conjunto atual. Os originais anteriores permanecem como histórico, mas não são o atlas ativo dos protagonistas.

A primeira implementação dos GIFs de seis quadros reutilizou a caminhada em idle. O usuário apontou que os personagens continuavam animando parados. Isso foi corrigido separando as poses de rotação estáticas das sequências de caminhada.

## 13. Salvamento, acessibilidade e áudio

O salvamento usa `localStorage`, incluindo história, inventário, eventos e posição. A normalização permite carregar estados anteriores. Uma revista pendente continua pendente ao recarregar. Ferimentos e perdas não são apagados ao continuar.

Chaves atuais:

| Chave | Conteúdo |
| --- | --- |
| `dont-believe.topdown.v2` | Partida 2D, estado narrativo e mundo. |
| `dont-believe.endings.v1` | Finais descobertos. |
| `dont-believe.topdown.preferences` | Preferências de visualização. |
| `dont-believe.outcomes.v3` | Último conjunto de consequências registrado para cada final. |

Uma nova partida substitui o progresso, mas preserva a coleção de finais. Continuar uma partida encerrada reabre a tela correspondente. O funcionamento do armazenamento local depende do navegador e das permissões para arquivos locais; limpar dados ou trocar de navegador pode separar/perder o progresso.

Há controles de toque, navegação por teclado, paginação e rolagem de diálogos, opções de campo de visão e redução de animações. Isso não representa uma auditoria formal de acessibilidade.

O som ambiente é opcional, começa desligado e é gerado pela Web Audio API. Não foram implementadas dublagem ou trilhas narrativas completas.

## 14. Histórico das alterações

A sequência abaixo registra as etapas efetivamente trabalhadas, sem atribuir números de versão antigos que não foram formalmente definidos.

| Etapa | Trabalho realizado |
| --- | --- |
| Base narrativa | Adaptação da história para escolhas, relações e seis finais. |
| Exploração 2D | Controle de Kali, mapa, colisões, interação por proximidade e objetivos. |
| Artes de referência | Uso das imagens fornecidas como direção para menu, quarto, altar e diálogos com retratos. |
| Pixel art | Unificação dos cômodos e abandono do tratamento realista na exploração. |
| Elenco visual | Adultos com capas, referências de Mira/Eron/Noah e Kali inspirado em Link. |
| Atmosfera | Paleta mais escura, sombras, iluminação quente e retorno ao menu original. |
| Menu e encerramentos | Hovers vermelhos e seis telas de final com coleção/replay. |
| Movimento | Sprites direcionais, patrulhas e pequenos deslocamentos dos NPCs. |
| Créditos | Aplicação dos nomes e funções solicitados. |
| História robusta | Investigação T-17, encadeamento das pistas, portas, resgates, preparação e requisitos reais. |
| Consequências | Alterações no mapa, inventário, confiança, diário e epílogos. |
| Fluxograma | Documentação dos caminhos do prólogo aos finais. |
| Perigo persistente | Revistas recorrentes, recursos sacrificados, denúncia de Eron, ferimentos e prazo de Tomas. |
| Fluxograma revisado | Ampliação para 11 etapas, incluindo revista e transferência. |
| Novos GIFs | Importação de seis quadros por direção para os quatro protagonistas. |
| Retratos animados | Reprodução de animação durante a leitura com gameplay pausado. |
| Correção final de idle | Importação dos quatro ZIPs, separação de poses estáticas, Kali estático no diálogo e todos estáticos quando parados no mundo. |
| Este documento | Consolidação do estado atual e do histórico, sem alterar o jogo. |

## 15. Arquitetura e arquivos

### 15.1. Ordem de carregamento

`story.js → world.js → adventure.js → danger.js → assets.js → character-data.js → character-sprites.js → pixel-art.js → render.js → endings.js → game.js`

Essa ordem importa: `adventure.js` revisa cenas e funções da base; `danger.js` acrescenta regras persistentes. Ler somente `story.js` ou `world.js` não revela toda a versão ativa.

### 15.2. Responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `dont-believe/index.html` | Estrutura dos menus, HUD, diálogos e controles. |
| `dont-believe/style.css` | Estética, responsividade, hover e foco. |
| `dont-believe/story.js` | Estado inicial, motor de escolhas e narrativa base. |
| `dont-believe/world.js` | Grade, salas, objetos, colisões, linha de visão e busca de caminho. |
| `dont-believe/adventure.js` | Revisão narrativa ativa, atos, objetivos, interações opcionais, relações e condições das rotas. |
| `dont-believe/danger.js` | Revistas, ferimentos, advertências, prazo, perdas permanentes e reações adicionais. |
| `dont-believe/assets.js` | Carregamento de imagens e fallbacks. |
| `dont-believe/character-data.js` | Atlas, recortes, âncoras, durações e poses. Gerado pelo importador. |
| `dont-believe/character-sprites.js` | Seleção e desenho de caminhada, pose parada e retrato. |
| `dont-believe/pixel-art.js` | Desenho dos ambientes e sprites nativos de apoio. |
| `dont-believe/render.js` | Câmera, iluminação, NPCs, minimapa e consequências visuais. |
| `dont-believe/endings.js` | Temas e artes das seis telas de final. |
| `dont-believe/game.js` | Integração, comandos, loop, diálogos, HUD, salvamento e áudio. |
| `dont-believe/historia-original.md` | Roteiro original preservado; não substitui o roteiro executado pelos módulos ativos. |
| `dont-believe/LEIA-ME.md` | Guia do projeto; contém um trecho legado de vigilância descrito na seção 18 deste documento. |
| `dont-believe/tools/import-characters.py` | Gera os atlas a partir dos quatro ZIPs. |
| `dont-believe/tools/build-art.cjs` | Ferramenta de construção de artes de apoio. |
| `package-topdown.py` | Ferramenta no ambiente de trabalho que gera HTML único e ZIP. |

### 15.3. Recursos

`assets/menus/menu-original.png` mantém o menu restaurado. `assets/cenarios/altar-pixel.png` guarda a arte de detalhe do altar. `assets/personagens/portraits.png` e `assets/sprites-e-idles/sprites.png` são apoios nativos. `assets/mira-uploaded.png`, `eron-uploaded.png`, `kali-uploaded.png` e `noah-uploaded.png` são os atlas ativos. Os originais ficam em `assets/characters/source/` e as referências em `assets/references/`.

### 15.4. Estado e regras

A história guarda `scene`, relações, `suspicion`, `flags`, `inventory`, `history`, `pending` e `events`. O módulo de perigo acrescenta `danger`, com advertências, ferimentos, ações restantes, abordagem pendente, proteção temporária e alerta de patrulha.

Flags relevantes incluem `cellOpen`, `rescued`, `tomasRescued`, `tomasTransferred`, `tunnel`, `proof`, `proofLost`, `transferDelayed`, `eronBetrayed`, `escapePlan`, `latchOpen`, `coverBurned`, `committed` e `checkpointPassed`.

O mundo guarda posição, direção e progresso da caminhada de Kali, estado dos atores e barra de detecção. O campo legado `observed` ainda pode existir no salvamento, mas não dá imunidade a novas revistas na mesma cena.

### 15.5. Construção

Para jogar, basta abrir `Dont-Believe-Jogar.html`, ou extrair o ZIP inteiro e abrir `dont-believe/index.html`.

Para reconstruir os sprites no projeto extraído:

```bash
python3 dont-believe/tools/import-characters.py
```

Esse preparo requer Python e Pillow. O jogo pronto não depende deles. O empacotador incorpora CSS, scripts e PNGs no HTML único e cria o ZIP com a pasta do projeto. Ferramentas auxiliares do ambiente de trabalho não devem ser presumidas como presentes no ZIP; o importador dentro de `dont-believe/tools/` está incluído.

## 16. Fluxograma e entregas

| Arquivo entregue | Conteúdo |
| --- | --- |
| `Dont-Believe-Jogar.html` | Jogo completo e offline em um único arquivo. |
| `Dont-Believe-Codigo.zip` | Código, recursos, originais e ferramentas internas. |
| `Dont-Believe-Sprites.gif` | Prévia mais recente alternando personagens parados e caminhando, com retrato estático de Kali. |
| `Dont-Believe-Fluxograma.pdf` | Fluxograma em 11 páginas/etapas. |
| `Dont-Believe-Fluxograma.html` | Mesmo conteúdo em etapas navegáveis e com zoom, sem rede. |
| `Dont-Believe-2D-Previa.png` | Prévia de uma etapa anterior da interface; pode mostrar artes anteriores. |
| `Dont-Believe-Finais-Previa.png` | Prévia anterior dos finais; não é uma captura atual de todos os sprites. |
| `Dont-Believe-Documentacao-Completa.md` | Este documento. |

O fluxograma foi atualizado na entrega das regras narrativas da versão 10. As versões 11 e 12 alteraram sprites e idles, sem mudar aquelas rotas.

As 11 etapas são: chegada e primeiras lealdades; seguir a evidência; preparar entrada e saída; teste de Noah; grade e resgate; altar e arquivos; preparação; fuga coletiva/Noah; disfarce/fuga individual/captura; revistas; prazo de Tomas.

O fluxograma é gerado a partir de cenas e de condições explicitadas nos scripts auxiliares `tmp/flowchart/build.cjs` e `tmp/flowchart/publish.py`. Não é inteiramente automático: se regras condicionais mudarem, os nós manuais também precisam ser revisados.

## 17. Testes e limites de verificação

Resultados observados durante o desenvolvimento:

- 2.000 partidas simuladas, 46.622 decisões, 43 cenas visitadas e todos os seis finais alcançados na revisão das regras de perigo.
- 153 interações de história exercitadas em DOM simulado nas rotas registradas.
- Verificações de teclado, toque, colisão, visão, mapa, diário, inventário, salvamento, altar, revistas, captura, créditos e telas finais.
- Testes específicos de denúncia de Eron, perda de prova, confisco da braçadeira, pão consumido, prazo, resgate na última ação, transferência irreversível, ferimentos e chave silenciosa.
- Testes de revista pendente que continua após recarregar e não pode ser ignorada para executar uma escolha.
- Comparação dos 112 quadros/poses atuais com os pixels e a transparência dos ZIPs.
- Verificação de caminhada nas quatro direções e de pose estática mesmo com o relógio avançando.
- Renderização nativa em Canvas confirmando imagens idênticas ao longo do tempo para todos os personagens parados e para o retrato de Kali.
- Teste de retratos dos outros personagens animando sem avançar posição, história ou prazo.
- Conferência de scripts incorporados no HTML, geração do ZIP e inspeção visual do PDF renderizado.

Scripts de verificação usados no ambiente de trabalho incluem `test-adventure.cjs`, `test-danger.cjs`, `test-topdown.cjs` e `test-six-sprites.cjs`. Não devem ser presumidos como incluídos no ZIP entregue, que empacota a pasta `dont-believe/`.

**Limite importante:** não foi concluída uma inspeção da interface HTML/CSS em navegador real nesse ambiente, pois o acesso de teste aos arquivos locais não foi permitido. DOM simulado e Canvas nativo não equivalem a teste completo no Safari, Chrome, Firefox ou num aparelho móvel. Os testes também não enumeram todas as combinações possíveis de escolhas.

## 18. Cuidados para continuar o projeto

### 18.1. O que preservar

- Créditos exatamente como solicitados.
- Menu original restaurado e hovers vermelhos.
- Pixel art sombria e identidade dos quatro personagens nas artes atuais.
- Kali estático nos diálogos.
- Poses realmente estáticas quando personagens param na exploração.
- História, perigo e prazos pausados durante a leitura.
- Consequências permanentes e requisitos claros, especialmente denúncia de Eron e transferência de Tomas.
- Compatibilidade de salvamento e coleção de finais.
- Fluxograma coerente com as condições realmente executadas.

### 18.2. Informações legadas que não devem voltar ao jogo por engano

Um parágrafo antigo de “Vigias e furtividade” no README ainda fala em uma advertência por missão e captura por detecção em vigilância 7. Esse trecho foi superado por `danger.js`. As regras corretas estão na seção 8 deste documento.

A aparência antiga de Noah com camiseta vermelha, o cabelo azul de Eron e o atlas antigo de Kali também foram substituídos. Não usar essas referências como estado visual atual.

### 18.3. Limites de escopo

Não há combate de ação, sistema de armas, cura de ferimentos, multiplayer, salvamento em nuvem, editor de níveis ou campanha com vários capítulos implementados. O projeto atual é um capítulo de investigação e escolhas, com exploração e furtividade.

A restrição de comunicação aparece no roteiro, nas relações e no perigo da circulação; não existe um detector separado que puna qualquer conversa iniciada. A leitura dos diálogos pausa os vigias.

Não há lançamento público de site confirmado nesta conversa. As entregas são arquivos locais/offline. Também não se deve afirmar que o Figma foi reproduzido fielmente ou que a interface foi aprovada em testes reais de navegador.

### 18.4. Próximas verificações úteis

Se o projeto continuar, os pontos ainda úteis são testar em navegador real e celular, revisar textos legados do README, avaliar a dificuldade com jogadores reais e conferir cada mudança de roteiro contra o fluxograma. São verificações possíveis, não funcionalidades já concluídas.

## 19. Catálogo das cenas e escolhas

O catálogo abaixo foi extraído dos módulos atuais. Os efeitos diretos aparecem em JSON para servir de referência de manutenção. As regras adicionais de `adventure.js` e `danger.js` — custos, revista final, transferência e captura por ruído — continuam valendo mesmo quando não aparecem no JSON de uma resposta.

Para a maioria das cenas, as opções são fixas. Quando o texto ou destino depende do estado, são apresentadas variantes de referência: sem preparação, com preparação e com Eron denunciado. Isso não é uma enumeração de todo estado possível; os requisitos completos das rotas estão nas seções 8 e 9.

### 19.1. A marca — `prologo`

**Objetivo:** Uma memória antes do primeiro sino.  
**Ponto no mapa:** `bed`.

**Texto de referência:**

> A chuva fazia os faróis atrás do carro parecerem uma única luz. Kali segurava o símbolo do Luzitruismo. Sua mãe fechou os dedos dele sobre o metal.
>
> — Se alguém perguntar no que você acredita, a resposta continua sendo sua. Mesmo se precisar guardá-la por um tempo.
>
> O pai olhou o retrovisor. Não respondeu. A batida veio de lado. O vidro, o cinto apertado, a terra entrando pela janela: Kali lembraria disso em pedaços.
>
> — O menino está vivo. Levem para OldHood.
>
> A voz não perguntou pelos pais. Kali tentou alcançar a mão da mãe. Alguém o puxou pelo casaco.
>
> O cordão arrebentou. Um homem recolheu o símbolo da lama, embrulhou-o num pano e anotou alguma coisa. Foi a primeira vez que Kali viu uma lembrança de sua família virar um item numa lista.

**Escolhas:**

1. **Abrir os olhos**  
   Destino: `quarto`.


### 19.2. O silêncio tem olhos — `quarto`

**Objetivo:** Fale com o vigia no dormitório.  
**Ponto no mapa:** `guardDorm`.

**Texto de referência:**

> Anos depois, o primeiro sino desperta Kali antes da luz. Aos quatorze anos, ele reconhece o vigia pelo arrastar de uma sola no corredor. Hoje, os passos param cedo demais.
>
> — Vocês também ouviram alguém sair durante a noite?
>
> Noah ergue os olhos para a câmera. Eron prende a respiração. Mira passa um dedo pelo pó da mesa, apagando uma marca que Kali não chegou a ler.
>
> Na chamada da véspera, Tomas respondera pelo dormitório ao lado. Depois do segundo sino, ninguém mais o ouviu.
>
> A fechadura gira. O vigia olha primeiro para Noah, depois para Kali.
>
> — Existe algum problema?
>
> Ninguém responde. O adulto deixa a porta aberta, como se esperasse receber um nome.

**Escolhas:**

1. **“Não. Só acordei.”**  
   Destino: `altar`.  
   Efeito direto: `{"adults":2}`.  
   Indicação: Você parece obediente aos olhos dos adultos.  
   Resposta: O vigia confere a cama e a janela. — Na segunda chamada, quero você no salão. / Quando ele sai, Noah faz um pequeno sinal positivo. Kali ainda não sabe para quem o gesto foi feito.

2. **“Por que tem uma câmera no quarto?”**  
   Destino: `altar`.  
   Efeito direto: `{"suspicion":2}`.  
   Indicação: O vigia anotou seu nome.  
   Resposta: — Para proteger vocês. / — Proteger de quê? / — De decisões ruins. / Noah espera a porta fechar. — Você não deveria ter perguntado isso.

3. **“Não é nada importante.”**  
   Destino: `altar`.  
   Efeito direto: `{"mira":1}`.  
   Indicação: Mira percebeu sua discrição.  
   Resposta: — Espero que continue assim. / Quando o adulto sai, Mira ergue os olhos por um instante. — Boa resposta.


### 19.3. O obelisco — `altar`

**Objetivo:** Vá ao salão e interaja com o altar.  
**Ponto no mapa:** `altar`.

**Texto de referência:**

> O sino conduz os moradores ao salão. Ninguém escolhe onde sentar. Um adulto guarda a porta, outro conta as bandejas; o terceiro observa quem demora a se ajoelhar.
>
> O obelisco de ametista repousa contra a parede, entre velas e flores secas. Na pedra escura, Kali vê o próprio rosto dividido por uma rachadura. Há riscos no piso diante da base, como se o altar já tivesse sido arrastado.
>
> — Na luz encontramos a ordem — recita o vigia.
>
> — A disciplina purifica — respondem os moradores.
>
> Noah acompanha cada palavra. Eron termina um instante depois dos outros.
>
> Kali conhece a diferença entre esse ritual e o que aprendeu com a mãe. Aqui, alguém confere a resposta antes de permitir que ele coma.

**Escolhas:**

1. **Ajoelhar-se completamente.**  
   Destino: `mira`.  
   Efeito direto: `{"adults":2,"noah":1,"mira":-1,"flags":{"knelt":true}}`.  
   Indicação: Sua obediência foi notada.  
   Resposta: Você imita Noah. / — Muito bem — diz o vigia. / Mira desvia o olhar.

2. **Apenas abaixar a cabeça.**  
   Destino: `mira`.  
   Efeito direto: `{"mira":1}`.  
   Indicação: Você mantém suas intenções escondidas.  
   Resposta: — Isso é tudo? / — Estou tentando aprender. / O adulto aceita. Mira acompanha a cena em silêncio.

3. **Recusar o ritual.**  
   Destino: `recusa`.  
   Resposta: — Não quero fazer isso. / O salão inteiro fica em silêncio. O adulto se aproxima. — Por quê?


### 19.4. Termine a frase — `recusa`

**Objetivo:** Responda ao vigia diante do altar.  
**Ponto no mapa:** `altar`.

**Texto de referência:**

> A colher de alguém bate na tigela. O vigia não olha para o barulho; mantém a mão sobre o encosto da cadeira de Kali.
>
> — A comida pode esperar. Sua resposta, não.
>
> Noah murmura: — Diga que não entendeu.
>
> Mira afasta a própria bandeja, abrindo espaço para Kali passar caso o adulto permita. Ele precisa escolher quanto de si vai deixar sobre aquela mesa.

**Escolhas:**

1. **“Ainda não entendo a Actras.”**  
   Destino: `mira`.  
   Efeito direto: `{"suspicion":1}`.  
   Indicação: A Actras está atenta.  
   Resposta: — Então aprenderá. / O adulto deixa você passar, mas acompanha cada passo.

2. **“Minha família acreditava em outra coisa.”**  
   Destino: `mira`.  
   Efeito direto: `{"suspicion":3,"flags":{"family":true}}`.  
   Indicação: Sua família entrou na investigação.  
   Resposta: — Que coisa? / Você não responde. Ele o segura pelo ombro antes de soltá-lo.


### 19.5. Palavras pequenas — `mira`

**Objetivo:** Converse discretamente com Mira no salão.  
**Ponto no mapa:** `mira`.

**Texto de referência:**

> Mira empurra discretamente um pedaço de pão para a borda da bandeja dele. — Esfria se você esperar demais. É a primeira frase que alguém lhe dirige sem fazer uma pergunta.
>
> Um vigia percorre a mesa. Mira só continua quando ele se abaixa para corrigir a postura de outro morador.
>
> — O cobertor do dormitório ao lado ficou sobrando.
>
> Tomas. Kali entende por que ela não disse o nome. Uma resposta direta pode transformar os dois numa conversa que o vigia queira terminar.

**Escolhas:**

1. **“Não vou entregar o que você disser.”**  
   Destino: `noah`.  
   Efeito direto: `{"mira":2}`.  
   Indicação: Mira confia mais em você. A ausência de Tomas virou uma pista.  
   Resposta: Mira espera o vigia passar. — Então observe antes de perguntar. Tomas tinha um cobertor azul. O beliche dele está vazio, mas a chamada ainda tem o nome. Eron viu quem levou as coisas. Procure-o depois de falar com Noah; ele controla a lista do dormitório.

2. **“Talvez eu concorde com eles.”**  
   Destino: `noah`.  
   Efeito direto: `{"adults":1,"mira":-2}`.  
   Indicação: Mira se fecha.  
   Resposta: Mira recolhe a caneca. — Então pergunte ao Noah por que a lista dele ainda tem o nome de Tomas. Eu não vou dar mais nomes a ninguém.

3. **“E você? O que acha?”**  
   Destino: `noah`.  
   Efeito direto: `{"mira":-1,"suspicion":1}`.  
   Indicação: A pergunta era direta demais.  
   Resposta: Mira olha para a câmera. — Quer uma resposta aqui? Procure a cama vazia. Depois fale com Eron. Não grite o nome dele também.


### 19.6. Um amigo atento — `noah`

**Objetivo:** Encontre Noah no corredor central.  
**Ponto no mapa:** `noahHall`.

**Texto de referência:**

> Noah espera sob a placa das regras. A porta da sala dos adultos fecha atrás dele. Quando vê Kali olhando, ajeita a manga da camiseta.
>
> — Perguntaram se você estava se adaptando. Eu disse que sim.
>
> — Eles pediram para você me observar?
>
> — Pediram para eu ajudar.
>
> Noah baixa a voz. — Não deixe que precisem descobrir as coisas sozinhos. Comigo, você pode falar.
>
> A oferta soa como amizade. A frase parece ter vindo da sala atrás dele.
>
> — Onde está Tomas? — pergunta Kali.
>
> — Transferido. É o que está na lista.
>
> — Para onde?
>
> Noah alisa o papel. — Não cuido dessa parte.
>
> No dormitório, Eron faz um sinal para Kali esperar. Ele ouviu a resposta.

**Escolhas:**

1. **“Então vou ouvir você.”**  
   Destino: `segredo`.  
   Efeito direto: `{"noah":2}`.  
   Indicação: Noah quer conhecer seus planos.  
   Resposta: — Boa escolha. Você pode me contar qualquer coisa.

2. **“Você parece saber bastante.”**  
   Destino: `desaparecimento`.  
   Efeito direto: `{"noah":-1,"flags":{"earlyDoubt":true}}`.  
   Indicação: Noah passa a medir as palavras.  
   Resposta: — Alguém tem que prestar atenção — responde Noah. / — Deve ser cansativo. / A frase parece inofensiva, mas Noah demora a recuperar o sorriso. / Eron espera junto ao armário do dormitório. Ele viu a retirada das coisas de Tomas.

3. **“Todo mundo parece saber alguma coisa.”**  
   Destino: `desaparecimento`.  
   Indicação: Você mantém Noah próximo, sem se expor.  
   Resposta: — Você aprende rápido. / Você deixa a frase sem explicação. / Eron espera junto ao armário do dormitório. Ele viu a retirada das coisas de Tomas.


### 19.7. O que ele precisa saber? — `segredo`

**Objetivo:** Decida o que revelar a Noah.  
**Ponto no mapa:** `noahHall`.

**Texto de referência:**

> — O que ficou preso na sua garganta diante do altar? — pergunta Noah.
>
> Kali passa o polegar pela marca onde o cordão costumava tocar a pele. Noah percebe o gesto.
>
> — Não precisa contar tudo — diz Noah. — Só o suficiente para eu entender.
>
> Na escada, o adulto que guarda a passagem consulta uma folha. Noah espera a resposta sem olhar para trás.

**Escolhas:**

1. **Contar sobre sua família e sua crença.**  
   Destino: `desaparecimento`.  
   Efeito direto: `{"noah":1,"suspicion":1,"flags":{"disclosed":true}}`.  
   Indicação: Você entregou a Noah uma parte importante da sua história.  
   Resposta: — Minha família seguia o Luzitruismo. Eu não esqueci. / Noah olha para a escada. — Seu segredo está seguro. / Eron espera junto ao armário do dormitório. Ele viu a retirada das coisas de Tomas.

2. **“Só queria terminar a refeição.”**  
   Destino: `desaparecimento`.  
   Indicação: Algumas coisas continuam sendo apenas suas.  
   Resposta: — Claro — responde Noah. / Você não acrescenta nada. / Eron espera junto ao armário do dormitório. Ele viu a retirada das coisas de Tomas.


### 19.8. O que tiraram do quarto — `desaparecimento`

**Objetivo:** Fale com Eron: ele viu a retirada das coisas de Tomas.  
**Ponto no mapa:** `eronDorm`.

**Texto de referência:**

> — Não levaram só Tomas — Eron diz. — Levaram a coberta, a caneca e a caixa dele. Querem que a cama pareça vazia há semanas.
>
> — Você viu para onde?
>
> — A caixa foi para a cozinha. Mas não vou seguir você até lá sem saber se consigo confiar. Primeiro procure debaixo do colchão dele. Depois compare com o registro na sala de leitura.
>
> Um vigia entra para conferir as camas. Eron ainda segura a colher com que levantou a tábua do beliche.

**Escolhas:**

1. **Dizer que a colher é sua.**  
   Destino: `vestigios`.  
   Efeito direto: `{"eron":2,"flags":{"protectedEron":true}}`.  
   Indicação: Eron +2 · você protegeu a investigação.  
   Resposta: — Caiu da minha bandeja. / O vigia manda Kali guardá-la. Eron encosta dois dedos na madeira: um agradecimento sem som.

2. **Pedir que Eron guarde a colher, em voz baixa.**  
   Destino: `vestigios`.  
   Indicação: Você recebe a pista, mas ainda não conquistou um aliado.  
   Resposta: Eron esconde a colher. — A terceira costura do colchão. Não encoste na primeira. É a que eles verificam.

3. **Perguntar ao vigia por que apagaram Tomas.**  
   Destino: `vestigios`.  
   Efeito direto: `{"suspicion":2,"eron":-1}`.  
   Indicação: Vigilância +2 · Eron se afasta.  
   Resposta: — Ele foi transferido. Arrume a cama. / Eron espera o adulto sair. — Agora ele sabe que estamos procurando.


### 19.9. A costura azul — `vestigios`

**Objetivo:** Examine a costura do colchão de Tomas no dormitório.  
**Ponto no mapa:** `tomasBed`.

**Texto de referência:**

> A terceira costura esconde um pedaço de papel: “T-17 / revisão antes da saída”. Um fio azul ficou preso no grampo. Tomas costumava remendar a própria coberta com essa linha.
>
> O papel tem a mesma borda serrilhada do livro de chamadas. A sala de leitura guarda as cópias antigas. O número T-17 permite procurar uma linha específica, sem revirar todas as páginas.

**Escolhas:**

1. **Guardar o papel e recolocar o colchão.**  
   Destino: `registro`.  
   Efeito direto: `{"flags":{"bedClue":true},"items":["Etiqueta T-17"]}`.  
   Indicação: Pista: T-17 → livro de chamadas.  
   Resposta: A etiqueta fica escondida no punho de Kali. O colchão parece intocado. Agora você sabe o que procurar no registro.


### 19.10. Uma transferência sem destino — `registro`

**Objetivo:** Procure T-17 no livro da sala de leitura.  
**Ponto no mapa:** `ledger`.

**Texto de referência:**

> No livro, T-17 corresponde a Tomas. A coluna “destino” está vazia. Alguém escreveu “material entregue à cozinha” por cima de “morador em revisão”. Não é um registro de viagem.
>
> Na margem, a bibliotecária copiou uma instrução antiga: “O sino chama. A chama revela. A raiz guarda”. Ao lado, três pequenos desenhos reproduzem os discos da base do altar.
>
> Você ainda não sabe onde Tomas está. A caixa da cozinha pode ligar a anotação à pessoa que autorizou a retirada.

**Escolhas:**

1. **Copiar a linha e deixar o livro no lugar.**  
   Destino: `cruzamento`.  
   Efeito direto: `{"flags":{"registerClue":true,"altarClue":true},"items":["Cópia do registro T-17"]}`.  
   Indicação: Pista: livro → caixa da cozinha. Código do altar anotado no diário.  
   Resposta: Kali copia a ausência de destino e a ordem dos três símbolos. São observações verificáveis. Não uma prova de que Tomas saiu de OldHood.

2. **Arrancar a página para levar o original.**  
   Destino: `cruzamento`.  
   Efeito direto: `{"suspicion":1,"flags":{"registerClue":true,"altarClue":true,"missingPage":true},"items":["Página original T-17"]}`.  
   Indicação: Vigilância +1 · a página ausente fica visível.  
   Resposta: A página se solta com um ruído seco. O buraco será visto na próxima conferência. Você guarda um original, mas deixa um sinal da investigação.


### 19.11. O que a caixa prova — `cruzamento`

**Objetivo:** Examine a caixa numerada atrás da cozinha.  
**Ponto no mapa:** `box`.

**Texto de referência:**

> A caixa atrás da cozinha tem o número T-17. Dentro estão a caneca lascada e a coberta azul. Nenhuma bagagem foi preparada para a estrada.
>
> Uma requisição presa na tampa pede “manter na ala leste até a segunda chamada”. A assinatura é da sala de observação. Tomas está sendo retido dentro do orfanato.
>
> Mira conhece a distribuição de comida para a ala leste. Eron conhece a ronda da cozinha. Você pode usar relações diferentes para chegar à mesma porta.

**Escolhas:**

1. **Recolher a requisição e levar a descoberta a Mira.**  
   Destino: `plano`.  
   Efeito direto: `{"flags":{"kitchenClue":true},"items":["Requisição da ala leste"]}`.  
   Indicação: Pista confirmada: Tomas continua em OldHood. Mira está no salão.  
   Resposta: Kali deixa a caixa fechada. Antes de sair, nota uma caixa de reparos sobre a bancada: um arame pode ser útil numa fechadura.


### 19.12. Ninguém vai desaparecer sem nome — `plano`

**Objetivo:** Mostre a requisição a Mira no salão e escolha um plano.  
**Ponto no mapa:** `mira`.

**Texto de referência:**

> — A ala leste recebe duas bandejas a mais — diz Mira, lendo a requisição. — Eles dizem que são para os vigias. Tomas pode estar atrás da segunda porta.
>
> — Vamos abrir?
>
> — E tirar alguém para correr para onde? Primeiro uma entrada. Depois uma saída. Uma promessa sem caminho só prende outra pessoa.
>
> Você tem três formas de preparar o acesso. A obediência pode render uma chave; Eron pode preparar uma distração; observar a ronda permite agir sozinho. A bancada da cozinha tem uma ferramenta opcional.

**Escolhas:**

1. **Combinar um caminho com Eron.**  
   Destino: `bilhete`.  
   Efeito direto: `{"flags":{"planEron":true}}`.  
   Indicação: Rota de aliados · fortaleça Eron e conheça a passagem.  
   Resposta: — Ele deixa recados na sua cama — diz Mira. — Quando falar de passos, escute os intervalos. Ele só oferece o que consegue cumprir.

2. **Usar o serviço de bandejas para ganhar acesso.**  
   Destino: `explorar`.  
   Efeito direto: `{"adults":1,"flags":{"planCover":true}}`.  
   Indicação: Rota de disfarce · confiança dos adultos +1.  
   Resposta: Mira entrega uma bandeja vazia. — Não diga que soube por mim. Eles gostam de uma explicação pequena. “Vim ajudar” basta.

3. **Estudar a ronda sem envolver outra pessoa.**  
   Destino: `ronda`.  
   Indicação: Rota independente · observe a cozinha antes do interrogatório.  
   Resposta: — Então marque a volta completa, não apenas a ida — Mira avisa. — Você pode levar o arame da bancada. E ainda pode pedir ajuda depois.


### 19.13. O encontro tem um motivo — `bilhete`

**Objetivo:** Leia o bilhete de Eron na sua cama.  
**Ponto no mapa:** `bed`.

**Texto de referência:**

> O bilhete de Eron não pede confiança cega: “A cozinha esconde a escada de serviço. Se quiser tirar Tomas, precisa saber onde ela termina. Venha à bancada depois da ronda.”

**Escolhas:**

1. **Ir ao encontro.**  
   Destino: `eron`.  
   Indicação: Objetivo: aprender uma saída antes de abrir as celas.  
   Resposta: Você memoriza o recado e o esconde na costura. Eron espera no fundo da cozinha.

2. **Investigar a ronda sozinho.**  
   Destino: `ronda`.  
   Indicação: Você abre mão desta conversa, não da investigação.  
   Resposta: Kali deixa o bilhete onde estava. Ainda é possível observar o vigia da entrada da cozinha.


### 19.14. Um plano que cabe em três batidas — `eron`

**Objetivo:** Combine a saída com Eron no fundo da cozinha.  
**Ponto no mapa:** `eronKitchen`.

**Texto de referência:**

> — A escada da cozinha desce aos arquivos. O ramal esquerdo chega ao portão. O direito termina no depósito de carvão. Tem uma porta falsa lá — explica Eron.
>
> — E a ala leste?
>
> — Quando eu derrubar as panelas, o vigia vem até aqui. Você abre a cela. Mas só farei isso depois de combinarmos. Não me deixe esperando um sinal que não vem.
>
> Eron risca o percurso na gordura da bancada e deixa Kali repetir as curvas. Conhecer o trajeto não abre a porta: isso ainda exige uma chave, uma ferramenta ou a distração.

**Escolhas:**

1. **Repetir o trajeto e combinar três batidas.**  
   Destino: `ferramentas`.  
   Efeito direto: `{"eron":1,"flags":{"passage":true,"signalKnown":true},"items":["Trajeto de Eron"]}`.  
   Indicação: Trajeto aprendido · Eron +1 · distração disponível com confiança 2.  
   Resposta: — Esquerda para fora. Três batidas para a distração. / Eron apaga o desenho. — Agora o plano existe na cabeça de duas pessoas.

2. **Aprender o caminho, sem pedir que ele se arrisque.**  
   Destino: `ferramentas`.  
   Efeito direto: `{"flags":{"passage":true},"items":["Trajeto de Eron"]}`.  
   Indicação: Trajeto aprendido · Eron não estará comprometido com uma distração.  
   Resposta: — Certo. Não vou derrubar nada sem você pedir. / Eron aponta a caixa de reparos. — Pegue uma ferramenta. Porta fechada não escuta intenção.


### 19.15. A ferramenta e o barulho — `ferramentas`

**Objetivo:** Examine a caixa de reparos na bancada da cozinha.  
**Ponto no mapa:** `tools`.

**Texto de referência:**

> A caixa de reparos tem um arame rígido e um pano. O arame abre a lingueta das celas; o pano abafa o metal. Uma marca de poeira denuncia se a caixa for deixada aberta.

**Escolhas:**

1. **Levar o arame e fechar a caixa.**  
   Destino: `ronda`.  
   Efeito direto: `{"flags":{"toolTaken":true},"items":["Arame"]}`.  
   Indicação: Objeto utilizável: Arame.  
   Resposta: O arame vai para o bolso. Só será consumido se você o usar na fechadura.

2. **Deixar a ferramenta.**  
   Destino: `ronda`.  
   Indicação: A ferramenta continua disponível na bancada.  
   Resposta: Você prefere uma chave ou a ajuda de Eron. Pode voltar à caixa antes do confronto.


### 19.16. A bandeja como disfarce — `explorar`

**Objetivo:** Peça trabalho ao vigia na entrada da cozinha.  
**Ponto no mapa:** `service`.

**Texto de referência:**

> — Sobrou trabalho? — Kali pergunta com a bandeja nas mãos.
>
> — Sempre sobra. Leve uma conta limpa à observação depois que a ronda passar.
>
> O vigia oferece uma braçadeira de serviço. Vestir o símbolo da Actras dá acesso aos adultos, mas Mira verá de que lado você parece estar. Você poderá explicar a ela o plano.

**Escolhas:**

1. **Vestir a braçadeira para conseguir uma chave depois.**  
   Destino: `ronda`.  
   Efeito direto: `{"adults":2,"mira":-1,"flags":{"cover":true},"items":["Braçadeira de serviço"]}`.  
   Indicação: Adultos +2 · Mira −1 · disfarce visível no personagem.  
   Resposta: O vigia passa a chamar Kali pelo nome. Do salão, Mira vê a braçadeira e desvia o olhar.

2. **Entregar a bandeja e recusar a braçadeira.**  
   Destino: `ronda`.  
   Efeito direto: `{"adults":1}`.  
   Indicação: Adultos +1 · sem identificação de serviço.  
   Resposta: — Prefiro só carregar. / O vigia aceita a ajuda, mas guarda a braçadeira.


### 19.17. A volta que ninguém conta — `ronda`

**Objetivo:** Observe o ciclo da ronda na entrada da cozinha.  
**Ponto no mapa:** `watch`.

**Texto de referência:**

> Perto da entrada da cozinha, Kali observa uma volta completa. O vigia cruza o corredor, confere as panelas e retorna para fechar a grade da ala leste. A abertura acontece na volta, depois do sino.
>
> Isso ensina quando passar, mas não elimina o perigo. Durante a exploração, o campo de visão dos vigias é real. Caminhar com Shift reduz o alcance em que percebem você.
>
> Quando a volta termina, o vigia anuncia: — Kali, na sala de observação. Agora. A investigação continua, mas a chamada não pode ser ignorada.

**Escolhas:**

1. **Anotar: esperar o sino, passar na volta.**  
   Destino: `interrogatorio`.  
   Efeito direto: `{"flags":{"timing":true},"items":["Horário da ronda"]}`.  
   Indicação: Ronda estudada · alternativa de acesso disponível.  
   Resposta: Você registra o intervalo no diário. A sala de observação fica ao sul da cozinha; a entrada dos arquivos permanece trancada.


### 19.18. O que eles já sabem — `interrogatorio`

**Objetivo:** Atenda à chamada na sala de observação e observe a mesa.  
**Ponto no mapa:** `examiner`.

**Texto de referência:**

> O vigia põe o registro de chamadas sobre a mesa. “Você anda perguntando por um morador transferido.”
>
> — A coluna de destino está vazia — Kali responde.
>
> O adulto fecha o livro. — Não é você quem preenche essa coluna. Aqui, as perguntas têm consequências para quem responde.
>
> Kali vê duas chaves na mesa. Uma tem uma fita branca: a mesma cor da marca na grade da ala leste. O interrogatório também revelou onde conseguir acesso.

**Escolhas:**

1. **“Eu só queria entender a distribuição das bandejas.”**  
   Destino: `sumico`.  
   Efeito direto: `{"adults":1,"suspicion":-1,"flags":{"keySeen":true}}`.  
   Indicação: Adultos +1 · vigilância −1 · localização da chave anotada.  
   Resposta: O vigia devolve a bandeja. — Seja útil e não terá problemas. / Ao voltar, Kali encontra a cama de Mira vazia.

2. **“Não vou dar o nome de quem falou comigo.”**  
   Destino: `sumico`.  
   Efeito direto: `{"mira":1,"eron":1,"suspicion":1,"flags":{"keySeen":true}}`.  
   Indicação: Mira e Eron +1 · vigilância +1.  
   Resposta: O adulto espera. Kali não acrescenta um nome. — Pode ir. Por enquanto. / No dormitório, a cama de Mira foi esvaziada.

3. **“Minha crença não é um crime. E Tomas não saiu daqui.”**  
   Destino: `sumico`.  
   Efeito direto: `{"suspicion":2,"mira":1,"flags":{"faith":true,"keySeen":true}}`.  
   Indicação: Vigilância +2 · Mira +1 · a patrulha passa a observar mais longe.  
   Resposta: — Repita isso diante de todos e veremos. / Kali sai com a certeza de que a Actras está escondendo Tomas. A cama de Mira agora também está vazia.

4. **Entregar o nome de Eron para encerrar a investigação contra você.**  
   Destino: `sumico`.  
   Efeito direto: `{"adults":2,"suspicion":-2,"mira":-2,"flags":{"eronBetrayed":true,"keySeen":true}}`.  
   Indicação: IRREVERSÍVEL: Eron preso; sem sua ajuda, distração ou fuga coletiva.  
   Resposta: — Foi Eron. Ele levantou a tábua. / O vigia anota o nome. Eron é levado para a ala leste; quando passa por Kali, não pede uma explicação. A promessa que você fez já foi respondida.


### 19.19. A segunda cama vazia — `sumico`

**Objetivo:** Procure o recado deixado na cama de Mira.  
**Ponto no mapa:** `miraBed`.

**Texto de referência:**

> A cama de Mira ainda está quente. Debaixo da caneca, ela deixou um recado: “Me levaram para a primeira cela. Tomas está atrás da divisória. Não aceite a porta aberta que Noah oferecer.”
>
> No verso: “Ele descreveu meu encontro com você antes de o vigia me chamar. Se ele quiser ajudar, peça que abra o trinco do portão. Uma ação. Não outra promessa.”
>
> O recado não é uma sentença contra Noah. É uma forma de verificar o que ele fizer daqui em diante. Mira deu uma localização e um teste concreto.

**Escolhas:**

1. **Guardar o recado e procurar Noah.**  
   Destino: `oferta`.  
   Efeito direto: `{"flags":{"warning":true,"miraTaken":true},"items":["Aviso de Mira"]}`.  
   Indicação: Mira está na ala restrita · o diário agora inclui seu resgate.  
   Resposta: Noah espera ao lado do armário. A cela de Mira é agora um destino conhecido; antes de ir, você precisa decidir o que fazer com a oferta dele.


### 19.20. A ajuda que dispensa perguntas — `oferta`

**Objetivo:** Ouça a oferta de Noah e confronte o aviso de Mira.  
**Ponto no mapa:** `noahDorm`.

**Texto de referência:**

> — Sei onde está seu símbolo — Noah diz. — A sala de observação vai ficar aberta. Dá tempo de pegar antes de olharem.
>
> — E Mira?
>
> — Não posso resolver tudo. Seu símbolo é o que importa para você, não é?
>
> O aviso de Mira pesa no bolso. A história de Noah aponta para uma sala onde você acabou de ver um vigia. Seu objeto foi catalogado; os arquivos ficam em outro lugar.

**Escolhas:**

1. **Exigir uma explicação sobre o recado de Mira.**  
   Destino: `questionar`.  
   Indicação: Confrontar abre a chance de exigir uma reparação.  
   Resposta: — Como você sabia do encontro antes da chamada? / Pela primeira vez, Noah não responde depressa.

2. **Verificar a porta antes de entrar.**  
   Destino: `limiar`.  
   Indicação: Cautela · você terá uma última chance de recuar.  
   Resposta: — Vá na frente. Eu olho o corredor. / Noah concorda, mas não se afasta o suficiente para perder Kali de vista.

3. **Seguir Noah sem verificar.**  
   Destino: `emboscada`.  
   Efeito direto: `{"noah":1}`.  
   Indicação: PERIGO: você ignora uma contradição e o aviso de Mira.  
   Resposta: Noah caminha depressa. Na sala, uma cadeira já foi colocada diante da câmera.

4. **Recusar e procurar um acesso à ala leste.**  
   Destino: `confinamento`.  
   Indicação: Você encerra a oferta; a verdade sobre Noah continuará incompleta.  
   Resposta: — Não vou trocar uma pessoa por um objeto. / Kali deixa Noah no dormitório. O sino do confinamento começa a tocar.


### 19.21. Dois pares de passos — `limiar`

**Objetivo:** Escute do lado de fora da sala de observação.  
**Ponto no mapa:** `officeDoor`.

**Texto de referência:**

> A luz sai por baixo da porta. Kali ouve o arrastar do vigia e uma segunda voz: “Ele vem sozinho?” Noah faz sinal para entrar. Não há objeto sobre a mesa.

**Escolhas:**

1. **Recuar e enfrentar Noah no dormitório.**  
   Destino: `questionar`.  
   Efeito direto: `{"flags":{"trapSeen":true}}`.  
   Indicação: A armadilha foi verificada.  
   Resposta: — Você disse que estaria vazia. / Noah acompanha Kali de volta. Já não consegue repetir a primeira versão.

2. **Entrar mesmo assim.**  
   Destino: `emboscada`.  
   Indicação: IRREVERSÍVEL: dois adultos esperam dentro da sala.  
   Resposta: A porta fecha atrás de Kali antes que ele termine a primeira pergunta.


### 19.22. Uma cadeira preparada — `emboscada`

**Objetivo:** Entre na sala onde Noah o levou.  
**Ponto no mapa:** `examiner`.

**Texto de referência:**

> — Disseram que você só precisava falar — Noah murmura.
>
> — Você viu a cadeira. Você sabia.
>
> Noah aperta a manga entre os dedos. Não responde.
>
> O vigia toma o recado antes de Kali alcançar o bolso. A câmera já estava gravando. A escolha de entrar entregou à Actras a investigação e quem a conduzia.

**Escolhas:**

1. **Encarar Noah enquanto a porta é trancada.**  
   Destino: `traicao`.  
   Efeito direto: `{"flags":{"betrayed":true}}`.  
   Indicação: Este caminho termina aqui.  
   Resposta: Noah baixa os olhos. Nenhuma das respostas que decorou serve para o que acabou de fazer.


### 19.23. As palavras que ele entregou — `questionar`

**Objetivo:** Peça a Noah que explique por que Mira foi levada.  
**Ponto no mapa:** `noahDorm`.

**Texto de referência:**

> Kali mostra o aviso. — Mira não sumiu por desobedecer a uma regra. Sumiu depois que você contou o que ouviu.
>
> — Eles já tinham suspeitas. Disseram que, se eu ajudasse, parariam de perguntar sobre mim.
>
> — E passaram a perguntar sobre ela.
>
> Noah olha para a porta. — Eu sei.
>
> Ele não pede perdão. Pergunta o que Kali pretende fazer. Pela primeira vez, a conversa pode exigir um gesto verificável.

**Escolhas:**

1. **“Conte como as portas funcionam. Depois decida quem vai ajudar.”**  
   Destino: `verdade`.  
   Efeito direto: `{"flags":{"confronted":true}}`.  
   Indicação: A ajuda de Noah precisará de uma ação real.  
   Resposta: Noah explica que o portão tem um trinco interno. Alguém pode soltá-lo sem uma chave, mas ficará exposto ao vigia do corredor.

2. **“Não vou entregar outra pessoa para proteger você.”**  
   Destino: `confinamento`.  
   Efeito direto: `{"flags":{"confronted":true,"rejected":true}}`.  
   Indicação: Noah foi confrontado; você recusou formar um acordo.  
   Resposta: — Não estou pedindo um nome — Noah responde. / — Foi assim que começou com Mira. / Kali sai para procurar a grade da ala leste.


### 19.24. Uma reparação não é um perdão — `verdade`

**Objetivo:** Decida se Noah terá a chance de reparar uma parte do que fez.  
**Ponto no mapa:** `noahDorm`.

**Texto de referência:**

> — Se eu abrir, vão saber que fui eu — Noah diz.
>
> — Se não abrir, vamos saber também.
>
> Kali guarda o recado. — Não quero que prometa ser outra pessoa. Quero que solte o trinco do portão.
>
> Noah passa o polegar pela marca da chave na palma. — Vou esperar no fim do corredor. Fale comigo lá, antes de levar os outros.
>
> A palavra dele ainda não é uma saída.

**Escolhas:**

1. **Dar a Noah a tarefa de abrir o trinco.**  
   Destino: `confinamento`.  
   Efeito direto: `{"noah":1,"flags":{"mercy":true,"noahDoubt":true,"noahTask":true}}`.  
   Indicação: Nova tarefa: verificar Noah no portão. Perdão não foi concedido.  
   Resposta: — Eu vou conferir — Kali avisa. / — Eu sei. / Noah deixa o dormitório. O mapa agora marca o trinco como preparação opcional.

2. **Recusar depender dele.**  
   Destino: `confinamento`.  
   Efeito direto: `{"flags":{"rejected":true}}`.  
   Indicação: Outras rotas continuam abertas.  
   Resposta: Kali decide que a saída precisa depender de uma chave ou dos aliados que já ajudaram. Noah permanece no dormitório.


### 19.25. Primeiro, abrir a grade — `confinamento`

**Objetivo:** Escolha como acessar a ala restrita durante o confinamento.  
**Ponto no mapa:** `guardHall`.

**Texto de referência:**

> O sino muda de ritmo. — Todos nos quartos. Só o serviço de bandejas passa — ordena o vigia. A grade da ala leste se fecha diante de Kali.
>
> Você sabe que Mira está na primeira cela e Tomas atrás da divisória. Pode pedir a chave, distrair o vigia com Eron, usar um arame ou aproveitar a próxima abertura da ronda.
>
> Os requisitos e o risco de cada método estão abaixo. Antes de escolher, ainda é possível pegar a ferramenta da cozinha, falar com aliados ou abrir o diário.

**Escolhas:**

1. **Pedir a chave usando a confiança dos adultos.**  
   Destino: `chave`.  
   Efeito direto: `{"flags":{"authorized":true}}`.  
   Requisito ausente neste exemplo: Precisa de confiança 3 com os adultos. Serviço de bandejas ajuda.  
   Indicação: Acesso discreto · vá buscar a chave na sala de observação.  
   Resposta: — A de fita branca está na mesa. Devolva quando terminar — diz o vigia. A obediência comprou acesso, não liberdade.

2. **Pedir que Eron provoque a distração combinada.**  
   Destino: `distracao`.  
   Requisito ausente neste exemplo: Precisa de Eron livre e confiança 2. Converse com ele ou entregue um plano.  
   Indicação: Uma distração afasta parte da patrulha.  
   Resposta: Kali procura a cozinha. Eron só fará o barulho quando ouvir o sinal; ninguém precisa arriscar uma corrida antes da hora.

3. **Ir até a fechadura e usar ferramenta ou intervalo.**  
   Destino: `fechadura`.  
   Indicação: Arame: +1 vigilância. Intervalo estudado: +2. O risco é mostrado antes de agir.  
   Resposta: Kali vai até a grade, ao norte do corredor. O sino marca o retorno da ronda.

4. **Deixar o resgate para trás e procurar os arquivos.**  
   Destino: `subsolo`.  
   Efeito direto: `{"flags":{"rescueSkipped":true}}`.  
   Indicação: Mira permanece presa; ainda é possível voltar antes do confronto.  
   Resposta: Kali segue para o altar. Os registros podem confirmar o paradeiro de Tomas, mas Mira continua atrás da grade. A porta poderá ser reaberta antes da fuga.

**Variação importante:** após a transferência de Tomas, o texto reconhece que sua cela está vazia e que o resgate foi perdido.

### 19.26. A fita branca — `chave`

**Objetivo:** Pegue a chave de fita branca na mesa da sala de observação.  
**Ponto no mapa:** `keyDesk`.

**Texto de referência:**

> A chave está onde o vigia indicou. A fita branca abre a grade e as celas. Devolvê-la agora preservaria o disfarce, mas deixaria Mira trancada. Kali precisa usá-la primeiro.

**Escolhas:**

1. **Pegar a chave e ir até a grade da ala leste.**  
   Destino: `fechadura`.  
   Efeito direto: `{"flags":{"key":true},"items":["Chave da ala leste"]}`.  
   Indicação: Chave obtida · ainda é preciso abrir a grade.  
   Resposta: A chave está com você. Vá até a grade, ao norte do corredor, e use-a na fechadura.


### 19.27. Três batidas na bancada — `distracao`

**Objetivo:** Dê o sinal a Eron no fundo da cozinha.  
**Ponto no mapa:** `eronKitchen`.

**Texto de referência:**

> — Você vai mesmo abrir? — Eron pergunta.
>
> — Vou. Quando ouvir as panelas, vou para a grade.
>
> — Então conte as três. Não corra antes.
>
> Eron coloca uma pilha instável perto da passagem. O barulho vai prender o vigia à cozinha pelo restante desta preparação. A patrulha do corredor continua.

**Escolhas:**

1. **Dar três batidas e confirmar o resgate.**  
   Destino: `resgate`.  
   Efeito direto: `{"eron":1,"flags":{"organized":true,"distracted":true,"cell":true,"cellOpen":true}}`.  
   Indicação: Dois vigias deixam de patrulhar · grade aberta · Eron +1.  
   Resposta: As panelas caem. O vigia da cozinha e o do salão vão ajudar. A grade fica destrancada; Mira ouve o barulho do outro lado.


### 19.28. A lingueta por dentro — `fechadura`

**Objetivo:** Examine a fechadura na entrada da ala restrita.  
**Ponto no mapa:** `cellDoor`.

**Texto de referência:**

> A grade deixa ver a lingueta. Um arame pode levantá-la. Sem ferramenta, você pode esperar o vigia abrir depois do sino e impedir que a porta feche.
>
> Ambos os métodos deixam um sinal. O arame faz pouco barulho; travar a porta durante a ronda chama mais atenção.
>
> Se ainda não observou a ronda, a entrada da cozinha permite estudá-la. O diário e o mapa mostram esse ponto.

**Escolhas:**

1. **Usar a chave de fita branca.**  
   Destino: `resgate`.  
   Efeito direto: `{"flags":{"cell":true,"cellOpen":true}}`.  
   Requisito ausente neste exemplo: Consiga a chave com autorização dos adultos.  
   Indicação: Grade aberta · sem aumento da vigilância.  
   Resposta: O mecanismo cede sem ruído. A grade permanece aberta enquanto você entra para falar com Mira.

2. **Usar o arame para levantar a lingueta.**  
   Destino: `resgate`.  
   Efeito direto: `{"suspicion":1,"consume":["Arame"],"flags":{"cell":true,"cellOpen":true,"wireUsed":true}}`.  
   Requisito ausente neste exemplo: Pegue o arame na bancada da cozinha.  
   Indicação: Arame consumido · vigilância +1.  
   Resposta: O arame se entorta e fica preso no mecanismo. Kali abre a grade. O metal solto denuncia uma interferência; a ferramenta não pode ser reutilizada.

3. **Passar depois do sino e bloquear a grade.**  
   Destino: `resgate`.  
   Efeito direto: `{"suspicion":2,"flags":{"cell":true,"cellOpen":true,"forcedCell":true}}`.  
   Requisito ausente neste exemplo: Estude a ronda na entrada da cozinha primeiro.  
   Indicação: Vigilância +2 · a grade avariada ficará visível.  
   Resposta: Na volta, o vigia abre a grade. Kali prende uma lasca de madeira na lingueta e espera os passos sumirem. A porta não fecha como deveria.

4. **Voltar e escolher outro método.**  
   Destino: `confinamento`.  
   Indicação: Você pode preparar outra forma de entrar.  
   Resposta: Kali deixa a grade intocada. Uma ferramenta, um aliado ou o serviço de bandejas ainda podem mudar a situação.


### 19.29. Uma promessa precisa de uma porta — `resgate`

**Objetivo:** Entre na ala leste e decida se vai libertar Mira agora.  
**Ponto no mapa:** `miraCell`.

**Texto de referência:**

> Mira se aproxima da grade. — Ouvi Tomas atrás da divisória. Não o deixaram falar desde ontem. A ordem diz que vão nos levar ao amanhecer.
>
> — Posso abrir a sua agora.
>
> — Então abra. Não diga que vai voltar só para eu parar de pedir.
>
> Ela mostra uma marca no punho. — Os objetos confiscados ficam sob o altar. Há três discos. O livro da sala de leitura guarda a ordem. Nos arquivos, procure o registro de saída: ele prova que ninguém foi transferido ainda.

**Escolhas:**

1. **Libertar Mira e levá-la à cozinha para esperar.**  
   Destino: `subsolo`.  
   Efeito direto: `{"mira":1,"flags":{"rescued":true,"miraTaken":true,"passage":true,"altarClue":true}}`.  
   Indicação: Mira livre e visível na cozinha · resgate de Tomas agora pode ser preparado.  
   Resposta: Kali abre a porta e acompanha Mira até a passagem. Ela seguirá até a cozinha, onde poderá preparar a saída. Uma cela vazia fica para trás.

2. **Pedir que espere e ir atrás do registro primeiro.**  
   Destino: `subsolo`.  
   Efeito direto: `{"mira":-1,"flags":{"rescueSkipped":true,"altarClue":true}}`.  
   Indicação: Mira −1 · ela permanece na cela. Você pode voltar antes do confronto.  
   Resposta: — Não vou chamar isso de resgate — Mira diz. — Vá buscar a prova. Mas a porta continua entre nós. / Kali guarda a localização dos registros.

**Variação importante:** após a transferência de Tomas, o texto reconhece que sua cela está vazia e que o resgate foi perdido.

### 19.30. Sino, chama e raiz — `subsolo`

**Objetivo:** Resolva o mecanismo de três símbolos na base do altar.  
**Ponto no mapa:** `altar`.

**Texto de referência:**

> Três discos cercam a base do obelisco. Um sino, uma chama e uma raiz. O mecanismo é uma porta de manutenção, escondida dentro do ritual da Actras.
>
> Uma inscrição pode ser lida sob a toalha: “O sino chama. A chama revela. A raiz guarda.” É uma ordem de abertura.
>
> Uma sequência errada faz o sino interno soar e aumenta a vigilância. A inscrição continua disponível; você não precisa adivinhar sem uma pista.

**Escolhas:**

1. **Pressionar sino → chama → raiz.**  
   Destino: `arquivo`.  
   Efeito direto: `{"flags":{"tunnel":true,"altarClue":true}}`.  
   Indicação: Passagem aberta · arquivos acessíveis.  
   Resposta: A base desliza. Kali desce a escada e chega aos arquivos. A entrada de manutenção da cozinha também destranca: agora existe um caminho de volta pelo mapa.

2. **Pressionar chama → raiz → sino.**  
   Destino: `subsolo`.  
   Efeito direto: `{"suspicion":1}`.  
   Indicação: Erro: vigilância +1. Releia a inscrição.  
   Resposta: O sino interno toca uma vez. A base não se move. A frase começa pelo sino; Kali pode tentar de novo ou se preparar antes.

3. **Ler a inscrição sob a toalha.**  
   Destino: `subsolo`.  
   Efeito direto: `{"flags":{"altarClue":true}}`.  
   Indicação: Código registrado: sino → chama → raiz.  
   Resposta: “O SINO chama. A CHAMA revela. A RAIZ guarda.” Três verbos, três símbolos, uma ordem. Kali registra a sequência no diário.


### 19.31. O registro que ainda não aconteceu — `arquivo`

**Objetivo:** Leia o registro T-17 nos arquivos subterrâneos.  
**Ponto no mapa:** `records`.

**Texto de referência:**

> T-17. Tomas. “Ala leste, cela interna. Saída prevista: amanhecer.” A assinatura já está no campo “recebido”, mas o transporte ainda não chegou. A Actras registrou uma transferência que não ocorreu.
>
> O documento de Mira foi preparado da mesma maneira. A lista inclui o destino: uma unidade isolada mantida pela própria Actras. Os desaparecimentos formam um procedimento, não acidentes.
>
> Kali pode levar prova para quem está fora ou destruir a ordem para atrasar a transferência. O armário ao lado guarda seu símbolo. Depois, será preciso preparar a saída e decidir por quem voltar.

**Escolhas:**

1. **Levar o registro assinado como prova.**  
   Destino: `reliquia`.  
   Efeito direto: `{"flags":{"proof":true},"items":["Registro de transferência"]}`.  
   Indicação: Prova obtida · habilita mobilização e muda o epílogo.  
   Resposta: Kali dobra o papel pelas marcas antigas. Agora há nomes, datas, destino e assinatura. A prova poderá ser mostrada aos moradores e entregue fora de OldHood.

2. **Destruir a ordem para atrasar o transporte.**  
   Destino: `reliquia`.  
   Efeito direto: `{"flags":{"transferDelayed":true}}`.  
   Indicação: Transporte atrasado · a prova original foi perdida.  
   Resposta: Kali rasga a ordem e espalha as partes sob a estante. A saída terá de ser autorizada de novo. Isso ganha tempo para Tomas, mas elimina a prova assinada.

**Variação importante:** após a transferência de Tomas, o texto reconhece que sua cela está vazia e que o resgate foi perdido.

### 19.32. A lembrança e as pessoas — `reliquia`

**Objetivo:** Recupere o símbolo no armário dos arquivos.  
**Ponto no mapa:** `relic`.

**Texto de referência:**

> O símbolo está num envelope marcado com a data do acidente. O cordão ainda tem barro no nó. Kali o reconhece antes de tocar.
>
> Não há uma explicação sobre a morte de seus pais no envelope. Só a ordem de entrada em OldHood e a classificação “objeto não permitido”. Kali não transforma essa ausência numa resposta.
>
> Recuperar a lembrança era um começo. O destino de Tomas depende do que você fez antes do último sino. Uma saída sem plano pode terminar na primeira curva. Eron espera na cozinha; você pode preparar ajuda antes de enfrentar a saída.

**Escolhas:**

1. **Guardar o símbolo e reunir o que falta para fugir.**  
   Destino: `preparar`.  
   Efeito direto: `{"flags":{"relic":true},"items":["Símbolo do Luzitruismo"]}`.  
   Indicação: Preparação sob prazo: priorize pessoas, aliados e saída. Confira as ações restantes.  
   Resposta: O metal volta à palma de Kali. Cada preparação custa uma ação do prazo de Tomas. Caminhar e ler não gastam ações. O diário mostra o que falta para cada rota.


### 19.33. Antes que o sino toque outra vez — `preparar`

**Objetivo:** Prepare a fuga e confirme o plano na mesa da cozinha.  
**Ponto no mapa:** `meeting`.

**Texto de referência:**

> — Quem vai sair? — Eron pergunta.
>
> Kali precisa responder com nomes e tarefas. Mira pode orientar os moradores. Eron precisa de um trajeto. Tomas não abrirá a cela por dentro. Noah precisa cumprir o que prometeu.
>
> Você pode voltar aos cômodos, usar os objetos e preparar aliados. O mapa marca os pontos opcionais em azul. O diário explica o que cada rota exige.
>
> Confirmar abaixo inicia o confronto. Até esse momento, você pode mudar de ideia e completar o que estiver faltando. Depois, a Actras fechará o cerco.

**Escolhas:**

1. **Revisar as tarefas e continuar explorando.**  
   Destino: `preparar`.  
   Indicação: Preparações abertas. Use E nos personagens e objetos marcados.

2. **Estou pronto: seguir para a saída.**  
   Destino: `confronto`.  
   Efeito direto: `{"flags":{"committed":true}}`.  
   Indicação: IRREVERSÍVEL: encerra a preparação livre. Confira o diário antes.


### 19.34. O que sua escolha pode cumprir — `confronto`

**Objetivo:** Enfrente o líder no corredor e escolha uma rota preparada.  
**Ponto no mapa:** `climax`.

**Texto de referência:**

> — Você confundiu cuidado com permissão — o líder diz, bloqueando o corredor.
>
> — Vocês assinaram saídas de pessoas que ainda estavam presas — Kali responde.
>
> A ordem não está com Kali. A acusação precisa ser sustentada por quem conseguiu libertar e pelo que os outros viram.
>
> Os caminhos abaixo mostram o que você preparou e o que falta. Escolher uma rota incompleta tem um risco concreto; confiança, pessoas livres e portas abertas não são intercambiáveis.

**Sem preparação (estado demonstrativo):**

1. **Chamar o grupo mesmo sem preparação suficiente.**  
   Destino: `captura`.  
   Efeito direto: `{"flags":{"escapeGroup":true}}`.  
   Indicação: Mira ainda está presa. Esta tentativa termina em captura.  
   Resposta: O sinal não encontra um grupo preparado. Os vigias isolam Kali antes que alguém consiga abrir a passagem.

2. **Usar a confiança dos adultos como disfarce.**  
   Destino: `disfarce`.  
   Requisito ausente neste exemplo: Exige confiança 3 com os adultos.  
   Indicação: Você poderá fugir ou usar o acesso para voltar.  
   Resposta: — Posso levar os outros de volta — Kali diz. O líder reconhece o serviço que ele prestou e permite a passagem.

3. **Depender de Noah sem uma saída verificada.**  
   Destino: `traicao`.  
   Efeito direto: `{"flags":{"escapeNoah":true}}`.  
   Indicação: Falta verificar o trinco com Noah. Confiar nesta rota termina em traição.  
   Resposta: Noah não preparou uma saída para o grupo. Diante do líder, entrega o símbolo que Kali estende. A promessa sem ação não abriu a porta.

4. **Correr sozinho pela passagem de serviço.**  
   Destino: `isolamento`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você não aprendeu o trajeto. A tentativa termina em isolamento.  
   Resposta: Sem conhecer o trajeto, Kali entra no ramal de carvão. A parede ao fundo não é uma porta.

**Preparado (estado demonstrativo):**

1. **Dar o sinal combinado e sair com o grupo.**  
   Destino: `travessia`.  
   Efeito direto: `{"flags":{"escapeGroup":true}}`.  
   Indicação: ROTA PREPARADA: Mira livre, apoio e trajeto combinado.  
   Resposta: Mira organiza a fila; Eron aponta a curva. Atravesse o corredor até a última porta. Ainda é preciso chegar lá.

2. **Usar a confiança dos adultos como disfarce.**  
   Destino: `disfarce`.  
   Indicação: Você poderá fugir ou usar o acesso para voltar.  
   Resposta: — Posso levar os outros de volta — Kali diz. O líder reconhece o serviço que ele prestou e permite a passagem.

3. **Usar o trinco que Noah abriu.**  
   Destino: `travessia`.  
   Efeito direto: `{"flags":{"escapeNoah":true}}`.  
   Indicação: ROTA VERIFICADA: trinco aberto, Mira livre e Eron aliado.  
   Resposta: Noah ergue a mão. O trinco está solto. Mira e Eron seguem para a porta lateral. Kali ainda precisa atravessar o corredor.

4. **Correr sozinho pela passagem de serviço.**  
   Destino: `travessia`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você conhece a saída, mas abandonará o grupo.  
   Resposta: Kali conhece a curva. Segue sozinho para o portão, deixando os outros sem o sinal.

**Eron denunciado (estado demonstrativo):**

1. **Chamar o grupo mesmo sem preparação suficiente.**  
   Destino: `captura`.  
   Efeito direto: `{"flags":{"escapeGroup":true}}`.  
   Indicação: Eron foi denunciado e está preso. Esta tentativa termina em captura.  
   Resposta: O sinal não encontra um grupo preparado. Os vigias isolam Kali antes que alguém consiga abrir a passagem.

2. **Usar a confiança dos adultos como disfarce.**  
   Destino: `disfarce`.  
   Indicação: Você poderá fugir ou usar o acesso para voltar.  
   Resposta: — Posso levar os outros de volta — Kali diz. O líder reconhece o serviço que ele prestou e permite a passagem.

3. **Depender de Noah sem uma saída verificada.**  
   Destino: `traicao`.  
   Efeito direto: `{"flags":{"escapeNoah":true}}`.  
   Indicação: Falta preparar Eron. Confiar nesta rota termina em traição.  
   Resposta: Noah não preparou uma saída para o grupo. Diante do líder, entrega o símbolo que Kali estende. A promessa sem ação não abriu a porta.

4. **Correr sozinho pela passagem de serviço.**  
   Destino: `travessia`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você conhece a saída, mas abandonará o grupo.  
   Resposta: Kali conhece a curva. Segue sozinho para o portão, deixando os outros sem o sinal.


### 19.35. A última curva — `travessia`

**Objetivo:** Atravesse o corredor até a última curva, evitando o vigia.  
**Ponto no mapa:** `escapeTurn`.

**Texto de referência:**

> Mira e Eron alcançam a última curva. O vigia ainda patrulha o corredor. Quando ele se virar, Kali pode avançar furtivamente até o portão.
>
> Chegar até aqui exigiu decisões. Sair ainda exige atravessar o lugar que elas mudaram. O portão fica no extremo leste do corredor.

**Escolhas:**

1. **Conferir a curva e avançar até o portão.**  
   Destino: `portao`.  
   Indicação: Último objetivo: alcançar o portão sem ser capturado.  
   Resposta: A porta está ao fim do corredor. O som do sino fica atrás de Kali.


### 19.36. Do lado de fora — `portao`

**Objetivo:** Chegue ao portão e atravesse para concluir a fuga.  
**Ponto no mapa:** `exit`.

**Texto de referência:**

> A madeira cede. O ar da madrugada entra pela fresta. Kali segura o símbolo, mas olha primeiro para quem conseguiu chegar até ali.

**Escolhas:**

1. **Atravessar o portão.**  
   Destino: `sobrevivente` se fuga individual; `luz` se rota de Noah; caso contrário `voz`. A perda de apoio coletivo ainda pode redirecionar para `captura`..  
   Indicação: O epílogo registra quem saiu, quem ficou e o destino das provas.


### 19.37. A liberdade de quem? — `disfarce`

**Objetivo:** Use seu disfarce no portão: fugir ou voltar pelos outros.  
**Ponto no mapa:** `exit`.

**Texto de referência:**

> O líder permitiu que Kali circulasse para recolher os moradores. A mesma autorização pode levar uma pessoa para fora ou abrir caminho para várias.
>
> Voltar exige a chave ou uma distração organizada e Mira livre. Sem acesso, os vigias retornarão antes que a primeira porta ceda.

**Sem preparação (estado demonstrativo):**

1. **Aproveitar a autorização e fugir sozinho.**  
   Destino: `sobrevivente`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você sai; os demais não recebem seu sinal.  
   Resposta: Kali atravessa antes que o vigia confira a lista.

2. **Voltar para abrir as portas e levar os outros.**  
   Destino: `captura`.  
   Efeito direto: `{"flags":{"returned":true}}`.  
   Indicação: PERIGO: faltam acesso e apoio. Voltar assim termina em captura.  
   Resposta: Sem chave nem aliados preparados, Kali demora na primeira grade. Os vigias retomam o corredor.

**Preparado (estado demonstrativo):**

1. **Aproveitar a autorização e fugir sozinho.**  
   Destino: `sobrevivente`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você sai; os demais não recebem seu sinal.  
   Resposta: Kali atravessa antes que o vigia confira a lista.

2. **Voltar para abrir as portas e levar os outros.**  
   Destino: `voz`.  
   Efeito direto: `{"flags":{"returned":true}}`.  
   Indicação: Chave disponível: abre as celas de quem ainda estiver aqui.  
   Resposta: A chave abre as celas de Mira e Tomas. Eron desperta os outros. Kali usa a última ordem do líder para conduzir todos para fora.

**Eron denunciado (estado demonstrativo):**

1. **Aproveitar a autorização e fugir sozinho.**  
   Destino: `sobrevivente`.  
   Efeito direto: `{"flags":{"escapeSolo":true}}`.  
   Indicação: Você sai; os demais não recebem seu sinal.  
   Resposta: Kali atravessa antes que o vigia confira a lista.

2. **Voltar para abrir as portas e levar os outros.**  
   Destino: `captura`.  
   Efeito direto: `{"flags":{"returned":true}}`.  
   Indicação: PERIGO: Eron foi denunciado. O retorno coletivo termina em captura.  
   Resposta: A chave alcança a grade, mas o nome que Kali entregou não pode reunir ninguém. Sem Eron, a tentativa de retorno termina sob o cerco.


### 19.38. A Voz — `voz`

**Tipo:** encerramento.

**Texto de referência:**

> Os primeiros moradores atravessam a porta. Mira conta cada pessoa em voz baixa. Eron confere a curva, volta dois passos e chama quem ainda hesita.
>
> A Actras perde o controle do corredor porque a fuga tem tarefas, uma entrada e uma saída. Kali não precisa inventar um caminho no último instante.

**Frase:** A confiança pode salvar.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

### 19.39. A Luz — `luz`

**Tipo:** encerramento.

**Texto de referência:**

> Noah segura a porta lateral enquanto Kali, Mira e Eron atravessam. A mudança começou no trinco que ele abriu diante deles.
>
> — Vai. Alguém precisa segurar.
>
> Kali olha para trás. Noah fica para atrasar o vigia. Seu destino permanece desconhecido; a ajuda não apaga as denúncias que levaram Mira à cela.

**Frase:** Ninguém deveria decidir no que você deve acreditar.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

### 19.40. Sobrevivente — `sobrevivente`

**Tipo:** encerramento.

**Texto de referência:**

> Kali alcança as árvores e só para quando o sino já parece distante. Está livre.
>
> Sobreviver foi uma escolha. O que fez antes de correr determina quem ainda pode esperar por ajuda e que prova existe fora dos muros.

**Frase:** O silêncio pode proteger. Mas também deixa ecos.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

### 19.41. Traição — `traicao`

**Tipo:** encerramento.

**Texto de referência:**

> O vigia fecha a porta. Noah fica do outro lado. Dessa vez, não pode dizer que não percebeu a cadeira nem a câmera.
>
> A investigação termina sob o controle da Actras. A confiança que não exigiu uma ação verificável ofereceu aos adultos a passagem que faltava.

**Frase:** A confiança também pode destruir.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

### 19.42. Isolamento — `isolamento`

**Tipo:** encerramento.

**Texto de referência:**

> O ramal termina no depósito de carvão. A porta desenhada na parede não tem maçaneta. Kali se vira e encontra o vigia.
>
> Um percurso poderia ter sido aprendido com Eron. Sem essa preparação, a urgência levou Kali a um lugar que não tinha saída.

**Frase:** Nem todo silêncio é abrigo.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

### 19.43. Sob Vigilância — `captura`

**Tipo:** encerramento.

**Texto de referência:**

> O cerco fecha antes da passagem. A Actras retoma o corredor e separa Kali de quem poderia ajudá-lo.
>
> A suspeita acumulada, uma porta forçada ou um plano incompleto deixaram uma oportunidade para os vigias. O diário guarda a sequência que levou até aqui.

**Frase:** Em um lugar onde todos observam, até uma conversa pode ser perigosa.

O painel de consequências é acrescentado conforme o estado da partida; ver seção 10.

## 20. Catálogo das interações opcionais

As interações abaixo vêm de `GameAdventure.actions`. Exigem que o confronto ainda não tenha sido confirmado e que a partida não esteja num final. A partir do confinamento, sua execução custa uma ação do prazo ativo. Flags `once` e `done` impedem repetições.

### Uma porção guardada — `bread`

**Personagem:** kali. **Disponível a partir do ato:** 2. **Ponto:** `bread`.

A interação encerra quando `breadTaken` é verdadeiro.

- **Guardar o pão para Mira.**
  - Efeito: `{"flags":{"breadTaken":true},"items":["Pão"]}`.
  - Resposta: O pão vai para o bolso. Ao falar com Mira, você poderá entregá-lo.

### A lingueta e o arame — `tools`

**Personagem:** kali. **Disponível a partir do ato:** 2. **Ponto:** `tools`.

A interação encerra quando `toolTaken` é verdadeiro.

- **Pegar o arame.**
  - Efeito: `{"flags":{"toolTaken":true},"items":["Arame"]}`.
  - Resposta: Você fecha a caixa e guarda o arame. A opção aparecerá diante da grade.

### Esperar a volta — `studyRoute`

**Personagem:** kali. **Disponível a partir do ato:** 2. **Ponto:** `watch`.

A interação encerra quando `timing` é verdadeiro.

- **Anotar o intervalo.**
  - Efeito: `{"flags":{"timing":true},"items":["Horário da ronda"]}`.
  - Resposta: Intervalo registrado. Você pode usar a passagem do vigia como alternativa ao arame.

### Um lençol no lugar certo — `camera`

**Personagem:** kali. **Disponível a partir do ato:** 2. **Ponto:** `cover`.

A interação encerra quando `cameraCovered` é verdadeiro.

- **Estender o lençol diante da lente.**
  - Efeito: `{"suspicion":-1,"flags":{"cameraCovered":true}}`.
  - Resposta: A luz vermelha desaparece atrás do tecido. A vigilância cai um ponto; as rondas continuam.

### O que você consegue cumprir? — `mira`

**Personagem:** mira. **Disponível a partir do ato:** 2. **Ponto:** `mira`.

- **Entregar sua porção de pão.**
  - Efeito: `{"mira":1,"consume":["Pão"],"flags":{"fedMira":true}}`.
  - Uma vez por partida: `fedMira`.
  - Condição indicada num estado sem preparação: Pegue o pão na bancada da cozinha.
  - Resposta: Mira parte o pão e guarda metade para Tomas. — Vou lembrar disso. Agora precisamos da porta.
- **Explicar por que vestiu a braçadeira.**
  - Efeito: `{"mira":1,"flags":{"coverExplained":true}}`.
  - Uma vez por partida: `coverExplained`.
  - Condição indicada num estado sem preparação: Você não veste a braçadeira de serviço.
  - Resposta: Kali explica a chave de fita branca. — Não estou trabalhando para eles. Estou usando o trabalho para chegar à grade. / — Então me mostre quando abrir — Mira responde.
- **Usar a grade aberta para libertá-la.**
  - Efeito: `{"mira":1,"flags":{"rescued":true,"passage":true,"altarClue":true}}`.
  - Uma vez por partida: `rescued`.
  - Condição indicada num estado sem preparação: Mira ainda está livre.
  - Resposta: Kali abre a cela. Mira segue para a cozinha e espera ao lado da passagem. Você cumpriu a promessa antes de confirmar a fuga.

### Quem faz o quê — `eron`

**Personagem:** eron. **Disponível a partir do ato:** 2. **Ponto:** `eronKitchen`.

- **Mostrar a requisição da ala leste.**
  - Efeito: `{"eron":1,"flags":{"evidenceShared":true}}`.
  - Uma vez por partida: `evidenceShared`.
  - Condição indicada num estado sem preparação: Encontre a requisição na caixa da cozinha.
  - Resposta: Eron lê o número de Tomas. — Então ainda dá tempo. Eu ajudo a contar a ronda.
- **Aprender o trajeto e assumir uma tarefa na fuga.**
  - Efeito: `{"eron":1,"flags":{"pledgedEron":true,"passage":true},"items":["Trajeto de Eron"]}`.
  - Uma vez por partida: `pledgedEron`.
  - Resposta: — Você abre a porta; eu conto quem passa. Esquerda depois da escada — Eron explica. Kali repete até não trocar a curva.
- **Combinar a rota com todos que puderem sair.**
  - Efeito: `{"flags":{"escapePlan":true,"passage":true}}`.
  - Uma vez por partida: `escapePlan`.
  - Condição indicada num estado sem preparação: Primeiro descubra o que os arquivos escondem.
  - Resposta: Eron distribui as tarefas: Mira acompanha a fila, Kali abre a passagem, ele confere os nomes. A rota coletiva agora tem um plano.

**Bloqueio adicional:** todas as respostas ficam indisponíveis se Eron foi denunciado.

### Faça, depois fale — `noah`

**Personagem:** noah. **Disponível a partir do ato:** 4. **Ponto:** `exitLatch`.

- **Observar Noah soltar o trinco.**
  - Efeito: `{"noah":1,"flags":{"latchOpen":true}}`.
  - Uma vez por partida: `latchOpen`.
  - Condição indicada num estado sem preparação: Confronte Noah e peça uma reparação concreta primeiro.
  - Resposta: O ferro desce. Kali testa a porta e sente a folga. — Isso não muda o que você fez. / — Eu sei. Mas muda se ela abre. / A saída de Noah pode agora ser verificada.

### O nome por trás da divisória — `tomas`

**Personagem:** kali. **Disponível a partir do ato:** 4. **Ponto:** `tomas`.

A interação encerra quando `tomasRescued` é verdadeiro.

- **Abrir a divisória e levá-lo até Mira.**
  - Efeito: `{"mira":1,"flags":{"tomasRescued":true}}`.
  - Condição indicada num estado sem preparação: Abra a grade principal primeiro.
  - Resposta: Tomas sai segurando a caneca. Kali o leva até a passagem da cozinha. Pela primeira vez, o nome T-17 voltou a ser uma pessoa visível.

**Bloqueio adicional:** o resgate fica indisponível se Tomas foi transferido.

### Ainda é possível voltar — `gate`

**Personagem:** kali. **Disponível a partir do ato:** 4. **Ponto:** `cellDoor`.

A interação encerra quando `cellOpen` é verdadeiro.

- **Usar a chave de fita branca.**
  - Efeito: `{"flags":{"cellOpen":true}}`.
  - Condição indicada num estado sem preparação: Você não tem a chave.
  - Resposta: A grade abre. Mira e Tomas continuam nas celas; entre e fale com eles.
- **Usar o arame (+1 vigilância).**
  - Efeito: `{"suspicion":1,"consume":["Arame"],"flags":{"cellOpen":true,"wireUsed":true}}`.
  - Condição indicada num estado sem preparação: Pegue o arame na cozinha.
  - Resposta: A grade abre; o arame fica preso. Entre na ala para libertar os moradores.
- **Aproveitar o intervalo da ronda (+2 vigilância).**
  - Efeito: `{"suspicion":2,"flags":{"cellOpen":true,"forcedCell":true}}`.
  - Condição indicada num estado sem preparação: Observe a ronda na entrada da cozinha.
  - Resposta: Você impede que a grade feche. O defeito será percebido. Mira e Tomas ainda aguardam dentro das celas.

**Regra adicional:** ruído que eleva a vigilância a 7 ou mais provoca captura; chave silenciosa não passa por esse teste.

---

**Fim da documentação.** Este arquivo descreve o estado construído até 25/09/2026. Quando houver novas mudanças, atualizar sobretudo os requisitos dos finais, as regras de perigo, o mapeamento de sprites, o catálogo e o fluxograma.
