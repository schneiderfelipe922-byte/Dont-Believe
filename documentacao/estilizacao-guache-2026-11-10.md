# Aplicação do guache estilizado

Backup completo anterior: `backups/artes-antes-estilizacao-2026-11-10/assets`, com 106 arquivos e manifesto SHA-256. As imagens anteriores também permanecem em seus caminhos originais. As novas imagens têm sufixo `-guache-v2.png`.

Aplicado ao menu, mapa do orfanato, estrada, altar, duas fotografias, duas cenas dos pais e atlas dos seis finais. Preservados sprites e retratos de diálogo para a etapa de personagens. O armazém v2 aprovado foi mantido. Máquina recebeu cesto de roupas sujas e Tomas perdeu a borda de papel desgastada.

Ferramenta: image_gen integrada. Prompts completos, fontes geradas e destinos estão em `estilizacao-guache-2026-11-10.json`.

O mapa gerado mede 1495×1052. O renderer converte recortes de origem proporcionalmente ao espaço de autoria de 1456×1080, preservando destinos de desenho e geometria do jogo. Ilustrações e menu usam novos caminhos; hashes de cache e pacote estático vercel-dist atualizados. Não houve publicação remota.

Validação: suíte existente de 110 testes passou; teste adicional cobre conversão de resolução do atlas. Playtests do navegador passaram para portas, teclado, seis finais, celular, prólogo em computador/celular/horizontal, retomada de saves, recuperação de imagens e carregamento local sem rede. Capturas em `previas/colisoes` e `previas/prologo`; inspeção visual do mapa com colisões sobrepostas, porta, final A Voz e prólogo móvel.

As três revelações da expansão continuam apenas preparadas no módulo; os gatilhos de lavanderia, armazém e cela ainda não estão integrados ao jogo. Esta entrega aplica a direção visual às cenas existentes, não conclui a expansão narrativa.
