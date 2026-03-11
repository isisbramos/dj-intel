const BASE = "https://api.scrapecreators.com";

export async function searchIG(query, key) {
      const r = await fetch(
              `${BASE}/v1/instagram/reels/search?keyword=${encodeURIComponent(query)}`,
          { headers: { "x-api-key": key } }
            );
      if (!r.ok) throw new Error(`IG HTTP ${r.status}`);
      return r.json();
}

export async function searchYT(query, key) {
      const r = await fetch(
              `${BASE}/v1/youtube/search?query=${encodeURIComponent(query)}`,
          { headers: { "x-api-key": key } }
            );
      if (!r.ok) throw new Error(`YT HTTP ${r.status}`);
      return r.json();
}

export async function analyzeWithClaude(artistLabel, niche, listType, listMeta, djs, data) {
      const r = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [{
                                    role: "user",
                                    content: `Você é um analista de inteligência de mercado para uma agência de management de DJs eletrônicos no Brasil.

                                    ARTISTA ANALISADO: ${artistLabel} | Nicho: ${niche}
                                    TIPO DE ANÁLISE: ${listMeta.label} — ${listMeta.desc}
                                    DJs MONITORADOS: ${djs.map(d => d.name).join(", ")}

                                    DADOS COLETADOS (real-time scraping):
                                    ${JSON.stringify(data, null, 2)}

                                    Gere um relatório de inteligência em PT-BR com EXATAMENTE estas seções:

                                    ## ${listMeta.emoji} Sinais de Conteúdo
                                    Quais tipos de posts/reels/vídeos estão dominando? Formatos, durações, abordagens.

                                    ## 🎵 Sonoridade em Alta
                                    Tracks, sets, estilos que aparecem mais. Seja específico.

                                    ## 📐 Padrões de Engajamento
                                    O que está gerando mais resultado? Padrões que se repetem.

                                    ## 🪞 Comparativo para ${artistLabel}
                                    O que esses DJs estão fazendo que ${artistLabel} pode aprender ou se diferenciar?

                                    ## ⚡ 3 Ações Recomendadas
                                    Concretas, priorizadas, específicas para ${artistLabel}.

                                    Cite dados reais (nomes, view counts, títulos) quando encontrar nos resultados.`,
                        }],
              }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message || d.error);
      return d.choices[0].message.content;
}
