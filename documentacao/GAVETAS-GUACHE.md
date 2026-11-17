# Gavetas em guache — 13/11/2026

## 1. Propósito
Substituir os sprites pixelados das duas gavetas do dormitório pela linguagem de guache expressivo aprovada, integrada ao mapa atual.

## 2. Experiência do jogador
Manter reconhecimento do puxador e diferença entre fechado e aberto. O interior aberto conserva os papéis antigos já descritos pela interação. Não acrescenta documento coletável nem símbolo narrativo.

## 3. Regras
Mesmas posições, áreas de interação, colisões, comandos, mensagens e persistência. Nenhuma alteração em história, escolhas ou condições dos seis finais.

## 4. Visual e som
Madeira ocre, sombras ameixa, pinceladas opacas e contornos seletivos. Clima de desgaste silencioso do orfanato. A imagem substitui apenas a frente dos móveis: tampo e vela continuam no cenário. Dois recortes com limites iguais; atlas em resolução maior e redução suavizada. Som não se aplica.

## 5. Impacto existente
Novo atlas `assets/exploracao/gavetas-guache-v1.png`; original preservado. O renderer ajusta coordenadas de recorte à resolução da imagem, mantendo o destino 27×24. Revisões de cache atualizadas. Backup de código, atlas antigo e HTML em `backups/antes-gavetas-guache-2026-11-13`.

## 6. Tamanho da implementação
Uma prancha com dois estados compartilhada pelas duas gavetas. Fonte gerada pela ferramenta integrada image_gen, empacotada mecanicamente por `tools/prepare-drawer-art.cjs`. Prompt e procedência em `artes-gavetas-2026-11-13.json`.

## 7. Testes e conclusão
131 testes automatizados aprovados, incluindo acesso às gavetas, abrir/fechar, salvamento, compatibilidade com saves anteriores e preservação do estado narrativo. Build estático concluído. Navegador: duas gavetas testadas em computador (1280×900), celular (390×844) e horizontal (844×390), com teclado/toque, abertura, fechamento e retomada após recarregar; nenhuma exceção JavaScript. A fotografia próxima tem prioridade de interação existente; os testes das gavetas partiram de um save com ela já coletada. Verificação visual e de navegador registrada em `previas/gavetas-guache/verificacao.json` e capturas da mesma pasta.

Critério 1: **atende no escopo da alteração** — puxador, interior, comandos e mensagens preservam a orientação. Critério 2: **atende por preservação** — papéis existentes sem inventar provas ou escolhas. Critério 3: **atende por preservação** — nenhuma condição ou texto de final alterado. Não houve teste com participante novo; verificações técnicas e revisão visual não comprovam compreensão de jogadores desconhecedores do projeto.
