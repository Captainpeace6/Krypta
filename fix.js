// KRYPTAA fix.js - handles all page fixes
document.addEventListener('DOMContentLoaded', function() {

  /* ── FIX 1: Remove track pants from womens jeans slider ── */
  var s = document.querySelector('#womensSlider');
  if (s) {
    Array.from(s.querySelectorAll('.card')).forEach(function(c) {
      var n = c.querySelector('h3,h4,[class*=name]');
      if (n && n.textContent.toLowerCase().includes('track pant')) c.remove();
    });
  }

  /* ── FIX 2: Main site checkout button ── */
  var checkoutBtn = document.querySelector('.cart-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart || []));
      window.location.href = 'checkout.html';
    });
  }

  /* ── FIX 3: Checkout page - cursor + cart rendering ── */
  if (window.location.pathname.includes('checkout')) {

    // Fix cursor
    var cur = document.getElementById('cur');
    var curR = document.getElementById('curR');
    if (cur && curR) {
      document.addEventListener('mousemove', function(e) {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
        curR.style.left = e.clientX + 'px';
        curR.style.top = e.clientY + 'px';
      });
    }

    // Fix cart rendering
    function fixRenderCart() {
      var cart = [];
      try { cart = JSON.parse(localStorage.getItem('kryptaa_cart') || '[]'); } catch(e) {}
      var el = document.getElementById('cartItems');
      if (!el) return;
      if (!cart.length) {
        el.innerHTML = '<div style="text-align:center;padding:36px 0"><p style="font-family:Space Mono,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:20px">Your bag is empty</p><a href="index.html" style="border:1px solid var(--accent);color:var(--accent);font-family:Space Mono,monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:10px 20px;text-decoration:none">Shop the Drop</a></div>';
      } else {
        el.innerHTML = cart.map(function(item, i) {
          var src = item.img && !item.img.includes('BASE64') ? (item.img.startsWith('http') ? item.img : 'https://kryptaa.com/' + item.img) : null;
          return '<div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)">' +
            (src ? '<img src="' + src + '" style="width:66px;height:82px;object-fit:cover;background:var(--surface);border:1px solid var(--border);flex-shrink:0" onerror="this.style.display='none'">' : '<div style="width:66px;height:82px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">&#128085;</div>') +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-family:Bebas Neue,sans-serif;font-size:14px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px">' + item.name + '</div>' +
              '<div style="font-family:Space Mono,monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Size: ' + (item.size || '—') + '</div>' +
            '</div>' +
            '<div style="font-family:Bebas Neue,sans-serif;font-size:16px;color:var(--white);white-space:nowrap;align-self:center">$' + ((item.price || 0) * (item.qty || 1)).toFixed(2) + '</div>' +
          '</div>';
        }).join('');
      }
      // Update totals
      var sub = cart.reduce(function(s, i) { return s + (i.price || 0) * (i.qty || 1); }, 0);
      var ship = cart.length ? (sub >= 75 ? 0 : 9.99) : 0;
      var subtotalEl = document.getElementById('subtotalVal');
      var shippingEl = document.getElementById('shippingVal');
      var totalEl = document.getElementById('grandTotal');
      var nb = document.getElementById('navBagCount');
      if (subtotalEl) subtotalEl.textContent = '$' + sub.toFixed(2);
      if (shippingEl) shippingEl.textContent = !cart.length ? '—' : ship === 0 ? 'FREE' : '$' + ship.toFixed(2);
      if (totalEl) totalEl.textContent = '$' + (sub + ship).toFixed(2);
      if (nb) nb.textContent = cart.reduce(function(s, i) { return s + (i.qty || 1); }, 0);
    }

    // Run immediately and again after a short delay
    fixRenderCart();
    setTimeout(fixRenderCart, 500);
    setTimeout(fixRenderCart, 1500);
  }

});
