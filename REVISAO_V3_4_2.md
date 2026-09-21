# Revisão V3.4.2

## Correção da fase de grupos — chaves cruzadas

A fase de grupos da competição passa a considerar oficialmente o formato de chaves cruzadas:

- Grupo A x Grupo B: partida válida para a fase de grupos e elegível para contabilizar na classificação;
- Grupo B x Grupo A: partida válida para a fase de grupos e elegível para contabilizar na classificação;
- Grupo A x Grupo A: não contabiliza na classificação da fase de grupos;
- Grupo B x Grupo B: não contabiliza na classificação da fase de grupos.

## Painel administrativo

Na tela de partidas:

- o aviso incorreto sobre jogos entre grupos diferentes foi removido;
- ao selecionar dois times do mesmo grupo na fase de grupos, o painel mostra o aviso: "Na fase de grupos, os jogos são realizados entre times de grupos diferentes. Esta partida não será contabilizada na classificação.";
- nesse cenário, a opção "Contabilizar na classificação" fica desabilitada e a partida é salva com `counts_for_standings = false`;
- a regra é aplicada somente à fase de grupos.

## Classificação

O cálculo existente foi preservado. A única alteração é a validação das partidas da fase de grupos:

- partidas cruzadas entram normalmente no cálculo quando finalizadas e marcadas para contabilizar;
- partidas entre times do mesmo grupo são ignoradas na fase de grupos;
- vitórias, empates, derrotas, gols, saldo e pontos continuam sendo calculados da mesma forma;
- a classificação continua separada por grupo;
- os dois primeiros colocados de cada grupo continuam identificáveis pela ordem da respectiva tabela;
- outras fases não são afetadas pela regra de chaves cruzadas.

## Banco/Supabase

Nenhuma alteração no banco, RLS, Storage, autenticação ou schema do Supabase é necessária.
