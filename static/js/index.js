document.addEventListener('DOMContentLoaded', function () {
  // Respect reduced-motion preferences for the teaser video
  var video = document.querySelector('.teaser video');
  if (video && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  // Dot plot tooltips (hover and keyboard focus)
  document.querySelectorAll('.dotplot').forEach(function (plot) {
    var tip = plot.querySelector('.dotplot__tip');

    function show(dot) {
      var value = document.createElement('strong');
      value.textContent = dot.dataset.value;
      var key = document.createElement('span');
      key.className = 'key';
      key.style.background = getComputedStyle(dot).backgroundColor;
      var series = document.createElement('span');
      series.appendChild(key);
      series.appendChild(document.createTextNode(dot.dataset.series));
      var model = document.createElement('span');
      model.className = 'model';
      model.textContent = dot.dataset.model;
      tip.replaceChildren(value, series, model);
      tip.hidden = false;

      var box = plot.getBoundingClientRect();
      var mark = dot.getBoundingClientRect();
      var half = tip.offsetWidth / 2;
      var x = mark.left + mark.width / 2 - box.left;
      tip.style.left = Math.min(Math.max(x, half), box.width - half) + 'px';
      tip.style.top = (mark.top - box.top) + 'px';
    }

    function hide() {
      tip.hidden = true;
    }

    plot.querySelectorAll('.dot[tabindex]').forEach(function (dot) {
      dot.addEventListener('pointerenter', function () { show(dot); });
      dot.addEventListener('pointerleave', hide);
      dot.addEventListener('focus', function () { show(dot); });
      dot.addEventListener('blur', hide);
    });
  });

  // Copy-to-clipboard buttons
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    var label = button.querySelector('.copy__label');
    var timer;

    button.addEventListener('click', function () {
      var text = document.getElementById(button.dataset.copy).textContent;

      copyText(text).then(function () {
        button.classList.add('is-copied');
        label.textContent = 'Copied';
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.classList.remove('is-copied');
          label.textContent = 'Copy';
        }, 2000);
      });
    });
  });
});

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  var area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'absolute';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
  return Promise.resolve();
}
