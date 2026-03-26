document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. Remove track pants from Women's slider ───────────────────────────
  var s = document.querySelector('#womensSlider');
  if (s) {
    Array.from(s.querySelectorAll('.card')).forEach(function (c) {
      var n = c.querySelector('h3,h4,[class*=name]');
      if (n && n.textContent.toLowerCase().includes('track pant')) c.remove();
    });
  }

  // ─── 2. Checkout button ───────────────────────────────────────────────────
  var btn = document.querySelector('.cart-checkout');
  if (btn) {
    btn.addEventListener('click', function () {
      localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart || []));
      window.location.href = 'checkout.html';
    });
  }

  // ─── 3. Price overrides ───────────────────────────────────────────────────
  var priceMap = {
    10: 98,  // Shadow Cargo
    11: 118, // Sakura Wide-Leg
    12: 77,  // Red Dragon Print
    13: 60,  // Hellfire Pants
    14: 75,  // Gold Dragon Jeans
    15: 70,  // Skull Cap Wide-Leg
    16: 65,  // Dual Dragon Baggy
    17: 62,  // One Piece Manga Jeans
    18: 68,  // Dark Horror Manga
    19: 59,  // JJK Cursed Wide-Leg
    20: 64,  // JJK Collage Jeans
    21: 70,  // Death Note Wide-Leg
    22: 65,  // Baki Red Kanji
    23: 67,  // Gojo Full-Leg Print
    24: 69,  // Gojo x Geto Jeans
    25: 70,  // Black Red JJK Jeans
    32: 77,  // Void Distressed Jeans
    33: 69,  // Dark Void Baggy
    34: 70   // Side Rip Wide-Leg
  };

  [window.MENS || [], window.WOMENS || []].forEach(function (arr) {
    arr.forEach(function (p) {
      if (priceMap[p.id] !== undefined) p.price = priceMap[p.id];
    });
  });

  document.querySelectorAll('.card,[class*=card]').forEach(function (card) {
    var pid = card.dataset && (card.dataset.pid || card.dataset.id);
    if (pid && priceMap[parseInt(pid)] !== undefined) {
      var priceEl = card.querySelector('[class*=price],[class*=Price]');
      if (priceEl) priceEl.textContent = '$' + priceMap[parseInt(pid)];
    }
  });

  // ─── 4. FIX: Desktop "Shop" dropdown — add hover buffer so it stays open ─
  // Pure CSS hover loses the dropdown when the mouse moves from the trigger
  // link to the dropdown panel. We fix this with a JS-controlled class instead.
  var navCat = document.querySelector('.nav-cat');
  if (navCat) {
    var dropdown = navCat.querySelector('.nav-dropdown');
    var leaveTimer = null;

    navCat.addEventListener('mouseenter', function () {
      clearTimeout(leaveTimer);
      if (dropdown) dropdown.style.display = 'block';
    });

    navCat.addEventListener('mouseleave', function () {
      leaveTimer = setTimeout(function () {
        if (dropdown) dropdown.style.display = '';
      }, 120); // 120ms grace window — enough to move mouse into dropdown
    });

    if (dropdown) {
      dropdown.addEventListener('mouseenter', function () {
        clearTimeout(leaveTimer);
      });
      dropdown.addEventListener('mouseleave', function () {
        leaveTimer = setTimeout(function () {
          dropdown.style.display = '';
        }, 80);
      });
    }
  }

  // ─── 5. FIX: Mobile menu — show category links prominently at top ─────────
  // Inject a "SHOP BY CATEGORY" header section at the top of the mobile menu
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    // Check if we've already injected (prevent double-run)
    if (!mobileMenu.querySelector('.mobile-cat-header')) {
      var catHeader = document.createElement('div');
      catHeader.className = 'mobile-cat-header';
      catHeader.style.cssText = [
        'padding: 8px 20px 4px',
        'font-family: "Space Mono", monospace',
        'font-size: 0.55rem',
        'letter-spacing: 0.22em',
        'text-transform: uppercase',
        'color: var(--accent)',
        'border-bottom: 1px solid var(--border)'
      ].join(';');
      catHeader.textContent = '▸ Shop by Category';
      mobileMenu.insertBefore(catHeader, mobileMenu.firstChild);
    }
  }

  // ─── 6. FIX: Mobile nav — show category row above hamburger ──────────────
  // Add a visible category strip below the nav on mobile
  var nav = document.querySelector('nav');
  if (nav && window.innerWidth <= 768) {
    if (!document.querySelector('.mobile-cat-strip')) {
      var strip = document.createElement('div');
      strip.className = 'mobile-cat-strip';
      strip.style.cssText = [
        'display: flex',
        'overflow-x: auto',
        'background: var(--void, #0a0a0d)',
        'border-bottom: 1px solid var(--border, #1e1e26)',
        'padding: 0',
        '-webkit-overflow-scrolling: touch',
        'scrollbar-width: none'
      ].join(';');

      var cats = [
        { href: '#tees',       label: 'T-Shirts'     },
        { href: '#mens',       label: "Men's Jeans"  },
        { href: '#womens',     label: "Women's Jeans"},
        { href: '#womenstops', label: 'Women Tops'   },
        { href: '#anime',      label: 'Anime Jeans'  },
        { href: '#track',      label: 'Track Pants'  }
      ];

      cats.forEach(function (cat) {
        var a = document.createElement('a');
        a.href = cat.href;
        a.textContent = cat.label;
        a.style.cssText = [
          'flex-shrink: 0',
          'padding: 10px 14px',
          'font-family: "Space Mono", monospace',
          'font-size: 0.58rem',
          'letter-spacing: 0.15em',
          'text-transform: uppercase',
          'color: var(--muted, #555560)',
          'text-decoration: none',
          'border-right: 1px solid var(--border, #1e1e26)',
          'white-space: nowrap',
          'transition: color 0.2s, background 0.2s'
        ].join(';');
        a.addEventListener('click', function () {
          // Close mobile menu if open
          var mm = document.querySelector('.mobile-menu');
          if (mm) mm.classList.remove('open');
        });
        a.addEventListener('mouseenter', function () {
          this.style.color = 'var(--accent, #c8ff00)';
          this.style.background = 'var(--surface, #111116)';
        });
        a.addEventListener('mouseleave', function () {
          this.style.color = 'var(--muted, #555560)';
          this.style.background = '';
        });
        strip.appendChild(a);
      });

      nav.insertAdjacentElement('afterend', strip);
    }
  }

  // Also handle resize — show/hide strip dynamically
  window.addEventListener('resize', function () {
    var existing = document.querySelector('.mobile-cat-strip');
    if (window.innerWidth <= 768) {
      if (!existing && nav) {
        // trigger re-run logic — simplest: reload (only on resize cross boundary)
      }
      if (existing) existing.style.display = 'flex';
    } else {
      if (existing) existing.style.display = 'none';
    }
  });

});
