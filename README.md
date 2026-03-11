# DJ Intel — Sabrina's Agency

Social trend intelligence dashboard para gestão de DJs.
Scraping em tempo real via ScrapeCreators + análise via Claude.

## Stack

- React 18 + Vite
- ScrapeCreators API (Instagram Reels + YouTube)
- Anthropic Claude Sonnet API

## Setup local

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`

## Deploy (Vercel)

1. Push este repo para o GitHub
2. Acesse vercel.com → New Project → importe o repo
3. Clique Deploy — Vercel detecta Vite automaticamente

## Como usar

1. Abra o app
2. Cole sua `SCRAPECREATORS_API_KEY` (fica salva no browser via localStorage)
3. Selecione o artista
4. Escolha o tipo de análise: Competitors / Similar Vibes / Worth Watching
5. Clique "Gerar Intel Report"

## Atualizar o roster

Edite `src/roster.js` — cada artista tem 3 listas com nome e motivo de monitoramento.

## Segurança

As API keys ficam salvas apenas no localStorage do browser do usuário.
Não passam por nenhum servidor intermediário.
