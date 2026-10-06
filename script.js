(function () {
  // ---------- Theme toggle (dark / light) ----------
  var root = document.documentElement;
  var stored = localStorage.getItem('widget-instruction-theme');
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var initial = stored || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('widget-instruction-theme', next);
    });
  }

  // ---------- Mobile top nav toggle ----------
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  // ---------- Off-canvas sidebar (instruction pages) ----------
  var sidebar = document.getElementById('sidebar');
  var tocToggle = document.getElementById('tocToggle');
  var sidebarClose = document.getElementById('sidebarClose');
  var overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  if (tocToggle) tocToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close mobile sidebar/nav after clicking a link
  document.querySelectorAll('.toc a, .main-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeSidebar();
      if (mainNav) mainNav.classList.remove('open');
    });
  });

  // ---------- Highlight current step in the TOC while scrolling ----------
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step[id]'));
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));

  if (steps.length && tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (link) {
      byId[link.getAttribute('href').replace('#', '')] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    steps.forEach(function (step) { observer.observe(step); });
  }

   // ---------- Method select (archive vs install link) ----------
  (function () {
    var methodSelect = document.getElementById('methodSelect');
    var methodContent = document.getElementById('methodContent');
    var methodChange = document.getElementById('methodChange');
    var cards = document.querySelectorAll('.method-card');
    var flows = document.querySelectorAll('.flow');

    if (!methodSelect || !methodContent) return;

    var storageKey = 'widget-instruction-method-' + (document.body.dataset.page || 'default');

    function showMethod(method) {
      methodSelect.hidden = true;
      methodContent.hidden = false;

      flows.forEach(function (flow) {
        flow.hidden = flow.dataset.flow !== method;
      });

      localStorage.setItem(storageKey, method);

      document.querySelectorAll('.toc[data-flow]').forEach(function (t) {
        t.hidden = t.dataset.flow !== method;
      });
    }

    function resetMethod() {
      methodSelect.hidden = false;
      methodContent.hidden = true;
      localStorage.removeItem(storageKey);
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        showMethod(card.dataset.method);
      });
    });

    if (methodChange) {
      methodChange.addEventListener('click', resetMethod);
    }

    var savedMethod = localStorage.getItem(storageKey);
    if (savedMethod) {
      showMethod(savedMethod);
    }
  })();
})();
