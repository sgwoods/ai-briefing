
// Steven's takes on the site page (pipeline/takes.py): shown only with his signed link (#takes=<token>, from his
// private takes email). The token never leaves this page except in the form he submits to the mail script, which
// checks it; a visitor without it sees nothing. Boxes go after the day in brief (0), Top of mind (T), each Must-read
// story (its number) and Worth knowing (W); one Submit sends them all.
(function () {
  var started = false;
  function start() {
  if (started) return;
  var m = /(?:^|[#&])takes=([A-Za-z0-9_-]{8,64})/.exec(location.hash || "");
  var s = document.querySelector("script[data-takes]");
  var root = document.getElementById("brief");
  if (!m || !s || !root) return;
  var url = s.getAttribute("data-script"), day = s.getAttribute("data-day");
  if (!/^https:\/\/script\.google\.com\//.test(url || "") || !/^\d{4}-\d{2}-\d{2}$/.test(day || "")) return;
  var boxes = [], inMust = false;
  function add(sec, slot, label) {
    var d = document.createElement("div");
    d.style.cssText = "margin:10px 0 18px;padding:10px 12px;border:1px dashed var(--teal);border-radius:10px";
    var l = document.createElement("div");
    l.textContent = "Your take: " + label + " (" + slot + ")";
    l.style.cssText = "font-size:13px;opacity:.8;margin:0 0 6px";
    var ta = document.createElement("textarea");
    ta.rows = 3; ta.setAttribute("data-slot", slot);
    ta.style.cssText = "width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:8px;border-radius:8px";
    d.appendChild(l); d.appendChild(ta); sec.appendChild(d); boxes.push(ta);
  }
  var secs = root.children;
  for (var i = 0; i < secs.length; i++) {
    var sec = secs[i];
    if (sec.tagName !== "SECTION") continue;
    var h = sec.querySelector("h2, h3");
    if (!h) { if (!boxes.length) add(sec, "0", "the day overall"); continue; }
    var txt = h.textContent.trim().toLowerCase();
    if (h.tagName === "H2") {
      inMust = txt.indexOf("must read") === 0;
      if (txt.indexOf("top of mind") === 0 || txt.indexOf("today in 30 seconds") === 0) add(sec, "T", "Top of mind");
      else if (txt.indexOf("worth knowing") === 0) add(sec, "W", "Worth knowing");
      continue;
    }
    var n = /^(\d{1,2})\./.exec(h.textContent.trim());
    if (inMust && n) add(sec, n[1], "story " + n[1]);
  }
  if (!boxes.length) return;
  var f = document.createElement("form");
  f.method = "POST"; f.action = url;
  f.style.cssText = "position:sticky;bottom:0;padding:12px;background:var(--panel);border-top:1px solid var(--line);z-index:9";
  function hidden(n, v) { var x = document.createElement("input"); x.type = "hidden"; x.name = n; x.value = v; f.appendChild(x); return x; }
  hidden("action", "takes"); hidden("t", m[1]); hidden("d", day);
  var payload = hidden("takes", "{}"), done = hidden("done", "");
  var cb = document.createElement("label");
  cb.style.cssText = "color:var(--ink);font-size:14px;margin-right:12px";
  var c = document.createElement("input"); c.type = "checkbox"; cb.appendChild(c);
  cb.appendChild(document.createTextNode(" Done: send the edition now"));
  var b = document.createElement("button"); b.type = "submit"; b.textContent = "Submit my takes";
  b.style.cssText = "padding:8px 16px;border-radius:999px;border:0;background:var(--teal);color:#fff;font-size:15px";
  f.appendChild(cb); f.appendChild(b);
  f.addEventListener("submit", function () {
    var o = {};
    boxes.forEach(function (ta) { var v = ta.value.trim(); if (v) o[ta.getAttribute("data-slot")] = v.slice(0, 1500); });
    payload.value = JSON.stringify(o); done.value = c.checked ? "1" : "";
  });
  var note = document.createElement("p");
  note.textContent = "Private: your takes for " + day + ". Type after any section, then Submit once. Only you see these boxes.";
  note.style.cssText = "padding:10px 12px;border-radius:10px;background:var(--soft);color:var(--ink);font-size:14px";
  root.insertBefore(note, root.firstChild);
  root.parentNode.insertBefore(f, root.nextSibling);
  started = true;
  }
  start();
  window.addEventListener("hashchange", start);   // an already-open page gets the boxes without a reload
})();
