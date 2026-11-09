# Bíblia Sagrada NFC

Página web estática para um chaveiro NFC. Ao abrir o link, a página carrega um versículo aleatório de toda a Bíblia em português, usando a tradução Almeida 1911.

## Arquivos

- `index.html`: estrutura da página e metadados para compartilhamento.
- `styles.css`: identidade visual escura, dourada e responsiva.
- `app.js`: carregamento, sorteio sem repetição consecutiva e compartilhamento pelo WhatsApp.
- `manifest.webmanifest`: permite salvar a página como atalho na tela inicial do celular.
- `data/alm1911.json`: base local completa com 66 livros, 1.189 capítulos e 31.101 versículos.
- `assets/kenon-print-logo.jpg`: assinatura visual otimizada da loja Kenon Print.
- `logo.svg`: marca usada como favicon e ícone do projeto.
- `netlify.toml`: configuração de publicação como site estático.

## Publicação no Netlify

1. Crie um novo site no Netlify a partir deste repositório ou arraste a pasta do projeto para o Netlify Drop.
2. Não informe comando de build. Se precisar preencher, use `true`.
3. Use a raiz do projeto como diretório de publicação.
4. Copie a URL pública gerada pelo Netlify.
5. Grave essa URL no registro da etiqueta NFC. O celular abrirá o navegador automaticamente ao aproximar-se do chaveiro.

A página não possui login, cadastro, painel, aplicativo nativo ou API externa. A base bíblica fica junto dos arquivos estáticos, o sorteio acontece no navegador e a pesquisa consulta todos os versículos localmente.

## Pesquisa e modo aplicativo

Além de receber uma palavra automaticamente, a pessoa pode tocar em **Pesquisar**, consultar palavras como `amor`, livros como `Salmos` ou referências como `João 3:16`, e tocar em qualquer resultado para exibi-lo em destaque. Em celulares compatíveis, também é possível usar a opção do navegador para adicionar a página à tela inicial; o manifesto já está incluído para deixar a experiência mais parecida com um aplicativo.

A assinatura da Kenon Print aparece de forma discreta no rodapé, preservando a Bíblia Sagrada como foco principal da experiência do comprador.

## Fonte da tradução

O arquivo local é a versão `ALM1911` publicada pelo repositório [damarals/biblias](https://github.com/damarals/biblias). O catálogo identifica a Almeida 1911, ano 1911, como domínio público e o repositório é distribuído sob licença MIT. Consulte a fonte e a legislação aplicável antes de redistribuir comercialmente.

Fonte do arquivo: `https://github.com/damarals/biblias/releases/latest/download/ALM1911.json`
