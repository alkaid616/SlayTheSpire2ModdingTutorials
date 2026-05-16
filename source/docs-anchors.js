(function () {
  function getHeadingText(heading) {
    var clone = heading.cloneNode(true);
    var anchor = clone.querySelector(".kira-heading-anchor");
    if (anchor) anchor.remove();
    return (clone.textContent || "").trim();
  }

  function slugifyHeading(text, index) {
    var slug = (text || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff\-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return slug || "section-" + (index + 1);
  }

  function ensureHeadingId(heading, index, usedIds) {
    var spanWithId = heading.querySelector("span[id]");
    var id = spanWithId ? spanWithId.id : heading.id;
    if (!id) {
      id = slugifyHeading(getHeadingText(heading), index);
      var base = id;
      var suffix = 2;
      while (usedIds[id]) {
        id = base + "-" + suffix;
        suffix += 1;
      }
      heading.id = id;
    }
    usedIds[id] = true;
    return { id: id, target: spanWithId || heading };
  }

  function setLocationHash(id) {
    if (!id) return;
    var hash = "#" + id;
    if (location.hash === hash) return;
    history.replaceState(null, "", location.pathname + location.search + hash);
  }

  function getScrollContainer() {
    return document.querySelector(".kira-content");
  }

  function scrollToTarget(target, id, updateHash) {
    var content = getScrollContainer();
    if (!content || !target) return;
    var contentRect = content.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    var nextTop = content.scrollTop + (targetRect.top - contentRect.top) - 14;
    content.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
    if (updateHash !== false && id) {
      setLocationHash(id);
    }
    document.dispatchEvent(
      new CustomEvent("kira:heading-active", { detail: { id: id } })
    );
  }

  function addHeadingAnchors(article, usedIds) {
    var headings = article.querySelectorAll("h2, h3, h4");
    headings.forEach(function (heading, index) {
      var info = ensureHeadingId(heading, index, usedIds);
      if (heading.querySelector(".kira-heading-anchor")) return;

      var anchor = document.createElement("a");
      anchor.className = "kira-heading-anchor";
      anchor.href = "#" + info.id;
      anchor.setAttribute("aria-label", "链接到此章节");
      anchor.textContent = "#";
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        scrollToTarget(info.target, info.id, true);
      });

      heading.classList.add("kira-heading-with-anchor");

      var label = document.createElement("span");
      label.className = "kira-heading-text";
      while (heading.firstChild) {
        label.appendChild(heading.firstChild);
      }
      heading.appendChild(label);
      heading.appendChild(anchor);

      heading.addEventListener("click", function (event) {
        if (event.target.closest(".kira-heading-anchor")) return;
        scrollToTarget(info.target, info.id, true);
      });
    });
    return headings;
  }

  function setActiveItem(list, targetId) {
    if (!list) return;
    list.querySelectorAll(".kira-chapter-item").forEach(function (item) {
      var link = item.querySelector("a");
      if (!link) return;
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      item.classList.toggle("is-active", decodeURIComponent(id) === targetId);
    });
  }

  function createChapterLink(heading, index, list, chapterTargets, usedIds) {
    var level = heading.tagName.toLowerCase();
    var info = ensureHeadingId(heading, index, usedIds);
    var text = getHeadingText(heading);
    if (!text) return null;

    var li = document.createElement("li");
    var levelClass = level === "h4" ? "is-sub-2" : level === "h3" ? "is-sub" : "";
    li.className = "kira-chapter-item " + levelClass;

    var a = document.createElement("a");
    a.href = "#" + info.id;
    a.textContent = text;
    a.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToTarget(info.target, info.id, true);
      setActiveItem(list, info.id);
    });

    li.appendChild(a);
    list.appendChild(li);
    chapterTargets.push({ id: info.id, el: info.target });
    return li;
  }

  function scrollFromHash() {
    var raw = location.hash.replace(/^#/, "");
    if (!raw) return;
    var id = decodeURIComponent(raw);
    var target = document.getElementById(id);
    if (!target) return;
    scrollToTarget(target, id, false);
    document.dispatchEvent(
      new CustomEvent("kira:heading-active", { detail: { id: id } })
    );
  }

  function buildToc() {
    var panel = document.getElementById("kira-chapters-panel");
    var list = document.getElementById("kira-chapters-list");
    var article = document.querySelector(".kira-main-content .kira-post article");
    var content = getScrollContainer();
    if (!panel || !list || !article || !content) return;

    var usedIds = {};
    addHeadingAnchors(article, usedIds);
    var headings = article.querySelectorAll("h2, h3, h4");
    if (!headings.length) {
      panel.classList.remove("is-visible");
      return;
    }

    list.innerHTML = "";
    var chapterTargets = [];
    headings.forEach(function (heading, index) {
      createChapterLink(heading, index, list, chapterTargets, usedIds);
    });

    var inlineToc = document.getElementById("kira-inline-toc");
    if (inlineToc) inlineToc.remove();

    if (window.matchMedia("(max-width: 1000px)").matches) {
      var inline = document.createElement("nav");
      inline.id = "kira-inline-toc";
      inline.className = "kira-inline-toc";
      inline.setAttribute("aria-label", "本页目录");
      inline.innerHTML = '<div class="kira-inline-toc-title">本页目录</div><ul></ul>';
      var inlineList = inline.querySelector("ul");
      headings.forEach(function (heading, index) {
        createChapterLink(heading, index, inlineList, chapterTargets, usedIds);
      });
      var titleBlock = article.querySelector(".kira-post-title");
      if (titleBlock && titleBlock.nextSibling) {
        article.insertBefore(inline, titleBlock.nextSibling);
      } else {
        article.insertBefore(inline, article.firstChild);
      }
    }

    if (!list.children.length) {
      panel.classList.remove("is-visible");
      return;
    }

    panel.classList.add("is-visible");

    function syncActiveByScroll() {
      if (!chapterTargets.length) return;
      var containerRect = content.getBoundingClientRect();
      var triggerTop = containerRect.top + 120;
      var currentId = chapterTargets[0].id;
      chapterTargets.forEach(function (item) {
        if (item.el.getBoundingClientRect().top <= triggerTop) {
          currentId = item.id;
        }
      });
      setActiveItem(list, currentId);
      var inlineList = document.querySelector("#kira-inline-toc ul");
      setActiveItem(inlineList, currentId);
    }

    content.addEventListener("scroll", syncActiveByScroll, { passive: true });
    window.addEventListener("resize", syncActiveByScroll);
    document.addEventListener("kira:heading-active", function (event) {
      setActiveItem(list, event.detail.id);
      setActiveItem(document.querySelector("#kira-inline-toc ul"), event.detail.id);
    });
    syncActiveByScroll();
  }

  function init() {
    buildToc();
    requestAnimationFrame(function () {
      scrollFromHash();
    });
    window.addEventListener("hashchange", scrollFromHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
