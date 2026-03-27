document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // STYLES: Mobile menu + desktop dropdown fix
  // =============================================
  var st = document.createElement('style');
  st.textContent = [
    // Mobile menu - big visible categories
    '#mobileMenu{display:none;position:fixed!important;top:56px;left:0;right:0;background:#060608!important;z-index:500!important;padding:8px 0!important;border-bottom:2px solid #c8ff00;}',
    '#mobileMenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:18px 24px!important;font-family:"Bebas Neue",sans-serif!important;font-size:28px!important;letter-spacing:.1em!important;color:#f0ede8!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;background:#060608!important;}',
    '#mobileMenu a:hover,#mobileMenu a:active{color:#c8ff00!important;background:#0a0a0d!important;}',
    // Desktop dropdown - fix hover gap
    '.nav-cat.js-dd:hover .nav-dropdown{display:none;}',
    '.nav-cat.js-dd.open .nav-dropdown{display:block!important;}',
    '.nav-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#0a0a0d;border:1px solid #1e1e26;min-width:160px;z-index:600;padding:4px 0;}',
    '.nav-dropdown a{display:block!important;padding:12px 18px!important;font-family:"Space Mono",monospace!important;font-size:0.6rem!important;letter-spacing:.15em!important;text-transform:uppercase!important;color:#555560!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
    '.nav-dropdown a:hover{color:#c8ff00!important;background:#111116!important;}',
    // Mobile cat strip - FIXED position so it doesn't push content
    '@media(max-width:768px){',
    '.nav-cat-strip{position:fixed!important;top:56px;left:0;right:0;z-index:400;display:flex!important;overflow-x:auto;background:#0a0a0d;border-bottom:1px solid #1e1e26;scrollbar-width:none;}',
    '.nav-cat-strip::-webkit-scrollbar{display:none;}',
    '.nav-cat-strip a{flex-shrink:0;padding:9px 14px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#555560;text-decoration:none;border-right:1px solid #1e1e26;white-space:nowrap;}',
    '.nav-cat-strip a:hover{color:#c8ff00;background:#111116;}',
    // Offset body by nav(56px) + strip(36px) = 92px to prevent content hiding
    'body{padding-top:92px!important;}',
    'nav{position:fixed!important;top:0;left:0;right:0;z-index:450!important;}',
    '}'
  ].join('');
  document.head.appendChild(st);

  // =============================================
  // DESKTOP: Shop dropdown click-toggle fix
  // =============================================
  var navCat = document.querySelector('.nav-cat');
  var navDrop = document.querySelector('.nav-dropdown');
  if (navCat && navDrop) {
    navCat.classList.add('js-dd');
    var shopLink = navCat.querySelector('a');
    if (shopLink) {
      shopLink.addEventListener('click', function(e) {
        e.preventDefault();
        navCat.classList.toggle('open');
      });
    }
    document.addEventListener('click', function(e) {
      if (!navCat.contains(e.target)) navCat.classList.remove('open');
    });
    navDrop.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { navCat.classList.remove('open'); });
    });
  }

  // =============================================
  // MOBILE: Category strip below nav
  // =============================================
  if (!document.querySelector('.nav-cat-strip')) {
    var strip = document.createElement('div');
    strip.className = 'nav-cat-strip';
    strip.innerHTML = '<a href="#tees">T-Shirts</a><a href="#mens">Mens</a><a href="#anime">Anime</a><a href="#womens">Womens</a><a href="#womenstops">Tops</a><a href="#tab-track">Track</a>';
    var nav = document.querySelector('nav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
  }

  // =============================================
  // MOBILE: Hamburger menu
  // =============================================
  var mobileMenu = document.getElementById('mobileMenu');
  var ham = document.getElementById('hamburgerBtn');
  if (mobileMenu && ham) {
    var iconMap = {tees:'👕',mens:'👖',womens:'👗',womenstops:'🔺'};
    Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
      if (a.querySelector('.mob-icon')) return;
      var href = (a.getAttribute('href')||'').replace('#','');
      var span = document.createElement('span');
      span.className = 'mob-icon';
      span.style.cssText = 'font-size:20px;width:28px;text-align:center;flex-shrink:0;';
      span.textContent = iconMap[href] || '→';
      a.insertBefore(span, a.firstChild);
    });
    ham.onclick = null;
    ham.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function(e) {
      if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.style.display = 'none';
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { mobileMenu.style.display = 'none'; });
    });
  }

  // =============================================
  // CART PERSISTENCE
  // =============================================
  var _sync = window.syncCart;
  window.syncCart = function() { if(_sync) _sync.apply(this,arguments); if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); };
  var _add = window.addCart;
  window.addCart = function() { var r=_add?_add.apply(this,arguments):undefined; if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); return r; };
  var _addById = window.addCartById;
  window.addCartById = function() { var r=_addById?_addById.apply(this,arguments):undefined; if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); return r; };
  var saved=[]; try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
  if (saved.length > 0) {
    var att=0, ri=setInterval(function(){
      if(++att>30){clearInterval(ri);return;}
      if(window.cart!==undefined && typeof window.syncCart==='function'){
        if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}
        clearInterval(ri);
      }
    },100);
  }
  window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

  // =============================================
  // EXISTING: Track pants, checkout btn, prices
  // =============================================
  var s=document.querySelector('#womensSlider');
  if(s) Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
  var btn=document.querySelector('.cart-checkout');
  if(btn) btn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
  var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
  [window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});
  document.querySelectorAll('.card,[class*=card]').forEach(function(card){var pid=card.dataset&&(card.dataset.pid||card.dataset.id);if(pid&&pm[parseInt(pid)]!==undefined){var el=card.querySelector('[class*=price],[class*=Price]');if(el)el.textContent='$'+pm[parseInt(pid)];}});
});
