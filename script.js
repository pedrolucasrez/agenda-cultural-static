// Agenda Cultural: dados, filtro, busca, favoritos, calendário (.ics) e contagem regressiva.
(() => {
  "use strict";

  // Todos os eventos e locais são fictícios.
  const EVENTOS = [
    { id: "choro", cat: "musica", nome: "Noite de choro no quintal", local: "Quintal da Vila", data: [2026, 11, 6, 20, 0], preco: "R$ 30", desc: "Roda de choro com cavaquinho, violão de sete cordas e pandeiro. Traga o seu banquinho: o quintal é pequeno e a roda é grande." },
    { id: "livros", cat: "feira", nome: "Feira de livros usados", local: "Praça das Mangueiras", data: [2026, 11, 8, 10, 0], preco: "Grátis", desc: "Mais de trinta bancas com livros a partir de R$ 5. Quem levar um livro para trocar ganha desconto na primeira compra." },
    { id: "onibus", cat: "teatro", nome: "O último ônibus", local: "Teatro da Esquina", data: [2026, 11, 13, 19, 30], preco: "R$ 40", desc: "Comédia dramática sobre seis passageiros presos no mesmo ponto numa noite de chuva. Duração de 80 minutos, sem intervalo." },
    { id: "curtas", cat: "cinema", nome: "Cine clube: curtas mineiros", local: "Cine Galpão", data: [2026, 11, 14, 21, 0], preco: "R$ 12", desc: "Sete curtas-metragens de diretores locais, seguidos de conversa com parte da equipe. Classificação de 12 anos." },
    { id: "retratos", cat: "exposicao", nome: "Retratos da rua", local: "Galeria Subsolo", data: [2026, 11, 20, 9, 0], preco: "Grátis", desc: "Fotografias em preto e branco de moradores do centro, de segunda a sábado, das 9h às 18h. A mostra fica aberta até 20 de dezembro." },
    { id: "samba", cat: "musica", nome: "Baile do samba-rock", local: "Clube Aurora", data: [2026, 11, 21, 22, 0], preco: "R$ 50", desc: "Banda de nove integrantes e DJ na pista até de madrugada. Aulas rápidas de passo básico às 21h, para quem quiser chegar mais cedo." },
    { id: "danca", cat: "teatro", nome: "Mostra de dança contemporânea", local: "Teatro da Esquina", data: [2026, 11, 27, 19, 0], preco: "R$ 25", desc: "Quatro companhias da região apresentam trabalhos curtos de 15 minutos. Ingresso único para a noite toda." },
    { id: "artesanato", cat: "feira", nome: "Feira de artesanato e sabores", local: "Praça das Mangueiras", data: [2026, 11, 29, 14, 0], preco: "Grátis", desc: "Cerâmica, tecelagem, doces e queijos de produtores locais. Há área coberta para o caso de chuva." },
    { id: "orquestra", cat: "musica", nome: "Orquestra jovem convida", local: "Teatro da Esquina", data: [2026, 12, 4, 20, 0], preco: "R$ 25", desc: "A orquestra jovem recebe convidados para um programa de trilhas de cinema, com regência de alunos do último ano." },
    { id: "silencioso", cat: "cinema", nome: "Cinema silencioso com piano ao vivo", local: "Cine Galpão", data: [2026, 12, 5, 18, 0], preco: "R$ 20", desc: "Dois filmes clássicos da era muda, acompanhados por improviso de piano. A sessão dura cerca de 100 minutos." },
    { id: "lambe", cat: "oficina", nome: "Oficina de lambe-lambe", local: "Galeria Subsolo", data: [2026, 12, 12, 10, 0], preco: "R$ 60", desc: "Aprenda a criar, imprimir e colar cartazes. Material incluso, 20 vagas. Cada participante leva seus cartazes para casa." },
    { id: "encerramento", cat: "musica", nome: "Festa de encerramento com Cerrado Neon", local: "Clube Aurora", data: [2026, 12, 19, 21, 0], preco: "R$ 45", desc: "A banda Cerrado Neon fecha a temporada com repertório próprio e participações especiais. Pista aberta e bar no local." }
  ].map(e => ({ ...e, quando: new Date(...[e.data[0], e.data[1] - 1, e.data[2], e.data[3], e.data[4]]) }))
   .sort((a, b) => a.quando - b.quando);

  const CATEGORIAS = { musica: "Música", teatro: "Teatro", cinema: "Cinema", exposicao: "Exposição", feira: "Feira", oficina: "Oficina" };
  const $ = (s, r = document) => r.querySelector(s);
  const mural = $("#mural"), contagem = $("#contagem"), vazio = $("#vazio");
  const dlg = $("#detalhe");
  const pad = n => String(n).padStart(2, "0");
  const normaliza = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const esc = t => t.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hora = d => `${d.getHours()}h${pad(d.getMinutes())}`;
  const mesCurto = d => d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  const diaSemana = d => d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");

  let categoria = "todos";
  let termo = "";
  let favoritos = new Set();
  try { favoritos = new Set(JSON.parse(localStorage.getItem("agenda:fav") || "[]")); } catch (_) { /* sem armazenamento */ }
  const salvar = () => { try { localStorage.setItem("agenda:fav", JSON.stringify([...favoritos])); } catch (_) {} };

  // Renderização do mural
  function renderizar() {
    const lista = EVENTOS.filter(e =>
      (categoria === "todos" || e.cat === categoria) &&
      normaliza(`${e.nome} ${e.local}`).includes(normaliza(termo.trim()))
    );
    mural.innerHTML = lista.map((e, i) => `
      <li style="--i:${i}">
        <article class="cartaz" data-cat="${e.cat}" data-id="${e.id}" data-marcado="${favoritos.has(e.id)}">
          <div class="data">
            <b class="dia">${pad(e.quando.getDate())}</b>
            <span class="mes">${mesCurto(e.quando)}<br>${diaSemana(e.quando)}</span>
          </div>
          <h3 class="nome">${esc(e.nome)}</h3>
          <p class="onde">${esc(e.local)}</p>
          <p class="quando">${hora(e.quando)}, ${CATEGORIAS[e.cat]}</p>
          <div class="acoes">
            <span class="preco">${e.preco}</span>
            <button class="quero" aria-pressed="${favoritos.has(e.id)}">${favoritos.has(e.id) ? "Marcado" : "Quero ir"}</button>
            <button class="ver">Detalhes</button>
          </div>
          <span class="carimbo" aria-hidden="true">Vou!</span>
        </article>
      </li>`).join("");
    vazio.hidden = lista.length > 0;
    contagem.textContent = lista.length === 1 ? "1 cartaz no muro" : `${lista.length} cartazes no muro`;
  }

  function atualizaBarra() {
    const n = favoritos.size;
    $("#barraFav").hidden = n === 0;
    $("#nFav").textContent = n;
    $("#txtFav").textContent = n === 1 ? "evento marcado" : "eventos marcados";
  }

  function alternar(id) {
    favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
    salvar();
    const art = mural.querySelector(`[data-id="${id}"]`);
    if (art) {
      const on = favoritos.has(id);
      art.dataset.marcado = on;
      const b = art.querySelector(".quero");
      b.setAttribute("aria-pressed", on);
      b.textContent = on ? "Marcado" : "Quero ir";
    }
    atualizaBarra();
  }

  // Calendário (.ics)
  const icsData = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const icsTexto = t => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  function baixarIcs(eventos, arquivo) {
    const agora = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const linhas = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Agenda Cultural//PT-BR//", "CALSCALE:GREGORIAN"];
    eventos.forEach(e => {
      const fim = new Date(e.quando.getTime() + 2 * 3600 * 1000);
      linhas.push("BEGIN:VEVENT", `UID:${e.id}@agenda-cultural`, `DTSTAMP:${agora}`,
        `DTSTART:${icsData(e.quando)}`, `DTEND:${icsData(fim)}`,
        `SUMMARY:${icsTexto(e.nome)}`, `LOCATION:${icsTexto(e.local)}`, `DESCRIPTION:${icsTexto(e.desc)}`, "END:VEVENT");
    });
    linhas.push("END:VCALENDAR");
    const blob = new Blob([linhas.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = arquivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // Janela de detalhes
  function abrirDetalhe(id) {
    const e = EVENTOS.find(x => x.id === id);
    const data = e.quando.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    dlg.innerHTML = `
      <h2 id="dTitulo">${esc(e.nome)}</h2>
      <p class="quando-d">${data}, às ${hora(e.quando)}. ${esc(e.local)}. ${e.preco}.</p>
      <p>${esc(e.desc)}</p>
      <div class="d-botoes">
        <button data-acao="ics">Adicionar ao calendário</button>
        <button data-acao="marcar">${favoritos.has(e.id) ? "Desmarcar" : "Quero ir"}</button>
        <button class="sec" data-acao="fechar">Fechar</button>
      </div>`;
    dlg.dataset.id = id;
    dlg.showModal();
  }

  mural.addEventListener("click", ev => {
    const art = ev.target.closest(".cartaz");
    if (!art) return;
    if (ev.target.closest(".quero")) alternar(art.dataset.id);
    else if (ev.target.closest(".ver")) abrirDetalhe(art.dataset.id);
  });

  dlg.addEventListener("click", ev => {
    const acao = ev.target.dataset.acao;
    const id = dlg.dataset.id;
    if (ev.target === dlg || acao === "fechar") dlg.close();
    if (acao === "ics") baixarIcs([EVENTOS.find(x => x.id === id)], `${id}.ics`);
    if (acao === "marcar") { alternar(id); dlg.close(); }
  });

  // Filtros e busca
  $("#fitas").addEventListener("click", ev => {
    const b = ev.target.closest(".fita");
    if (!b) return;
    categoria = b.dataset.cat;
    document.querySelectorAll(".fita").forEach(f => f.setAttribute("aria-pressed", f === b));
    renderizar();
  });
  $("#busca").addEventListener("input", ev => { termo = ev.target.value; renderizar(); });

  $("#baixarTodos").addEventListener("click", () => baixarIcs(EVENTOS.filter(e => favoritos.has(e.id)), "agenda-cultural.ics"));
  $("#limpar").addEventListener("click", () => {
    favoritos.clear(); salvar(); renderizar(); atualizaBarra();
  });

  // Próximo evento e contagem regressiva
  function atualizaProximo() {
    const box = $("#proximo");
    const agora = new Date();
    const prox = EVENTOS.find(e => e.quando > agora);
    if (!prox) {
      box.innerHTML = `<p class="rotulo">A temporada terminou</p><p class="nome">Volte em breve</p>`;
      return;
    }
    const ms = prox.quando - agora;
    const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
    box.innerHTML = `
      <p class="rotulo">Próximo evento</p>
      <p class="nome">${esc(prox.nome)}</p>
      <p class="tempo">${d}<small>dias</small>${pad(h)}<small>h</small>${pad(m)}<small>min</small>${pad(s)}<small>s</small></p>`;
  }

  // Menu no celular
  const menuBtn = $("#menuBtn"), menu = $("#menu");
  menuBtn.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    menuBtn.setAttribute("aria-expanded", aberto);
  });
  menu.addEventListener("click", ev => {
    if (ev.target.tagName === "A") { menu.classList.remove("aberto"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  // Formulário (simulado: o site é estático e não envia e-mails)
  $("#form").addEventListener("submit", ev => {
    ev.preventDefault();
    const campo = $("#email"), msg = $("#msg");
    const valor = campo.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    campo.setAttribute("aria-invalid", !ok);
    msg.classList.toggle("erro", !ok);
    msg.textContent = !valor
      ? "Digite o seu e-mail para receber a agenda."
      : ok
        ? "Cadastro simulado: este site é estático e não envia e-mails."
        : "Esse e-mail parece incompleto. Confira o @ e o domínio, como em voce@exemplo.com.";
    if (ok) campo.value = "";
  });

  renderizar();
  atualizaBarra();
  atualizaProximo();
  setInterval(atualizaProximo, 1000);
})();
