# Decreto FC — Site Oficial | Copa Verão 2026

Site público + painel administrativo do **Decreto FC**, de Açucena/MG, preparado para acompanhar a primeira participação do clube no futsal, na **3ª Copa Verão de Futsal Amador de Açucena**.

A aplicação usa o Supabase como backend único (Postgres + Auth + Storage). A classificação e a artilharia do Decreto são calculadas a partir dos resultados cadastrados, sem estatísticas duplicadas no banco.

## 1. O que existe no projeto

### Site público

- Hero com identidade visual do Decreto FC
- Próximo jogo + contagem regressiva
- Último jogo
- Classificação separada por grupos
- Elenco em carrossel contínuo com swipe e controles manuais
- Comissão técnica
- Campanha completa do Decreto
- Artilharia exclusiva do Decreto
- Área de patrocinadores com categorias Master, Ouro, Prata e Apoio
- História do clube e footer

### Painel `/admin`

- Login via Supabase Auth
- Segunda camada de autorização por tabela `admin_users`
- CRUD de times
- CRUD de jogos
- Fase do jogo e opção **Contabilizar na classificação**
- Autores dos gols do Decreto
- CRUD de elenco/comissão
- CRUD de patrocinadores com logo, categoria, link, visibilidade e ordem
- Configurações gerais
- Layout responsivo para celular

## 2. Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase JS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- date-fns + date-fns-tz
- Lucide Icons
- Netlify

## 3. Requisitos

- Node.js 18 ou superior
- npm
- Conta no Supabase
- GitHub
- Netlify

## 4. Instalação local

```bash
npm install
```

Depois crie o arquivo `.env` na raiz a partir de `.env.example`:

```bash
cp .env.example .env
```

No Windows, você também pode simplesmente duplicar `.env.example` e renomear a cópia para `.env`.

Conteúdo:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca coloque a `service_role` no frontend.

## 5. Criar o projeto no Supabase

1. Crie um projeto novo no Supabase.
2. Abra **SQL Editor**.
3. Copie todo o conteúdo de `supabase/schema.sql`.
4. Execute o SQL.

O `schema.sql` já cria:

- tabelas;
- enums;
- índices;
- constraints;
- RLS;
- função de autorização de administradores;
- policies;
- buckets `team-logos`, `players` e `sponsors`;
- policies do Storage;
- linha inicial de configurações do site.

Portanto, **não é necessário criar os buckets manualmente** se o `schema.sql` executar corretamente.

### Projeto já configurado antes da V3.4

No Supabase que já está em uso, **não execute o schema inteiro novamente**. Rode apenas:

`supabase/migrate_v3_4_sponsors.sql`

A migração cria a tabela e o bucket de patrocinadores sem apagar a antiga estrutura de galeria.

## 6. Variáveis do Supabase

No Supabase, abra **Project Settings → API** e copie:

- Project URL → `VITE_SUPABASE_URL`
- anon/public key → `VITE_SUPABASE_ANON_KEY`

Preencha seu `.env` local.

## 7. Criar e autorizar o administrador

A segurança foi feita em duas camadas.

Ter uma conta em `Authentication → Users` **não dá automaticamente acesso administrativo**.

### Passo 1 — criar o usuário

No Supabase:

**Authentication → Users → Add user**

Crie e-mail e senha.

### Passo 2 — autorizar esse usuário

Depois abra **SQL Editor** e execute, substituindo o e-mail:

```sql
insert into public.admin_users (user_id, display_name)
select id, 'Administrador Decreto FC'
from auth.users
where email = 'SEU_EMAIL_AQUI';
```

Para os outros cofundadores, repita o comando com o e-mail de cada um.

Isso evita que qualquer conta autenticada no projeto ganhe acesso ao painel.

## 8. Dados fictícios para teste

Depois do `schema.sql`, opcionalmente execute:

`supabase/seed.sql`

Ele adiciona:

- Decreto FC;
- cinco adversários fictícios;
- dois grupos;
- jogadores fictícios;
- comissão fictícia;
- resultados de teste;
- próximo jogo de teste.

Os adversários do seed **não são times reais**.

Não rode o seed se preferir começar diretamente com os dados oficiais da Copa.

## 9. Rodar localmente

```bash
npm run dev
```

Normalmente o Vite abrirá em:

```text
http://localhost:5173
```

Painel:

```text
http://localhost:5173/admin
```

## 10. Build

```bash
npm run build
```

Para visualizar o build:

```bash
npm run preview
```

## 11. Como cadastrar a competição

### Times

No painel, abra **Times**.

Cadastre nome, sigla, grupo e escudo.

No Decreto FC, marque:

**Este é o Decreto FC**

O banco permite apenas um time com essa marcação. O escudo cadastrado nesse time também passa a ser usado no cabeçalho, Hero e footer do site, com o asset local como fallback.

### Jogos

Cadastre **todos os jogos da Copa**, inclusive os jogos entre outros times.

Os jogos dos adversários servem para a classificação, mas a área pública **Nossa Campanha** mostra somente partidas com o Decreto envolvido.

### Fase e classificação

Cada jogo possui:

- fase: grupos, semifinal, final ou outra;
- opção **Contabilizar na classificação**.

Nos jogos da fase de grupos, mantenha essa opção marcada.

Em semifinal/final, deixe desmarcada.

Assim um resultado de mata-mata não altera a tabela dos grupos.

O cálculo também ignora um jogo classificatório se os dois times estiverem cadastrados em grupos diferentes, protegendo a tabela contra erro de alimentação.

### Autores dos gols

Quando um jogo:

- envolve o Decreto; e
- está com status **Finalizado**;

o painel libera os autores dos gols.

Informe jogador + quantidade.

O sistema compara a soma com o placar do Decreto e mostra alerta em caso de divergência.

Se uma partida deixar de ser finalizada ou deixar de envolver o Decreto, os registros antigos de artilheiros são removidos automaticamente no salvamento.

### Artilharia

A seção pública representa **somente a artilharia do Decreto FC**.

Ela não é cadastrada manualmente: é calculada pelos gols dos jogos finalizados.

### Elenco

Em **Elenco/Comissão** você pode cadastrar:

- nome;
- nome esportivo/apelido;
- número;
- posição;
- capitão;
- foto;
- ordem de exibição;
- comissão técnica e função.

### Patrocinadores

Em **Patrocinadores** você pode cadastrar:

- nome da empresa;
- logo;
- categoria: Master, Ouro, Prata ou Apoio;
- link para site, Instagram ou outra página;
- visibilidade no site;
- ordem de exibição;
- troca de logo;
- edição e exclusão com limpeza do arquivo do Storage.

A área pública organiza os parceiros por categoria e dá mais destaque aos patrocinadores Master.

## 12. Classificação automática

Arquivo principal:

`src/utils/standings.ts`

Critérios atuais:

1. pontos;
2. vitórias;
3. saldo de gols;
4. gols pró;
5. ordem alfabética apenas como último fallback técnico.

Quando o regulamento oficial for divulgado, altere `TIEBREAK_CRITERIA` se necessário.

São considerados apenas jogos:

- `status = finalizado`;
- `counts_for_standings = true`;
- com placar completo;
- entre equipes do mesmo grupo quando os grupos estiverem definidos.

## 13. Fuso horário

O projeto usa explicitamente:

```text
America/Sao_Paulo
```

Datas são armazenadas como `timestamptz` no Supabase, mas os formulários e a exibição são tratados como horário de Brasília para evitar alteração indevida de horário conforme o computador usado no admin.

## 14. Segurança

O frontend usa apenas:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Nunca exponha:

- `service_role`;
- senha do banco;
- tokens privados.

A leitura das informações públicas é permitida para visitantes.

Inserção, alteração e exclusão exigem simultaneamente:

1. usuário autenticado;
2. usuário presente em `public.admin_users`.

A mesma regra é aplicada aos três buckets do Storage.

## 15. Deploy no GitHub e Netlify

Suba a pasta para um repositório GitHub.

Na Netlify:

1. **Add new site → Import an existing project**;
2. conecte o GitHub;
3. escolha o repositório;
4. o `netlify.toml` já define:
   - build: `npm run build`;
   - publish: `dist`;
   - redirect para SPA.
5. em **Environment variables**, cadastre:
   - `VITE_SUPABASE_URL`;
   - `VITE_SUPABASE_ANON_KEY`.
6. faça o deploy.

## 16. Estrutura

```text
decreto-fc/
├── public/
│   ├── decreto-logo.png
│   ├── decreto-logo.webp
│   └── mascote-decreto.webp
├── src/
│   ├── admin/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
├── netlify.toml
├── package.json
└── README.md
```

## 17. Checklist antes de publicar

- [ ] Criar projeto Supabase
- [ ] Executar `supabase/schema.sql`
- [ ] Criar usuário em Authentication
- [ ] Inserir o usuário em `public.admin_users`
- [ ] Preencher `.env`
- [ ] Rodar o site localmente
- [ ] Testar login `/admin`
- [ ] Cadastrar os seis times reais
- [ ] Confirmar grupos
- [ ] Cadastrar elenco e comissão
- [ ] Cadastrar jogos da fase de grupos com `Contabilizar na classificação` marcado
- [ ] Conferir classificação após um resultado de teste
- [ ] Conferir artilharia após um resultado do Decreto
- [ ] Testar cadastro/edição/exclusão de patrocinadores
- [ ] Testar o painel no celular
- [ ] Rodar `npm run build`
- [ ] Subir no GitHub
- [ ] Configurar variáveis na Netlify
- [ ] Fazer deploy
- [ ] Conferir `/admin` diretamente na URL publicada

## 18. Observação sobre evolução futura

A versão atual é focada na Copa Verão 2026, mas `phase` e `counts_for_standings` já evitam que a fase eliminatória contamine a tabela.

Para uma expansão posterior para várias temporadas/competições simultâneas, o próximo passo arquitetural recomendado é criar entidades `competitions` e `seasons` e relacionar times/partidas a elas.

---

## V3 — Direção de arte Decreto FC

A V3 preserva toda a estrutura técnica da V2 e concentra as mudanças no frontend público. Entre as principais melhorias estão Hero cinematográfico, barra de status da Copa, match poster do próximo jogo, último placar em destaque, classificação sem rolagem horizontal, elenco sem duplicação aparente, timeline da campanha, destaque do artilheiro e timeline 2017 → 2026.

Para detalhes, consulte `REVISAO_V3.md`.

Se você já configurou o Supabase usando a V2, **não execute novamente o `schema.sql` nem o `seed.sql` apenas por causa da V3**. Mantenha o mesmo projeto Supabase e copie seu `.env` para esta versão.
