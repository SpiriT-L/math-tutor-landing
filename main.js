/* ============================================================
   1. ШАПКА ПРИ СКРОЛЛЕ
   ============================================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ============================================================
   2. МОБИЛЬНОЕ МЕНЮ
   ============================================================ */
const burger = document.getElementById('burger');
const navL   = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navL.classList.toggle('open');
});

navL.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('active');
    navL.classList.remove('open');
  });
});


/* ============================================================
   3. АККОРДЕОН FAQ
   ============================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');

  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});


/* ============================================================
   4. ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ
   ============================================================ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.07 + 's';
  io.observe(el);
});


/* ============================================================
   5. ФОРМА ЗАЯВКИ
   ------------------------------------------------------------
   Сейчас форма просто показывает сообщение об успехе.
   Чтобы заявки приходили вам, подключите один из вариантов:

   A) Formspree (бесплатно до 50 заявок/мес):
      <form action="https://formspree.io/f/ВАШ_ID" method="POST">
      и уберите e.preventDefault() ниже.

   B) Telegram-бот: создайте бота, получите token и chat_id,
      затем в обработчике сделайте fetch на:
      https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<ID>&text=...

   C) Google Sheets / свой backend.
   ============================================================ */
const form        = document.getElementById('leadForm');
const successBox  = document.getElementById('formSuccess');
const consentWrap = document.getElementById('consentWrap');

function setError(field, on) {
  field.closest('.field')?.classList.toggle('error', on);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name;
  const phone   = form.phone;
  const consent = form.consent;
  let valid = true;

  if (name.value.trim().length < 2) { setError(name, true); valid = false; }
  else setError(name, false);

  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10) { setError(phone, true); valid = false; }
  else setError(phone, false);

  consentWrap.classList.toggle('error', !consent.checked);
  if (!consent.checked) valid = false;

  if (!valid) return;

  showSuccess();
});

function showSuccess() {
  form.style.display = 'none';
  successBox.classList.add('show');
}

form.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.closest('.field')?.classList.remove('error');
    if (el.type === 'checkbox') consentWrap.classList.remove('error');
  });
});


/* ============================================================
   6. ПЛАВНЫЙ СКРОЛЛ С УЧЁТОМ ВЫСОТЫ ШАПКИ
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});