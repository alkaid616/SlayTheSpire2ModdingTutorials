---
title: 文本预览器
date: 2026-05-23 05:00:00
permalink: tools/text-preview/
comments: false
reprinted: true
hide_meta: true
---

<style>
@import url("../preview-assets/preview-tools.css?v=20260523-cardfit1");
</style>

<div class="preview-tool" data-text-preview-tool>
<header class="app-header">
<div class="logo-mark" aria-hidden="true"></div>
<div>
<h1>文本预览器</h1>
<div class="subtitle">BBCode 文本预览 · 颜色代码转换 · 游戏命名颜色</div>
</div>
<div class="spacer"></div>
<div class="kbd-hint">
<kbd>C</kbd> 复制 HEX &nbsp;·&nbsp; <kbd>S</kbd> 保存到最近
</div>
</header>

<section class="section">
<div class="grid-2">

<div class="panel">
<h2>颜色选择 / Color Input</h2>

<div class="swatch-large" id="swatchLarge" title="点击复制 HEX">
<span class="swatch-hint">CLICK TO COPY</span>
<span class="swatch-hex" id="swatchHex">#EFC851</span>
</div>

<div class="recent-row">
<span class="recent-label">RECENT</span>
<span class="recent-empty" id="recentEmpty">尚无记录 — 按 <kbd>S</kbd> 保存当前颜色</span>
<div id="recentSwatches" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
</div>

<div class="picker-expanded">
<div class="sv-area" id="svArea" tabindex="0" aria-label="调整饱和度和明度">
<div class="sv-cursor" id="svCursor"></div>
</div>
<div class="hue-strip" id="hueStrip" tabindex="0" role="slider" aria-label="调整色相" aria-valuemin="0" aria-valuemax="360" aria-valuenow="46">
<div class="hue-cursor" id="hueCursor"></div>
</div>
<div class="alpha-strip" id="alphaStrip" tabindex="0" role="slider" aria-label="调整透明度" aria-valuemin="0" aria-valuemax="255" aria-valuenow="255">
<div class="alpha-fill"></div>
<div class="alpha-cursor" id="alphaCursor"></div>
</div>
</div>

<div class="row" style="align-items: stretch;">
<label style="align-self:center;">HEX</label>
<input type="color" id="picker" value="#efc851">
<input type="text" id="hexInput" value="#EFC851" maxlength="9" style="flex:1; min-width:110px;">
<span id="matchTag" class="match-label none" style="align-self:center; white-space:nowrap;">无匹配</span>
</div>

<div class="num-grid-4">
<div class="num-cell"><label>R · 0-255</label><input type="number" id="rN" value="239" min="0" max="255" step="1"><input type="range" id="rR" min="0" max="255" step="1" value="239"></div>
<div class="num-cell"><label>G · 0-255</label><input type="number" id="gN" value="200" min="0" max="255" step="1"><input type="range" id="gR" min="0" max="255" step="1" value="200"></div>
<div class="num-cell"><label>B · 0-255</label><input type="number" id="bN" value="81"  min="0" max="255" step="1"><input type="range" id="bR" min="0" max="255" step="1" value="81"></div>
<div class="num-cell"><label>A · 0-255</label><input type="number" id="aN" value="255" min="0" max="255" step="1"><input type="range" id="aR" min="0" max="255" step="1" value="255"></div>
</div>
<div class="num-grid-3">
<div class="num-cell"><label>H · 0-360°</label><input type="number" id="hN" value="46" min="0" max="360" step="1"><input type="range" id="hR" min="0" max="360" step="1" value="46"></div>
<div class="num-cell"><label>S · 0-100%</label><input type="number" id="sN" value="66" min="0" max="100" step="1"><input type="range" id="sR" min="0" max="100" step="1" value="66"></div>
<div class="num-cell"><label>V · 0-100%</label><input type="number" id="vN" value="94" min="0" max="100" step="1"><input type="range" id="vR" min="0" max="100" step="1" value="94"></div>
</div>

<h2 style="margin-top: 14px;">游戏命名颜色 / Named Colors</h2>
<div class="hint" style="margin-bottom:6px;">前 8 个有专属 BBCode 标签（<code>[gold]文本[/gold]</code>），其余只能用 <code>[color=#XXXXXX]</code></div>
<div class="preset-grid" id="presetGrid"></div>
</div>

<div class="panel">
<h2>游戏内文字预览 / In-Game Preview</h2>

<div class="row" style="margin-bottom:10px;">
<label>文本</label>
<textarea id="previewText" class="preview-text-input" rows="3" style="flex:1;">Deal [gold]12[/gold] damage. Gain [blue]5[/blue] [gold]Block[/gold].</textarea>
</div>

<div class="toggle-row">
<label class="toggle"><input type="checkbox" id="fxBold"> [b] Bold</label>
<label class="toggle"><input type="checkbox" id="fxItalic"> [i] Italic</label>
<label class="toggle"><input type="checkbox" id="fxJitter"> [jitter]</label>
<label class="toggle"><input type="checkbox" id="fxSine"> [sine]</label>
<label class="toggle"><input type="checkbox" id="fxFadeIn"> [fade_in]</label>
<label class="toggle"><input type="checkbox" id="fxFlyIn"> [fly_in]</label>
<label class="toggle"><input type="checkbox" id="fxThinkyDots"> [thinky_dots]</label>
</div>

<div class="preview-stage" id="previewStage">
<span class="preview-stage-label">CARD TEXT</span>
<div id="previewRender"></div>
</div>

<div class="hint" style="margin-top:8px;">
以 Kreon 字体在卡牌羊皮纸底色上渲染 — 与游戏中 <code>NCard</code> / <code>MegaRichTextLabel</code> 的视觉一致。
颜色取自 <code>StsColors.cs</code>；<code>[jitter]</code>/<code>[sine]</code> 模拟字符位移动效。
</div>
</div>
</div>
</section>

<section class="section">
<div class="grid-2">

<div class="panel">
<h2>代码片段 / Code Snippets</h2>
<div class="tabs">
<button class="tab active" data-tab="code-bbcode">BBCode</button>
<button class="tab" data-tab="code-bbnamed">Named</button>
<button class="tab" data-tab="code-cs">C#</button>
<button class="tab" data-tab="code-csf">C# float</button>
<button class="tab" data-tab="code-gd">GDScript</button>
<button class="tab" data-tab="code-sts">StsColors</button>
<button class="tab" data-tab="code-json">JSON</button>
<button class="tab" data-tab="code-css">CSS</button>
</div>
<div class="tab-panel active" id="tab-code-bbcode"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeBBCode" aria-label="复制代码" title="复制代码"></button><code id="codeBBCode" data-lang="bbcode"></code></pre></div>
<div class="tab-panel" id="tab-code-bbnamed"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeBBNamed" aria-label="复制代码" title="复制代码"></button><code id="codeBBNamed" data-lang="bbcode"></code></pre></div>
<div class="tab-panel" id="tab-code-cs"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeCSharp" aria-label="复制代码" title="复制代码"></button><code id="codeCSharp" data-lang="csharp"></code></pre></div>
<div class="tab-panel" id="tab-code-csf"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeCSharpF" aria-label="复制代码" title="复制代码"></button><code id="codeCSharpF" data-lang="csharp"></code></pre></div>
<div class="tab-panel" id="tab-code-gd"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeGD" aria-label="复制代码" title="复制代码"></button><code id="codeGD" data-lang="gdscript"></code></pre></div>
<div class="tab-panel" id="tab-code-sts"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeSts" aria-label="复制代码" title="复制代码"></button><code id="codeSts" data-lang="csharp"></code></pre></div>
<div class="tab-panel" id="tab-code-json"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeJson" aria-label="复制代码" title="复制代码"></button><code id="codeJson" data-lang="json"></code></pre></div>
<div class="tab-panel" id="tab-code-css"><pre class="code"><button class="copy kira-codeblock-copy-wrapper" type="button" data-target="codeCss" aria-label="复制代码" title="复制代码"></button><code id="codeCss" data-lang="css"></code></pre></div>
</div>

<div class="panel">
<h2>颜色格式转换 / Conversions</h2>
<table class="conv">
<tr><td>HEX (6)</td><td id="cHex6"></td></tr>
<tr><td>HEX (8 + Alpha)</td><td id="cHex8"></td></tr>
<tr><td>RGB</td><td id="cRgb"></td></tr>
<tr><td>RGBA</td><td id="cRgba"></td></tr>
<tr><td>HSL</td><td id="cHsl"></td></tr>
<tr><td>HSV</td><td id="cHsv"></td></tr>
<tr><td>Godot Color(str)</td><td id="cGodotStr"></td></tr>
<tr><td>Godot 0-1 floats</td><td id="cFloats"></td></tr>
<tr><td>反色 (complement)</td><td id="cComp"></td></tr>
<tr><td>亮度 (luminance)</td><td id="cLum"></td></tr>
<tr><td>对比文本色</td><td id="cContrast"></td></tr>
</table>
</div>
</div>

<div class="panel" style="margin-top:16px;">
<h2>反向解析 / Reverse Parse</h2>
<div class="hint" style="margin-bottom:6px;">
粘贴任意 <code>[color=#XX]</code>、<code>new Color("…")</code>、<code>Color(1,0.5,0.3)</code>、<code>rgba(…)</code>，自动识别。
</div>
<textarea id="reverseInput" placeholder='例: [color=#FF5555]Strike[/color]&#10;new Color("EFC851")&#10;Color(1, 0.78, 0.32)&#10;rgba(255, 120, 160, 1)'></textarea>
<div id="reverseResult" class="hint" style="margin-top:6px;"></div>
</div>
</section>
<div class="toast" id="toast"></div>
</div>

<script src="../preview-assets/preview-tools.js?v=20260523-cardfit1"></script>
