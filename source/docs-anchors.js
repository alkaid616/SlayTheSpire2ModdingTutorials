(function () {
  var SCROLL_OFFSET = 28;

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
    }
    heading.id = id;
    if (spanWithId) spanWithId.id = id;
    usedIds[id] = true;
    return { id: id, target: heading };
  }

  function setLocationHash(id) {
    if (!id) return;
    var hash = "#" + id;
    if (location.hash === hash) return;
    history.replaceState(null, "", location.pathname + location.search + hash);
  }

  function getScrollRoot() {
    var content = document.querySelector(".kira-content");
    if (!content) return { type: "window" };
    var style = window.getComputedStyle(content);
    var canScroll =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      content.scrollHeight > content.clientHeight + 1;
    if (canScroll) return { type: "element", el: content };
    return { type: "window" };
  }

  function getScrollOffset() {
    if (window.matchMedia("(max-width: 1000px)").matches) {
      var header = document.querySelector(".kira-header");
      if (header) {
        var rect = header.getBoundingClientRect();
        if (rect.height > 0) return Math.ceil(rect.height) + 12;
      }
      return 64;
    }
    return SCROLL_OFFSET;
  }

  function getHeadingTop(heading, root) {
    if (root.type === "element") {
      var contentRect = root.el.getBoundingClientRect();
      var headingRect = heading.getBoundingClientRect();
      return root.el.scrollTop + (headingRect.top - contentRect.top);
    }
    return window.scrollY + heading.getBoundingClientRect().top;
  }

  function getScrollTop(root) {
    return root.type === "element" ? root.el.scrollTop : window.scrollY;
  }

  function scrollToTarget(target, id, updateHash) {
    if (!target) return;
    var root = getScrollRoot();
    var offset = getScrollOffset();
    var nextTop = Math.max(0, getHeadingTop(target, root) - offset);

    if (root.type === "element") {
      root.el.scrollTo({ top: nextTop, behavior: "smooth" });
    } else {
      window.scrollTo({ top: nextTop, behavior: "smooth" });
    }

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
    if (!list || !targetId) return;
    var activeItem = null;
    list.querySelectorAll(".kira-chapter-item").forEach(function (item) {
      var link = item.querySelector("a");
      if (!link) return;
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      var isActive = decodeURIComponent(id) === targetId;
      item.classList.toggle("is-active", isActive);
      if (isActive) activeItem = item;
    });
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
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
    if (!chapterTargets.some(function (item) {
      return item.id === info.id;
    })) {
      chapterTargets.push({ id: info.id, el: info.target });
    }
    return li;
  }

  function scrollFromHash() {
    var raw = location.hash.replace(/^#/, "");
    if (!raw) return;
    var id = decodeURIComponent(raw);
    var target = document.getElementById(id);
    if (!target) return;
    var heading = target.closest("h2, h3, h4") || target;
    scrollToTarget(heading, id, false);
    document.dispatchEvent(
      new CustomEvent("kira:heading-active", { detail: { id: id } })
    );
  }

  function buildToc() {
    var panel = document.getElementById("kira-chapters-panel");
    var list = document.getElementById("kira-chapters-list");
    var article = document.querySelector(".kira-main-content .kira-post article");
    if (!panel || !list || !article) return;

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
      var root = getScrollRoot();
      var offset = getScrollOffset();
      var scrollPos = getScrollTop(root);
      var currentId = chapterTargets[0].id;

      chapterTargets.forEach(function (item) {
        if (getHeadingTop(item.el, root) - offset <= scrollPos + 1) {
          currentId = item.id;
        }
      });

      setActiveItem(list, currentId);
      setActiveItem(document.querySelector("#kira-inline-toc ul"), currentId);
    }

    var scrollRoot = getScrollRoot();
    if (scrollRoot.type === "element") {
      scrollRoot.el.addEventListener("scroll", syncActiveByScroll, { passive: true });
    } else {
      window.addEventListener("scroll", syncActiveByScroll, { passive: true });
    }
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
