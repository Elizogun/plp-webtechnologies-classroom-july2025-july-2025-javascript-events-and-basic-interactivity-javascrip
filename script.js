/* script.js - Interactive features for Tech Newbie Diary */
/* Part 1: Event handling & setup */
document.addEventListener('DOMContentLoaded', function () {
  // Loading overlay removal
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    setTimeout(()=> overlay.remove(), 600);
  }

  // Theme toggle (persist in localStorage)
  const themeToggle = document.querySelectorAll('.theme-toggle');
  function applyTheme(theme) {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }
  const savedTheme = localStorage.getItem('tnd-theme') || 'light';
  applyTheme(savedTheme);
  themeToggle.forEach(btn => btn && btn.addEventListener('click', () => {
    const useDark = document.body.classList.toggle('dark');
    localStorage.setItem('tnd-theme', useDark ? 'dark' : 'light');
  }));

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) backToTop.style.display = 'block';
      else backToTop.style.display = 'none';
    });
    backToTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  // Navigation highlight on click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', ()=> {
      document.querySelectorAll('.nav-links a').forEach(l=> l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* Part 2: Interactive features */

  // Tabs: Featured topics (present on index)
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('[data-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabTarget;
      tabButtons.forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => {
        if (panel.dataset.tab === target) panel.classList.add('active');
        else panel.classList.remove('active');
      });
    });
  });

  // Make first tab active by default if present
  if (tabButtons.length) tabButtons[0].click();

  // Collapsible FAQ
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      if (!answer) return;
      answer.classList.toggle('open');
      q.querySelector('.faq-toggle').textContent = answer.classList.contains('open') ? '−' : '+';
    });
  });

  // Collapsible support for multiple pages where FAQs exist
  document.querySelectorAll('.collapsible-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const target = document.querySelector(btn.dataset.target);
      if (target) target.classList.toggle('open');
    });
  });

  // Small interactive counter game (example interactive feature)
  const counterBtn = document.getElementById('counter-btn');
  const counterDisplay = document.getElementById('counter-display');
  if (counterBtn && counterDisplay) {
    let count = 0;
    counterBtn.addEventListener('click', ()=> {
      count += 1;
      counterDisplay.textContent = count;
      if (count % 5 === 0) {
        counterDisplay.classList.add('milestone');
        setTimeout(()=> counterDisplay.classList.remove('milestone'), 800);
      }
    });
  }

  /* Part 3: Form validation (Join the Diary) */
  const forms = document.querySelectorAll('#join-form');
  forms.forEach(form => {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const pwdInput = form.querySelector('input[name="password"]');
    const msgBox = form.querySelector('.form-message');

    // helper validators
    function validateName(name) {
      return /^[A-Za-z\s]{2,40}$/.test(name.trim());
    }
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }
    function validatePassword(pwd) {
      return /^(?=.*\d).{6,}$/.test(pwd);
    }

    function showError(input, msg) {
      let err = input.parentElement.querySelector('.error');
      if (!err) {
        err = document.createElement('div'); err.className = 'error';
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute('aria-invalid','true');
    }
    function clearError(input) {
      const err = input.parentElement.querySelector('.error');
      if (err) err.remove();
      input.removeAttribute('aria-invalid');
    }

    // real-time validation on input
    [nameInput, emailInput, pwdInput].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('input', ()=> {
        clearError(inp);
        if (inp === nameInput && !validateName(inp.value)) {
          showError(inp, 'Name should be 2–40 letters and spaces only.');
        }
        if (inp === emailInput && !validateEmail(inp.value)) {
          showError(inp, 'Please enter a valid email address.');
        }
        if (inp === pwdInput && !validatePassword(inp.value)) {
          showError(inp, 'Password must be at least 6 chars and include a number.');
        }
      });
    });

    form.addEventListener('submit', (e)=> {
      e.preventDefault();
      // clear prior messages
      [nameInput, emailInput, pwdInput].forEach(i=> i && clearError(i));
      if (msgBox) msgBox.textContent = '';

      let valid = true;
      if (!nameInput || !validateName(nameInput.value)) { if (nameInput) showError(nameInput, 'Name should be 2–40 letters and spaces only.'); valid = false; }
      if (!emailInput || !validateEmail(emailInput.value)) { if (emailInput) showError(emailInput, 'Please enter a valid email address.'); valid = false; }
      if (!pwdInput || !validatePassword(pwdInput.value)) { if (pwdInput) showError(pwdInput, 'Password must be at least 6 chars and include a number.'); valid = false; }

      if (!valid) return;

      // On success show inline thank-you message without redirect
      const username = (nameInput && nameInput.value.trim().split(' ')[0]) || 'Friend';
      if (msgBox) {
        msgBox.innerHTML = '<div class="success">Thank you, ' + username + '! You\'ve joined the Tech Newbie Diary</div>';
      }
      form.reset();
    });
  });

  /* Extra: small UX helpers */
  document.querySelectorAll('.card').forEach(c=>{
    c.addEventListener('mouseenter', ()=> c.style.transform = 'translateY(-4px)');
    c.addEventListener('mouseleave', ()=> c.style.transform = 'translateY(0)');
  });

});
