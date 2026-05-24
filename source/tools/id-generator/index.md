---
title: ID 生成器
date: 2026-05-22 12:20:00
permalink: tools/id-generator/
comments: false
reprinted: true
hide_meta: true
---

<div class="entry-id-tool" data-entry-id-tool>
<section class="entry-id-tool__panel">
<div class="entry-id-tool__panel-title">输入</div>
<div class="entry-id-tool__form">
<label class="entry-id-tool__field">
<span>前置库</span>
<select id="entryIdLibrary">
<option value="baselib">BaseLib</option>
<option value="ritsulib">RitsuLib</option>
</select>
</label>
<div class="entry-id-tool__fields" id="entryIdBaseLibFields">
<label class="entry-id-tool__field">
<span>命名空间</span>
<input id="entryIdNamespace" value="Test.Scripts" spellcheck="false">
</label>
<label class="entry-id-tool__field">
<span>类名</span>
<input id="entryIdBaseId" value="MyCoolCard" spellcheck="false">
</label>
</div>
<div class="entry-id-tool__fields is-hidden" id="entryIdRitsuLibFields">
<label class="entry-id-tool__field">
<span>Mod ID</span>
<input id="entryIdModId" value="Test" spellcheck="false">
</label>
<label class="entry-id-tool__field">
<span>内容类别</span>
<select id="entryIdModelType"></select>
</label>
<label class="entry-id-tool__field">
<span>类名</span>
<input id="entryIdRitsuId" value="MyCoolCard" spellcheck="false">
</label>
</div>
</div>
</section>
<section class="entry-id-tool__panel">
<div class="entry-id-tool__panel-title">输出</div>
<div class="entry-id-tool__result">
<div id="entryIdError" class="entry-id-tool__error"></div>
<div class="entry-id-tool__output">
<button class="entry-id-tool__copy" id="entryIdCopy" type="button">复制</button>
<div id="entryIdFinal" class="entry-id-tool__code"></div>
</div>
</div>
</section>
</div>

<style>
  .entry-id-tool {
    --entry-panel: rgba(21, 27, 35, 0.86);
    --entry-panel-2: rgba(32, 38, 46, 0.92);
    --entry-border: rgba(255, 255, 255, 0.12);
    --entry-text: #e8edf2;
    --entry-muted: #aeb9c9;
    --entry-accent: #d97519;
    --entry-danger: #ff9b9b;
    display: grid;
    gap: 18px;
    width: 100%;
    max-width: none;
    overflow: visible;
  }

  body:has([data-entry-id-tool]) .kira-content {
    overflow: hidden !important;
  }

  @media (min-width: 1001px) {
    body:has([data-entry-id-tool]) .kira-main-content {
      height: 100% !important;
      min-height: 0 !important;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    body:has([data-entry-id-tool]) .kira-post,
    body:has([data-entry-id-tool]) .kira-post article {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    body:has([data-entry-id-tool]) .entry-id-tool {
      flex: 1 1 auto;
      min-height: 0;
      grid-template-rows: auto minmax(0, 1fr);
    }

    body:has([data-entry-id-tool]) .entry-id-tool__panel:last-child {
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    body:has([data-entry-id-tool]) .entry-id-tool__result {
      flex: 1 1 auto;
      min-height: 0;
      grid-template-rows: auto minmax(0, 1fr);
    }

    body:has([data-entry-id-tool]) .entry-id-tool__output {
      align-content: start;
    }
  }

  .entry-id-tool *,
  .entry-id-tool *::before,
  .entry-id-tool *::after {
    box-sizing: border-box;
  }

  .entry-id-tool__panel {
    min-width: 0;
    border: 1px solid var(--entry-border);
    border-radius: 8px;
    background: var(--entry-panel);
    overflow: visible;
  }

  .entry-id-tool__panel-title {
    padding: 16px 18px 0;
    color: var(--entry-text);
    font-weight: 700;
    font-size: 1rem;
  }

  .entry-id-tool__form,
  .entry-id-tool__fields,
  .entry-id-tool__result {
    display: grid;
    gap: 14px;
    padding: 18px;
  }

  .entry-id-tool__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0;
  }

  #entryIdRitsuLibFields {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .entry-id-tool__field {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .entry-id-tool__field span,
  .entry-id-tool__output span {
    color: var(--entry-muted);
    font-size: 0.84rem;
  }

  .entry-id-tool input,
  .entry-id-tool select {
    display: block;
    width: 100%;
    min-width: 100%;
    min-height: 40px;
    border: 1px solid var(--entry-border);
    border-radius: 6px;
    background: rgba(12, 16, 22, 0.45);
    color: var(--entry-text);
    padding: 8px 10px;
    outline: none;
    font: inherit;
    letter-spacing: 0;
  }

  .entry-id-tool input:focus,
  .entry-id-tool select:focus {
    border-color: rgba(217, 117, 25, 0.72);
  }

  .entry-id-tool option {
    width: 100%;
    min-width: 100%;
    background: #151b23;
    color: var(--entry-text);
  }

  .entry-id-tool__copy {
    min-height: 38px;
    border: 1px solid var(--entry-border);
    border-radius: 6px;
    background: rgba(12, 16, 22, 0.45);
    color: var(--entry-text);
    cursor: pointer;
    font: inherit;
    letter-spacing: 0;
    justify-self: end;
    padding: 0 10px;
    transition: background-color 0.18s ease, border-color 0.18s ease;
  }

  .entry-id-tool__copy:hover {
    border-color: rgba(217, 117, 25, 0.78);
    background: rgba(187, 101, 22, 0.24);
  }

  .entry-id-tool__output {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px 12px;
    padding: 14px;
    border-radius: 8px;
    background: var(--entry-panel-2);
  }

  .entry-id-tool__code {
    grid-column: 1 / -1;
    min-height: 32px;
    overflow-wrap: anywhere;
    color: var(--entry-text);
    font-family: "Cascadia Mono", "Consolas", monospace;
    font-size: 1.32rem;
    line-height: 1.25;
    max-width: 100%;
  }

  .entry-id-tool__error {
    color: var(--entry-danger);
    font-weight: 700;
  }

  .entry-id-tool .is-hidden {
    display: none;
  }

  @media (max-width: 900px) {
    .entry-id-tool__fields,
    #entryIdRitsuLibFields {
      grid-template-columns: 1fr;
    }
  }
</style>

<script src="./id-generator.js"></script>
<script>
  (function () {
    const api = globalThis.RitsuLibEntryId;
    const library = document.getElementById("entryIdLibrary");
    const baseLibFields = document.getElementById("entryIdBaseLibFields");
    const ritsuLibFields = document.getElementById("entryIdRitsuLibFields");
    const namespaceInput = document.getElementById("entryIdNamespace");
    const baseId = document.getElementById("entryIdBaseId");
    const modId = document.getElementById("entryIdModId");
    const modelType = document.getElementById("entryIdModelType");
    const ritsuId = document.getElementById("entryIdRitsuId");
    const error = document.getElementById("entryIdError");
    const final = document.getElementById("entryIdFinal");
    const copy = document.getElementById("entryIdCopy");

    if (!api || !library || !baseLibFields || !ritsuLibFields || !namespaceInput || !baseId || !modId || !modelType || !ritsuId || !error || !final || !copy) {
      return;
    }

    const storageKey = "sts2modding:id-generator:state";

    const modelTypes = [
      "afflicition",
      "card",
      "cardpile",
      "cardtag",
      "character",
      "enchantment",
      "encounter",
      "event",
      "keyword",
      "modifier",
      "monster",
      "orb",
      "poolfilter",
      "potion",
      "power",
      "relic",
      "reward",
      "targettype",
      "topbarbutton",
    ];

    modelType.replaceChildren(...modelTypes.map((type) => {
      const option = document.createElement("option");
      option.value = type.toUpperCase();
      option.textContent = type.toUpperCase();
      return option;
    }));

    restoreState();

    [library, namespaceInput, baseId, modId, modelType, ritsuId].forEach((control) => {
      control.addEventListener("input", update);
      control.addEventListener("change", update);
    });

    copy.addEventListener("click", async () => {
      const value = final.textContent || "";
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        copy.textContent = "已复制";
      } catch (ex) {
        copy.textContent = "复制失败";
      }

      setTimeout(() => {
        copy.textContent = "复制";
      }, 1200);
    });

    render();

    function update() {
      saveState();
      render();
    }

    function saveState() {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          library: library.value,
          namespace: namespaceInput.value,
          baseId: baseId.value,
          modId: modId.value,
          modelType: modelType.value,
          ritsuId: ritsuId.value,
        }));
      } catch (ex) {}
    }

    function restoreState() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;

        const state = JSON.parse(raw);
        setControlValue(library, state.library);
        setControlValue(namespaceInput, state.namespace);
        setControlValue(baseId, state.baseId);
        setControlValue(modId, state.modId);
        setControlValue(modelType, state.modelType);
        setControlValue(ritsuId, state.ritsuId);
      } catch (ex) {}
    }

    function setControlValue(control, value) {
      if (typeof value !== "string") return;
      if (control.tagName === "SELECT") {
        const hasOption = Array.prototype.some.call(control.options, (option) => option.value === value);
        if (!hasOption) return;
      }
      control.value = value;
    }

    function render() {
      const isBaseLib = library.value === "baselib";
      baseLibFields.classList.toggle("is-hidden", !isBaseLib);
      ritsuLibFields.classList.toggle("is-hidden", isBaseLib);

      try {
        error.textContent = "";
        final.textContent = isBaseLib
          ? api.buildBaseLibEntryId(namespaceInput.value, baseId.value)
          : api.buildRitsuLibEntryId(modId.value, modelType.value, ritsuId.value);
      } catch (ex) {
        error.textContent = ex.message;
        final.textContent = "";
      }
    }
  })();
</script>
