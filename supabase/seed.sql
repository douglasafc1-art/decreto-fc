-- =====================================================================
-- DECRETO FC — Dados fictícios para testes
-- Todos os adversários/jogadores abaixo são FICTÍCIOS.
-- Execute somente depois de schema.sql.
-- =====================================================================

insert into public.teams (name, short_name, group_name, is_decreto, active) values
  ('Decreto FC', 'DECRETO', 'Grupo 1', true, true),
  ('Time B FC (fictício)', 'TIME B', 'Grupo 1', false, true),
  ('Time C FC (fictício)', 'TIME C', 'Grupo 1', false, true),
  ('Time D FC (fictício)', 'TIME D', 'Grupo 2', false, true),
  ('Time E FC (fictício)', 'TIME E', 'Grupo 2', false, true),
  ('Time F FC (fictício)', 'TIME F', 'Grupo 2', false, true)
on conflict do nothing;

insert into public.players (name, display_name, number, position, type, is_captain, active, display_order) values
  ('João Fictício da Silva', 'João', 10, 'Ala', 'jogador', true, true, 1),
  ('Pedro Fictício Souza', 'Pedro', 9, 'Pivô', 'jogador', false, true, 2),
  ('Carlos Fictício Lima', 'Carlos', 7, 'Fixo', 'jogador', false, true, 3),
  ('Gabriel Fictício Rocha', 'Gabriel', 1, 'Goleiro', 'jogador', false, true, 4),
  ('Daniel Fictício Alves', 'Daniel', 5, 'Ala', 'jogador', false, true, 5)
on conflict do nothing;

insert into public.players (name, display_name, role, type, active, display_order) values
  ('Treinador Fictício', 'Treinador', 'Treinador', 'comissao', true, 1),
  ('Auxiliar Fictício', 'Auxiliar', 'Auxiliar Técnico', 'comissao', true, 2)
on conflict do nothing;

do $$
declare
  decreto_id uuid;
  time_b_id uuid;
  time_c_id uuid;
  time_d_id uuid;
  time_e_id uuid;
  time_f_id uuid;
  match1_id uuid;
begin
  select id into decreto_id from public.teams where is_decreto = true;
  select id into time_b_id from public.teams where short_name = 'TIME B';
  select id into time_c_id from public.teams where short_name = 'TIME C';
  select id into time_d_id from public.teams where short_name = 'TIME D';
  select id into time_e_id from public.teams where short_name = 'TIME E';
  select id into time_f_id from public.teams where short_name = 'TIME F';

  -- Grupo 1: jogo finalizado do Decreto.
  insert into public.matches (
    home_team_id, away_team_id, round, phase, counts_for_standings,
    match_date, venue, status, home_score, away_score
  ) values (
    decreto_id, time_b_id, 1, 'grupos', true,
    now() - interval '7 days', 'Ginásio Municipal de Açucena', 'finalizado', 4, 3
  ) returning id into match1_id;

  insert into public.match_scorers (match_id, player_id, goals)
  select match1_id, id, 2 from public.players where display_name = 'João'
  union all
  select match1_id, id, 1 from public.players where display_name = 'Pedro'
  union all
  select match1_id, id, 1 from public.players where display_name = 'Carlos';

  -- Grupo 1: próximo jogo do Decreto.
  insert into public.matches (
    home_team_id, away_team_id, round, phase, counts_for_standings,
    match_date, venue, status
  ) values (
    time_c_id, decreto_id, 2, 'grupos', true,
    now() + interval '5 days', 'Ginásio Municipal de Açucena', 'agendado'
  );

  -- Grupo 1: resultado entre adversários. Não aparece na campanha pública.
  insert into public.matches (
    home_team_id, away_team_id, round, phase, counts_for_standings,
    match_date, venue, status, home_score, away_score
  ) values (
    time_b_id, time_c_id, 2, 'grupos', true,
    now() - interval '4 days', 'Ginásio Municipal de Açucena', 'finalizado', 2, 2
  );

  -- Grupo 2: dois resultados fictícios apenas para demonstrar classificação.
  insert into public.matches (
    home_team_id, away_team_id, round, phase, counts_for_standings,
    match_date, venue, status, home_score, away_score
  ) values (
    time_d_id, time_e_id, 1, 'grupos', true,
    now() - interval '6 days', 'Ginásio Municipal de Açucena', 'finalizado', 2, 1
  );

  insert into public.matches (
    home_team_id, away_team_id, round, phase, counts_for_standings,
    match_date, venue, status, home_score, away_score
  ) values (
    time_e_id, time_f_id, 2, 'grupos', true,
    now() - interval '3 days', 'Ginásio Municipal de Açucena', 'finalizado', 1, 1
  );
end $$;
