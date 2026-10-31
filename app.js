const chat = document.getElementById('chat');
const choices = document.getElementById('choices');
const answers = {};
let step = 0;

function addMessage(text, who='bot') {
  const el = document.createElement('div');
  el.className = 'message ' + who;
  el.textContent = text;
  chat.insertBefore(el, choices);
}
function showChoices(items) {
  choices.innerHTML = '';
  items.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item;
    button.addEventListener('click', () => choose(item));
    choices.appendChild(button);
  });
}
function askText(question, key, placeholder='Deine Antwort …', optional=false) {
  addMessage(question);
  choices.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'chat-input';
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  input.required = !optional;
  const send = document.createElement('button');
  send.textContent = optional ? 'Weiter' : 'Senden';
  send.type = 'submit';
  form.append(input, send);
  choices.appendChild(form);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value && !optional) return;
    answers[key] = value || 'Keine Angabe';
    addMessage(value || 'Keine Angabe', 'user');
    next();
  });
  input.focus();
}
function choose(value) {
  answers.type = value;
  addMessage(value, 'user');
  next();
}
function next() {
  step++;
  if (step === 1) return askText('Was genau soll gemacht werden? Beschreibe dein Vorhaben kurz.', 'task', 'z. B. Möbel aufbauen, Wand ausbessern …');
  if (step === 2) return askText('In welchem Ort befindet sich das Objekt?', 'place', 'Ort oder Postleitzahl');
  if (step === 3) return askText('Wann soll die Arbeit ungefähr stattfinden?', 'when', 'z. B. möglichst bald oder im November', true);
  if (step === 4) return askText('Gibt es noch wichtige Details oder Besonderheiten?', 'details', 'Weitere Hinweise (optional)', true);
  if (step === 5) return askText('Wie dürfen wir dich erreichen? Bitte gib deinen Namen und eine Telefonnummer oder E-Mail-Adresse an.', 'contact', 'Name und Kontaktmöglichkeit');
  finish();
}
function finish() {
  addMessage('Danke! Hier ist deine Zusammenfassung. Du kannst sie kopieren und anschließend über deinen bevorzugten Kontaktweg versenden.');
  choices.innerHTML = '';
  const summary = [
    'Anfrage – Objektservice Bayern',
    'Bereich: ' + answers.type,
    'Vorhaben: ' + answers.task,
    'Ort: ' + answers.place,
    'Zeitwunsch: ' + answers.when,
    'Weitere Details: ' + answers.details,
    'Kontakt: ' + answers.contact
  ].join('\n');
  const pre = document.createElement('pre');
  pre.style.cssText = 'white-space:pre-wrap;font:11px/1.7 DM Sans;background:white;border:1px solid #dfe6da;border-radius:8px;padding:14px;color:#33483a;margin:10px 0';
  pre.textContent = summary;
  choices.appendChild(pre);
  const copy = document.createElement('button');
  copy.textContent = 'Anfrage kopieren';
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(summary); copy.textContent = 'Kopiert ✓'; }
    catch { copy.textContent = 'Bitte Text markieren und kopieren'; }
  });
  choices.appendChild(copy);
  const restart = document.createElement('button');
  restart.textContent = 'Neue Anfrage starten';
  restart.style.marginLeft = '7px';
  restart.addEventListener('click', () => location.reload());
  choices.appendChild(restart);
}
