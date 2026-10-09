# Tela cheia, fotografia e diálogos compactos — 09/10/2026

86 testes automatizados aprovados, sem falhas. O teste de paginação verifica que nenhum termo, acento ou trecho se perde, inclusive quando um parágrafo é maior que a caixa inteira.

## Verificações no navegador

- Tela cheia nativa por clique e atalho F, saída com F/Esc e saída solicitada pelo navegador.
- Alternativa expandida quando a API não existe ou recusa a solicitação.
- Consultas abertas continuam visíveis acima da tela cheia; caderno e fotografia preservados ao sair.
- Computador 1280×900, celular 390×844 e horizontal 844×390, com controles dentro dos limites da tela.
- Fotografia atualizada carregada, leitura e retorno à seção Objetos.
- Texto de teste extenso exibido integralmente em páginas, sem rolagem ou cobrança de prazo nas quatro combinações de tamanho/modo.
- Quatro escolhas do confronto acessíveis pelas páginas, preservando custos, requisitos e numeração original.
- Exibição dos seis epílogos, confirmação de escolhas, portas e controles móveis.
- Caderno, fontes e imagem locais, abas, marcação solicitada, falha da imagem e funcionamento sem internet.

O ensaio usa um texto de cerca de mil caracteres para forçar várias páginas. Falas comuns usam menos páginas. A quantidade depende do espaço disponível, para preservar a leitura sem reduzir a fonte até ficar ilegível.

## Arquivos

- `testes-automatizados.txt`: execução completa dos 86 testes.
- `verificacao.json`: diálogos em computador, celular, tela cheia e horizontal.
- `../tela-cheia/verificacao.json`: entrada, saída, alternativa expandida e fotografia.
- `../colisoes/verificacao-browser.json`: seis epílogos e controles.
- `../diario/verificacao.json`: regressão do caderno.

As capturas desta pasta mostram a caixa compacta e os retratos menores. A foto nova está em `../../assets/fotos/kali-com-familia.png`, com prompt e procedência ao lado. A versão anterior está em `../../backups/antes-tela-cheia-familia-20261009/`.
