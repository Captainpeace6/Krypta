document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // FIX 1: MOBILE MENU - Make categories visible
  // =============================================
  var mobStyle = document.createElement('style');
  mobStyle.textContent = '#mobileMenu { display: none; position: fixed !important; top: 56px; left: 0; right: 0; background: #060608 !important; z-index: 500 !important; padding: 8px 0 !important; border-bottom: 2px solid #c8ff00; } #mobileMenu a { display: flex !important; align-items: center !important; gap: 12px !important; padding: 18px 24px !important; font-family: "Bebas Neue", sans-serif !important; font-size: 28px !important; letter-spacing: .1em !important; color: #f0ede8 !important; text-decoration: none !important; border-bottom: 1px solid #1e1e26 !important; background: #060608 !important; } #mobileMenu a:hover, #mobileMenu a:active { color: #c8ff00 !important; background: #0a0a0d !important; } #mobileMenu a .mob-icon { font-size: 22px; width: 30px; text-align: center; flex-shrink: 0; } @media (max-width: 768px) { .nav-cat-strip { display: flex !important; overflow-x: auto; background: #0a0a0d; border-bottom: 1px solid #1e1e26; padding: 0; -webkit-overflow-scrolling: touch; scrollbar-width: none; position: fixed; top: 56px; left: 0; right: 0; z-index: 400; } .nav-cat-strip::-webkit-scrollbar { display: none; } .nav-cat-strip a { flex-shrink: 0; padding: 10px 16px; font-family: "Space Mono", monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: #555560; text-decoration: none; border-right: 1px solid #1e1e26; white-space: nowrap; } .nav-cat-strip a:hover, .nav-cat-strip a.active { color: #c8ff00; background: #111116; } body { padding-top: 96px !important; } nav { position: fixed !important; top: 0; left: 0; right: 0; z-index: 450 !important; } }';
  document.head.appendChild(mobStyle);

  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    var iconMap = {'tees':'T-SHIRTS','mens':'MENS JEANS','womens':'WOMENS JEANS','womenstops':'WOMENS TOPS'};
    Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
      var href = (a.getAttribute('href') || '').replace('#','');
      if (!a.querySelector('.mob-icon')) {
        var span = document.createElement('span');
        span.className = 'mob-icon';
        span.textContent = href === 'tees' ? '👕' : href === 'mens' ? '👖' : href === 'womens' ? '👗' : href === 'womenstops' ? '🔺' : '📏';
        a.insertBefore(span, a.firstChild);
      }
    });
    var ham = document.getElementById('hamburgerBtn');
    if (ham) {
      ham.onclick = null;
      ham.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
      });
      document.addEventListener('click', function(e) {
        if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.style.display = 'none';
      });
      Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
        a.addEventListener('click', function() { mobileMenu.style.display = 'none'; });
      });
    }
  }

  if (!document.querySelector('.nav-cat-strip')) {
    var strip = document.createElement('div');
    strip.className = 'nav-cat-strip';
    strip.innerHTML = '<a href="#tees">T-Shirts</a><a href="#mens">Mens Jeans</a><a href="#anime">Anime Jeans</a><a href="#womens">Womens Jeans</a><a href="#womenstops">Women Tops</a><a href="#tab-track">Track Pants</a>';
    var nav = document.querySelector('nav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
  }

  // =============================================
  // FIX 2: CART PERSISTENCE
  // =============================================
  var origSyncCart = window.syncCart;
  window.syncCart = function() {
    if (origSyncCart) origSyncCart.apply(this, arguments);
    if (window.cart && Array.isArray(window.cart)) localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
  };
  var origAddCart = window.addCart;
  window.addCart = function() {
    var r = origAddCart ? origAddCart.apply(this, arguments) : undefined;
    if (window.cart) localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
    return r;
  };
  var origAddCartById = window.addCartById;
  window.addCartById = function() {
    var r = origAddCartById ? origAddCartById.apply(this, arguments) : undefined;
    if (window.cart) localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
    return r;
  };
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem('kryptaa_cart') || '[]'); } catch(e) {}
  if (saved.length > 0) {
    var att = 0;
    var ri = setInterval(function() {
      att++;
      if (att > 30) { clearInterval(ri); return; }
      if (window.cart !== undefined && typeof window.syncCart === 'function') {
        if (!window.cart || window.cart.length === 0) { window.cart = saved; window.syncCart(); }
        clearInterval(ri);
      }
    }, 100);
  }
  window.addEventListener('beforeunload', function() {
    if (window.cart && window.cart.length > 0) localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
  });

  // =============================================
  // EXISTING: Track pants, checkout, prices
  // =============================================
  var s = document.querySelector('#womensSlider');
  if (s) Array.from(s.querySelectorAll('.card')).forEach(function(c) { var n = c.querySelector('h3,h4,[class*=name]'); if (n && n.textContent.toLowerCase().includes('track pant')) c.remove(); });
  var btn = document.querySelector('.cart-checkout');
  if (btn) btn.addEventListener('click', function() { localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart||[])); window.location.href='checkout.html'; });
  var priceMap = {10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
  [window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(priceMap[p.id]!==undefined)p.price=priceMap[p.id];});});
  document.querySelectorAll('.card,[class*=card]').forEach(function(card){var pid=card.dataset&&(card.dataset.pid||card.dataset.id);if(pid&&priceMap[parseInt(pid)]!==undefined){var priceEl=card.querySelector('[class*=price],[class*=Price]');if(priceEl)priceEl.textContent='$'+priceMap[parseInt(pid)];}});
});
