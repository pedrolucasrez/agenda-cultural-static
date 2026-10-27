# Agenda Cultural

Site estático com a agenda de eventos culturais de uma cidade fictícia: música, teatro, cinema, exposições, feiras e oficinas. O visual imita um muro de cartazes lambe-lambe.

O projeto foi criado como estudo de caso do trabalho **"GitHub e colaboração em projetos: estudo de caso de uma equipe de quatro desenvolvedores"**, da disciplina Tecnologias para a Internet I (Sistemas de Informação, Uniube). Ele serve de exemplo prático de controle de versão com Git e GitHub, com branches, pull requests, revisão de código, conflito de merge e publicação com GitHub Pages.

> Todos os eventos, locais e nomes de bandas são fictícios.

## Site publicado

https://pedrolucasrez.github.io/agenda-cultural-static/

O site é publicado pelo GitHub Pages a partir da branch `main`, pasta raiz. Só o que foi revisado e integrado na `main` chega ao ar.

## Funcionalidades

- **Mural de cartazes:** cada evento é um cartaz com cor própria por categoria.
- **Filtro por categoria:** Música, Teatro, Cinema, Exposição, Feira e Oficina.
- **Busca** por nome do evento ou local, sem diferenciar maiúsculas, minúsculas e acentos.
- **"Quero ir":** marca o evento e guarda a escolha no navegador (`localStorage`), que continua após recarregar a página.
- **Calendário:** baixa um arquivo `.ics` com os eventos marcados ou com um evento só. O arquivo abre no Google Agenda, no Outlook e no calendário do celular.
- **Janela de detalhes** de cada evento, feita com o elemento `<dialog>`.
- **Próximo evento** com contagem regressiva em tempo real.
- **Menu responsivo** para telas pequenas.
- **Formulário de e-mail** com validação e mensagens de erro. O envio é simulado, porque um site estático não tem backend.
- Acessibilidade básica: foco visível no teclado, link para pular ao conteúdo, rótulos para leitores de tela e respeito à preferência de movimento reduzido.

## Tecnologias

- HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build
- Fontes Big Shoulders Display e Bricolage Grotesque, carregadas pelo Google Fonts
- GitHub Pages para a hospedagem

## Estrutura do projeto

```
agenda-cultural-static/
├── index.html   estrutura da página
├── style.css    visual, cores, layout e responsividade
├── script.js    dados dos eventos e comportamento da página
└── README.md    este arquivo
```

## Como rodar localmente

Não há nada para instalar.

```bash
git clone https://github.com/pedrolucasrez/agenda-cultural-static.git
cd agenda-cultural-static
```

Depois, abra o `index.html` no navegador. Para simular melhor o ambiente do GitHub Pages, também dá para usar um servidor local:

```bash
python -m http.server 8000
```

E acessar `http://localhost:8000`.

## Como editar os eventos

Os eventos ficam na lista `EVENTOS` no início do `script.js`. Cada um tem este formato:

```js
{
  id: "choro",
  cat: "musica",              // musica, teatro, cinema, exposicao, feira ou oficina
  nome: "Noite de choro no quintal",
  local: "Quintal da Vila",
  data: [2026, 11, 6, 20, 0], // ano, mês, dia, hora, minuto
  preco: "R$ 30",
  desc: "Descrição que aparece na janela de detalhes."
}
```

O campo `id` deve ser único e sem espaços. A lista é ordenada por data automaticamente.

## Como publicar no GitHub Pages

1. No repositório, abra **Settings > Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Aguarde um ou dois minutos. O endereço aparece no topo da mesma página.

O GitHub Pages só publica sites estáticos. Por isso este projeto não tem banco de dados nem servidor, e o formulário de e-mail é uma demonstração.

## Fluxo de colaboração

A equipe segue o **GitHub flow**: branch, alteração, pull request, revisão, merge e exclusão da branch.

1. A branch `main` guarda a versão estável do site. Ninguém altera a `main` diretamente.
2. Cada tarefa ganha uma branch própria, criada a partir da `main` atualizada.
3. Os commits são pequenos e têm mensagens claras.
4. A alteração só entra na `main` por um **pull request revisado por outra pessoa**.
5. Depois do merge, a branch da tarefa é excluída.

```bash
git checkout main
git pull origin main
git checkout -b estilo/menu-responsivo
# faça as alterações
git add .
git commit -m "Ajusta o menu para telas pequenas"
git push -u origin estilo/menu-responsivo
# abra o pull request no GitHub
```

### Nomes de branch

Use o padrão `area/descricao-curta`:

| Prefixo | Uso | Exemplo |
|---|---|---|
| `estrutura/` | HTML | `estrutura/secao-sobre` |
| `estilo/` | CSS | `estilo/menu-responsivo` |
| `js/` | JavaScript | `js/filtro-eventos` |
| `docs/` | documentação | `docs/readme` |
| `feature/` | funcionalidade que mistura áreas | `feature/pagina-inicial` |

### Mensagens de commit

Escreva no imperativo e explique a mudança, não o arquivo.

- Bom: `Corrige filtro que ignorava acentos na busca`
- Ruim: `alterações`, `final v3`, `corrigido`

### Revisão de código

Quem abre o pull request descreve o que mudou e por quê. Quem revisa lê o diff, testa a página e pede ajustes quando necessário. O merge só acontece depois da aprovação.

### Branch protegida

Recomenda-se proteger a `main` em **Settings > Branches > Add branch protection rule**, exigindo pull request e pelo menos uma aprovação antes do merge.

## Conflitos de merge

Um conflito acontece quando duas pessoas alteram a mesma linha em branches diferentes, e o Git não consegue decidir qual versão manter. O caso mais comum neste projeto é a linha do menu de navegação no `index.html`.

Para resolver:

1. Traga as alterações da `main` para a sua branch:
   ```bash
   git checkout estilo/menu-responsivo
   git pull origin main
   ```
2. Abra o arquivo com conflito e localize os marcadores:
   ```
   <<<<<<< HEAD
   <nav class="menu menu-responsivo">
   =======
   <nav class="menu-principal">
   >>>>>>> main
   ```
3. Converse com quem fez a outra alteração.
4. Deixe uma única versão com as duas mudanças e apague os marcadores:
   ```html
   <nav class="menu-principal menu-responsivo">
   ```
5. Registre e envie a resolução:
   ```bash
   git add index.html
   git commit -m "Resolve conflito na linha do menu"
   git push
   ```
6. O pull request é atualizado e revisado de novo antes do merge.

Para reduzir conflitos: mantenha branches curtas, divida as tarefas por arquivo ou área, atualize a branch antes de abrir o pull request e avise quem está mexendo no mesmo arquivo.

## Equipe

Trabalho da Universidade de Uberaba (Uniube), curso de Sistemas de Informação, disciplina Tecnologias para a Internet I, com orientação do professor Maxwell Gomes da Silva.

- Arthur Santos Garcia
- Augusto Melo Frias
- João Rodrigues Neto
- Lucas Hesse Martins
- Luiz Felipe Sousa Morais
- Pedro Lucas Rezende de Faria
- Rubens Marques da Silva Neto
- Tiago Beijo Lemes Monteiro Junior

No estudo de caso, a Equipe Horizonte é formada por quatro desenvolvedores fictícios: Ana coordena e revisa, Bruno cuida do HTML, Carla do CSS e Diego do JavaScript.

## Referências

- CHACON, Scott; STRAUB, Ben. *Pro Git*. 2. ed. Berkeley: Apress, 2014. Disponível em: https://git-scm.com/book/pt-br/v2.
- GITHUB. *About merge conflicts*. GitHub Docs, 2026. Disponível em: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts.
- GITHUB. *About pull requests*. GitHub Docs, 2026. Disponível em: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests.
- GITHUB. *GitHub flow*. GitHub Docs, 2026. Disponível em: https://docs.github.com/en/get-started/using-github/github-flow.
- GITHUB. *GitHub Pages documentation*. GitHub Docs, 2026. Disponível em: https://docs.github.com/en/pages.

## Licença

Projeto acadêmico, sem fins comerciais. Todos os eventos e personagens são fictícios.