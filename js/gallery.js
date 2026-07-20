/* Gallery renderer, shared by game.html and photo.html. */
/* Renders in batches with a "Load more" button instead of all at once. */
(function () {
  "use strict";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  window.renderGallery = function (opts) {
    var grid = document.getElementById(opts.gridId);
    var countEl = document.getElementById(opts.countId);
    var loadBtn = document.getElementById(opts.loadMoreId);
    var items = opts.items;
    var batch = opts.batchSize || 32;
    var shown = 0;

    if (countEl) countEl.textContent = items.length + (opts.unit ? " " + opts.unit : "");

    function renderBatch() {
      var next = items.slice(shown, shown + batch);
      next.forEach(function (item) {
        var tile = el("figure", "tile" + (opts.type === "photo" ? " photo-tile" : ""));
        var img = el("img");
        img.src = opts.imgBase + item.img;
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = opts.type === "photo"
          ? item.alt
          : item.title + (item.sub ? " — " + item.sub : "");
        tile.appendChild(img);

        tile.tabIndex = 0;
        tile.setAttribute("role", "button");
        tile.dataset.lightbox = img.src;
        tile.dataset.caption = img.alt;

        if (opts.type === "game") {
          var cap = el(
            "figcaption",
            "tile-caption",
            '<div class="t-main"></div>' + (item.sub ? '<div class="t-sub"></div>' : "")
          );
          cap.querySelector(".t-main").textContent = item.title;
          if (item.sub) cap.querySelector(".t-sub").textContent = item.sub;
          tile.appendChild(cap);
        }

        tile.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tile.click();
          }
        });

        grid.appendChild(tile);
      });
      shown += next.length;

      if (loadBtn) {
        if (shown >= items.length) {
          loadBtn.style.display = "none";
        } else {
          loadBtn.textContent = "Load more (" + (items.length - shown) + " remaining)";
        }
      }
    }

    renderBatch();
    if (loadBtn) loadBtn.addEventListener("click", renderBatch);
  };
})();