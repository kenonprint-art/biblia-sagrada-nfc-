const DATA_URL = './data/alm1911.json';
const STORAGE_KEY = 'biblia-nfc-last-verse';

const state = {
  verses: [],
  current: null,
  lastId: null,
  toastTimer: null,
};

const elements = {
  area: document.querySelector('.word-area'),
  card: document.querySelector('#verse-card'),
  reference: document.querySelector('#reference'),
  verseText: document.querySelector('#verse-text'),
  count: document.querySelector('#verse-count'),
  newVerse: document.querySelector('#new-verse'),
  share: document.querySelector('#share-whatsapp'),
  toast: document.querySelector('#toast'),
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  searchMeta: document.querySelector('#search-meta'),
  searchResults: document.querySelector('#search-results'),
};

const escapeText = (value) => String(value ?? '').trim();

function normalize(value) {
  return escapeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function flattenBible(books) {
  return books.flatMap((book, bookIndex) =>
    book.chapters.flatMap((chapter, chapterIndex) =>
      chapter.map((text, verseIndex) => ({
        id: `${bookIndex + 1}-${chapterIndex + 1}-${verseIndex + 1}`,
        book: book.name,
        chapter: chapterIndex + 1,
        verse: verseIndex + 1,
        text: escapeText(text),
      })),
    ),
  ).filter((verse) => verse.text.length > 0);
}

function getSavedLastId() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLastId(id) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // A sessão pode bloquear storage; o sorteio continua normalmente.
  }
}

function pickVerse() {
  if (!state.verses.length) return null;
  if (state.verses.length === 1) return state.verses[0];

  let picked;
  do {
    picked = state.verses[Math.floor(Math.random() * state.verses.length)];
  } while (picked.id === state.lastId);

  state.lastId = picked.id;
  saveLastId(picked.id);
  return picked;
}

function formatVerse(verse) {
  return `${verse.book} ${verse.chapter}:${verse.verse} — ${verse.text}`;
}

function highlight(text, query) {
  const words = query.trim().split(/\s+/).filter((word) => word.length > 1);
  if (!words.length) return text;
  const expression = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return text.replace(new RegExp(`(${expression})`, 'gi'), '<mark>$1</mark>');
}

function renderSearchResults(results, query) {
  elements.searchResults.replaceChildren();
  if (!results.length) {
    elements.searchMeta.textContent = 'Nenhum resultado encontrado. Tente outra palavra ou referência.';
    return;
  }

  elements.searchMeta.textContent = `${results.length} resultado${results.length === 1 ? '' : 's'} encontrado${results.length === 1 ? '' : 's'}.`;
  results.forEach((verse) => {
    const result = document.createElement('button');
    result.type = 'button';
    result.className = 'search-result';
    result.innerHTML = `<span class="result-reference">${verse.book} ${verse.chapter}:${verse.verse}</span><span class="result-text">${highlight(verse.text, query)}</span><span class="result-arrow">→</span>`;
    result.addEventListener('click', () => {
      renderVerse(verse);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`${verse.book} ${verse.chapter}:${verse.verse} selecionado.`);
    });
    elements.searchResults.append(result);
  });
}

function searchBible(event) {
  event.preventDefault();
  const query = escapeText(elements.searchInput.value);
  if (!query) {
    elements.searchMeta.textContent = 'Digite uma palavra, livro ou referência para pesquisar.';
    elements.searchResults.replaceChildren();
    elements.searchInput.focus();
    return;
  }

  const normalizedQuery = normalize(query);
  const results = state.verses.filter((verse) => {
    const reference = normalize(`${verse.book} ${verse.chapter}:${verse.verse}`);
    return normalize(verse.text).includes(normalizedQuery) || reference.includes(normalizedQuery);
  }).slice(0, 30);
  renderSearchResults(results, query);
}

function renderVerse(verse) {
  if (!verse) return;
  state.current = verse;
  elements.reference.textContent = `${verse.book} ${verse.chapter}:${verse.verse}`;
  elements.verseText.textContent = verse.text;
  elements.count.textContent = `${state.verses.length.toLocaleString('pt-BR')} VERSÍCULOS DISPONÍVEIS`;
  elements.area.setAttribute('aria-busy', 'false');
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

function setLoading(isLoading) {
  elements.newVerse.disabled = isLoading;
  elements.share.disabled = isLoading;
  elements.card.classList.toggle('is-changing', isLoading);
}

async function loadBible() {
  try {
    const response = await fetch(DATA_URL, { cache: 'default' });
    if (!response.ok) throw new Error(`Falha ao carregar a Bíblia (${response.status})`);
    const books = await response.json();
    state.verses = flattenBible(books);
    state.lastId = getSavedLastId();
    renderVerse(pickVerse());
  } catch (error) {
    console.error(error);
    elements.area.setAttribute('aria-busy', 'false');
    elements.reference.textContent = 'Não foi possível carregar agora';
    elements.verseText.textContent = 'Verifique sua conexão e tente abrir o chaveiro novamente.';
    elements.count.textContent = 'BASE LOCAL INDISPONÍVEL';
    showToast('Tente novamente em instantes.');
  }
}

async function nextVerse() {
  if (!state.verses.length || elements.newVerse.disabled) return;
  setLoading(true);
  await new Promise((resolve) => window.setTimeout(resolve, 160));
  renderVerse(pickVerse());
  setLoading(false);
}

function shareOnWhatsApp() {
  if (!state.current) {
    showToast('Aguarde a palavra carregar.');
    return;
  }
  const message = `“${state.current.text}”\n\n${state.current.book} ${state.current.chapter}:${state.current.verse}\nAlmeida 1911 · Bíblia Sagrada NFC`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

elements.newVerse.addEventListener('click', nextVerse);
elements.share.addEventListener('click', shareOnWhatsApp);
elements.searchForm.addEventListener('submit', searchBible);
loadBible();
