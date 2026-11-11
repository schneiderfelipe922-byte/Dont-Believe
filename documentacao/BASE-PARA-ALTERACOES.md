# Base permanente para alterações em Don't Believe

Registrada por solicitação do usuário em 10/11/2026. Aplicar sempre, antes de implementar qualquer nova ideia ou mudança, inclusive as sugeridas pelo próprio usuário.

## As três perguntas

### 1. O jogador entende o que precisa fazer sem explicação de quem criou o jogo?

O objetivo imediato, as possibilidades de interação e o retorno das ações precisam ser compreensíveis dentro do jogo. Diálogos, cenário, controles e diário devem fornecer orientação suficiente. Mistérios podem permanecer em aberto; a ação necessária para continuar não deve depender de uma explicação externa do autor.

Verificar: o que informa o próximo passo? O jogador reconhece onde ou como agir? Se voltar após uma pausa, consegue recuperar a orientação? Há informação suficiente antes de uma decisão com risco?

### 2. As pistas e escolhas realmente fazem diferença na percepção da história?

Pistas devem acrescentar, confirmar, contradizer ou contextualizar informações relevantes. Escolhas devem expressar uma posição ou produzir uma resposta perceptível e coerente. Uma diferença pode ser narrativa, relacional ou interpretativa; não precisa gerar um novo caminho em todos os casos. Rumores, interpretações e fatos comprovados devem continuar distinguíveis.

Verificar: o que o jogador passa a entender depois da pista? O que muda ao escolher? Como ele percebe essa diferença? A alteração evita tarefas sem propósito e escolhas que prometem consequências inexistentes?

### 3. Os seis finais parecem consequências compreensíveis das decisões?

Cada final deve ter uma relação identificável com decisões, descobertas, omissões e acontecimentos da partida. As consequências precisam ser preparadas ao longo do jogo e reconhecíveis no desfecho, sem exigir que o jogador conheça condições internas do código. Surpresas são possíveis, desde que coerentes com o que foi apresentado.

Verificar: quais acontecimentos explicam o final? O jogador teve sinais suficientes sobre riscos e possibilidades? O epílogo corresponde às pessoas resgatadas, provas preservadas e compromissos assumidos? Uma nova regra cria um bloqueio ou punição sem aviso?

## Procedimento obrigatório

1. Antes de editar, examine a ideia à luz das três perguntas, do roteiro de sete seções abaixo e dos comportamentos atuais do jogo.
2. Classifique cada critério como **atende**, **não atende** ou **precisa de esclarecimento**, com uma justificativa concreta. Para arte ou manutenção técnica, avalie a preservação dos critérios; não invente a necessidade de mudar a história.
3. Se algum critério não for atendido, **avise o usuário e não implemente a ideia**. Identifique a pergunta afetada e o problema. Investigue como atender ao critério preservando o propósito da ideia e apresente sugestões concretas: o que ajustar, por que o ajuste resolve o problema e quais impactos relevantes ele traz. Recomende a alternativa mais adequada quando houver evidência suficiente. Sugerir caminhos de adequação é obrigatório; não se limite a rejeitar. Se ainda faltar informação para uma solução, indique essa limitação e quais esclarecimentos permitem avançar. Aguarde o usuário escolher ou concordar com a proposta ajustada antes de executá-la.
4. Se faltar informação essencial, esclareça a dúvida antes da implementação. Não trate incerteza como aprovação.
5. Quando a ideia atender aos critérios, implemente dentro do escopo autorizado e verifique os efeitos relevantes no jogo, incluindo orientação, retorno das ações e consequências.
6. Relate de forma breve a avaliação e a validação realizada. Diferencie o que foi observado do que ainda depende de teste com jogadores.

## Referência para revisão

| Pergunta | Evidência a procurar |
| --- | --- |
| O jogador sabe o que fazer? | Orientação disponível no próprio jogo, interação reconhecível e próximo passo recuperável. |
| Pistas e escolhas fazem diferença? | Mudança perceptível de entendimento, resposta, relação ou consequência, coerente com a ação. |
| Os finais são compreensíveis? | Relação clara entre acontecimentos da partida, sinais prévios e epílogo apresentado. |

Esta base orienta alterações futuras; seu registro não significa que o jogo atual já tenha sido validado nos três critérios. A compreensão de jogadores novos deve ser observada em testes sem explicações do autor.

## Roteiro permanente para desenvolver e avaliar ideias

Estas sete seções complementam as três perguntas e a regra de não implementar ideias incompatíveis. Use as informações do projeto e da conversa para responder ao que já estiver definido; esclareça com o usuário apenas lacunas essenciais. A profundidade da avaliação deve acompanhar o tamanho da mudança. Itens sem relação com a alteração podem ser marcados como não aplicáveis, com motivo. Os exemplos são referências de raciocínio, não funcionalidades autorizadas.

### 1. A ideia e seu propósito

- O que eu quero adicionar ou mudar?
- Por que essa mudança é importante para o projeto?
- Que problema ela resolve ou que experiência ela cria?
- Como vou perceber que a ideia deu certo?
- Ela combina com a proposta e a identidade do projeto?

**Exemplo:** “Quero adicionar um sistema de suspeita para que as escolhas de Kali aumentem a tensão da investigação.”

### 2. A experiência de quem usa ou joga

- O que a pessoa vai ver, fazer ou sentir com essa mudança?
- Ela vai entender como usar a função sem que eu precise explicar pessoalmente?
- O que acontece na primeira vez que ela encontra essa novidade?
- Existe algo que pode causar confusão ou frustração?
- A experiência continua funcionando bem no celular e no computador, se ambos forem importantes?

### 3. As regras e os detalhes

- Como a função começa e como termina?
- Quais ações ou escolhas a pessoa pode fazer?
- O que acontece em cada escolha?
- Existem limites, custos, recompensas ou consequências?
- O que acontece se a pessoa desistir, voltar atrás ou interromper a atividade?
- A ideia depende de algo que já existe no projeto?

**Exemplo:** se a suspeita aumentar, ela diminui depois? Pode impedir alguma ação? Afeta os finais ou apenas os diálogos?

### 4. Visual, som e identidade

- Como essa ideia deve parecer e soar?
- Ela deve seguir as cores, fontes e o clima que o projeto já usa?
- Tenho uma referência ou consigo descrever o estilo que imagino?
- Há algum detalhe visual ou sonoro que faça diferença para mim?
- Textos, botões e sinais estão fáceis de perceber e entender?

### 5. Impacto no que já existe

- O que essa mudança pode afetar no projeto atual?
- Ela altera a história, os controles, o progresso ou os dados salvos?
- Alguma função existente precisa ser adaptada para funcionar com ela?
- Há algo que eu faço questão de preservar?
- Se houver algum problema, como posso voltar à versão anterior?

### 6. Tamanho da implementação

- Qual seria a versão mais simples que já tornaria a ideia interessante?
- O que precisa estar pronto agora?
- O que pode ficar para uma próxima versão?
- Preciso criar artes, textos, sons ou outros materiais?
- Quero primeiro um planejamento, um protótipo ou a implementação completa?

Essa parte pode ajudar especialmente em ideias grandes, como o *Santuário das Eras*: começar com um ciclo funcionando e depois expandir mundos e criaturas. Essa referência não incorpora outro projeto ou suas funcionalidades ao escopo de Don't Believe.

### 7. Como testar e concluir

- Quais situações mostram que a função está funcionando?
- O que acontece se eu tentar usá-la de um jeito inesperado?
- Alguém que não conhece o projeto conseguiu entendê-la?
- Testei junto com as funções antigas que ela pode afetar?
- O resultado ficou próximo do que eu imaginei? O que precisa de ajuste?

Registre com honestidade quais verificações foram realizadas. Não afirme que jogadores novos compreenderam uma mudança quando houve apenas revisão do código ou teste automatizado.
