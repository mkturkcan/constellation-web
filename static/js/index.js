document.addEventListener('DOMContentLoaded', function () {
  // Respect reduced-motion preferences for the teaser video
  var video = document.querySelector('.teaser video');
  if (video && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }

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
