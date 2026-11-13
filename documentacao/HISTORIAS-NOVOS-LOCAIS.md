# Histórias dos novos locais — 12/11/2026

## 1. Propósito
Dar memória humana aos locais da expansão: Tomas na lavanderia, confisco no armazém, um amanhã interrompido no quarto de Elias e a partida de Eron e Tomas no pátio. Implementação em `javascript/investigation.js`, sem editar geometria, renderização ou os arquivos de cenários em trabalho no outro chat.

## 2. Experiência do jogador
Quatro encontros opcionais identificados no mapa pelo sistema de interações existente. O diário lista os encontros e permite marcar onde agir. Cada leitura oferece uma próxima investigação concreta. As anotações persistem; Eron comenta a roupa e o tabuleiro, e Mira responde ao recado de Elias quando está disponível.

## 3. Regras
Disponíveis a partir do ato 1, uma conclusão por encontro. No armazém, escolher registrar o nome de Elias ou o procedimento de confisco muda diário e balanço da partida. Não concede afinidade, chave, acesso, prova assinada, sinal, resgate ou rota. O prazo segue a regra existente: uma ação concluída no ato 3 ou posterior custa um turno, anunciado pela interface; ler ou fechar a conversa não conclui a ação. Encontros deixam de estar disponíveis após o compromisso final.

## 4. Visual e som
Sem arte, som ou controles novos. Usa os diálogos e marcações existentes. Tom íntimo, objetos concretos e falas que preservam medo, confiança e dúvida. Não inventa um destino confirmado para Elias.

## 5. Impacto existente
Novas flags opcionais; saves antigos continuam válidos sem migração. Nenhuma condição dos seis finais foi alterada. Conversas respeitam Eron denunciado, Mira presa e Tomas resgatado/transferido. O balanço só menciona a opção do armazém realmente concluída. Cópia anterior em `backups/antes-expansao-historia-2026-11-12/investigation.js`.

## 6. Tamanho
Quatro encontros, duas opções no armazém, respostas contextuais e anotações. Pontos calculados dentro dos novos cômodos, com identificadores próprios `storyPlace_*`. A chave do armazém e a circulação entre andares pertencem à integração espacial em andamento no outro chat; esta expansão não contorna essas trancas.

## 7. Testes e conclusão
23 testes narrativos aprovados: `place-stories`, `investigation` e `narrative-report`. Incluem localização caminhável dentro dos cômodos, marcação no diário, persistência, distinção entre versões e fatos, respostas a perdas e custo da última ação do prazo.

Os testes de percurso dos finais tiveram 7 falhas de 8 durante a integração dos cenários: objetivos de resgate/preparação inacessíveis para o roteiro automatizado. Repetidos em cópia temporária com a versão anterior de investigation.js e o mesmo mapa, reproduziram as mesmas 7 falhas. Não são causadas pelos novos encontros. Isso não valida a circulação completa: é necessário repetir os testes após concluir a integração de andares. Nenhum teste com jogador novo foi realizado nesta rodada.

Avaliação proporcional: clareza **atende no roteiro**, com instrução e próximo passo recuperável no diário; significado **atende**, pois roupa, confisco e lembranças contextualizam o apagamento dos moradores, e a opção do armazém tem retorno distinto; consequências **atende por preservação das regras**, sem conceder saídas nem confundir memória com resgate. A validação da experiência completa permanece pendente da integração espacial e de observação com jogador novo.
