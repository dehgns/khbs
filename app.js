/* ============================================================
 *  경기고등학교 방송부(KHBS) 신입부원 최종 합격자발표 — 동작 스크립트
 *  화면 문구와 명단은 data.js 에서 수정하세요.
 * ============================================================ */
(function () {
  "use strict";

  var DATA = window.SITE_DATA || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  var viewForm = $("#view-form");
  var viewResult = $("#view-result");
  var form = $("#lookup-form");
  var input = $("#student-id");
  var errorBox = $("#form-error");

  /* ---------------- 유틸 ---------------- */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function nl2br(str) { return esc(str).replace(/\n/g, "<br>"); }

  /* ---------------- 초기 화면 ---------------- */
  function fillStaticContent() {
    var notices = DATA.notices || [];
    var list = $("#notice-list");
    if (list && notices.length) {
      list.innerHTML = notices.map(function (n) {
        var text = typeof n === "string" ? n : n.text || "";
        var sub = typeof n === "string" ? "" : n.sub || "";
        return "<li>" + text + (sub ? '<span class="notice-sub">' + esc(sub) + "</span>" : "") + "</li>";
      }).join("");
    }

    var ex = DATA.examples || {};
    var exList = $("#example-list");
    var exPanel = $("#examples-panel");
    if (!DATA.showExamples) {
      if (exPanel) exPanel.hidden = true;
      var exBtn = $('[data-toggle="examples"]');
      if (exBtn) exBtn.hidden = true;
      var sep = $(".mini-sep");
      if (sep) sep.hidden = true;
    } else if (exList) {
      var rows = [];
      (ex.pass || []).forEach(function (id) {
        rows.push('<li><span class="ex-id">' + esc(id) + '</span><span class="ex-res ex-res-pass">합격</span></li>');
      });
      (ex.fail || []).forEach(function (id) {
        rows.push('<li><span class="ex-id">' + esc(id) + '</span><span class="ex-res ex-res-fail">불합격</span></li>');
      });
      exList.innerHTML = rows.join("");
    }
  }

  /* ---------------- 작은 안내 패널 ---------------- */
  function initToggles() {
    document.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("data-toggle") + "-panel");
        if (!panel) return;
        var open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) btn.style.color = "var(--navy)";
        else btn.style.color = "";
      });
    });
  }

  /* ---------------- 오류 표시 ---------------- */
  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.hidden = true;
    errorBox.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  /* ---------------- 조회 ---------------- */
  function findApplicant(id) {
    var list = DATA.applicants || [];
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].studentId).trim() === id) return list[i];
    }
    return null;
  }

  function lookup(rawValue) {
    var value = String(rawValue || "").replace(/\D/g, "");
    if (!value) { showError("학번을 입력해 주세요."); return; }
    if (value.length !== 5) { showError("학번은 숫자 5자리로 입력해 주세요. (예: 10101)"); return; }

    clearError();
    var applicant = findApplicant(value);
    if (!applicant) renderNotFound(value);
    else if (applicant.result === "pass") renderPass(applicant);
    else renderFail(applicant);
  }

  /* ---------------- 화면 전환 ---------------- */
  function showResult(html) {
    viewResult.innerHTML = html;
    viewForm.hidden = true;
    viewResult.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToForm() {
    viewResult.hidden = true;
    viewResult.innerHTML = "";
    viewForm.hidden = false;
    input.value = "";
    clearError();
    try {
      var url = new URL(location.href);
      url.searchParams.delete("id");
      if (history.replaceState) {
        history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
      }
    } catch (err) { /* 무시 */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
    input.focus({ preventScroll: true });
  }

  function headHtml(eyebrow, title, idText) {
    return '<div class="result-head">' +
      '<span class="result-eyebrow">' + esc(eyebrow) + "</span>" +
      "<h2>" + esc(title) + "</h2>" +
      (idText ? '<p class="result-id">학번 ' + esc(idText) + "</p>" : "") +
      "</div>";
  }

  function backButtonHtml(primaryFirst) {
    var back = '<button type="button" class="btn btn-line" data-action="back">다시 조회</button>';
    var print = '<button type="button" class="btn btn-primary" data-action="print">인쇄</button>';
    return '<div class="result-actions">' + (primaryFirst ? print + back : back) + "</div>";
  }

  /* ---------------- 결과: 합격 ---------------- */
  function renderPass(a) {
    var m = (DATA.messages && DATA.messages.pass) || {};
    var meta = DATA.meta || {};
    var eyebrow = (meta.year || "") + " " + (meta.school || "") + " " + (meta.club || "") + " 신입부원 최종 합격자발표";

    var html = '<div class="panel">' +
      headHtml(eyebrow, m.title || "합격을 축하합니다", a.studentId) +
      '<p class="result-lead">' + nl2br(m.lead || "") + "</p>" +
      '<table class="result-table">' +
        "<caption class=\"sr-only\">지원자 정보</caption>" +
        "<tbody>" +
          '<tr><th scope="row">학번</th><td>' + esc(a.studentId) + "</td></tr>" +
          '<tr><th scope="row">성명</th><td>' + esc(a.name) + "</td></tr>" +
          '<tr><th scope="row">배정 파트</th><td>' + esc(a.part || "미배정") + "</td></tr>" +
        "</tbody>" +
      "</table>" +
      '<div class="result-note">' +
        "<h3>" + esc(m.otTitle || "안내") + "</h3>" +
        "<p>" + nl2br(m.ot || "") + "</p>" +
      "</div>" +
      backButtonHtml(true) +
    "</div>";

    showResult(html);
  }

  /* ---------------- 결과: 불합격 ---------------- */
  function renderFail(a) {
    var m = (DATA.messages && DATA.messages.fail) || {};
    var meta = DATA.meta || {};
    var eyebrow = (meta.year || "") + " " + (meta.school || "") + " " + (meta.club || "") + " 신입부원 최종 합격자발표";

    var html = '<div class="panel">' +
      headHtml(eyebrow, m.title || "선발 결과 안내", a.studentId) +
      '<p class="result-lead">' + nl2br(m.lead || "") + "</p>" +
      (m.sub ? '<p class="result-sub">' + nl2br(m.sub) + "</p>" : "") +
      backButtonHtml(false) +
    "</div>";

    showResult(html);
  }

  /* ---------------- 결과: 미등록 학번 ---------------- */
  function renderNotFound(value) {
    var m = (DATA.messages && DATA.messages.notFound) || {};

    var html = '<div class="panel">' +
      headHtml("조회 결과", m.title || "조회 결과가 없습니다", "") +
      '<p class="result-lead">학번 <span class="id-chip">' + esc(value) + "</span> 에 해당하는 지원 정보를 찾을 수 없습니다.\n" +
        "학번을 다시 한 번 확인해 주시기 바랍니다.</p>" +
      (m.sub ? '<p class="result-sub">' + nl2br(m.sub) + "</p>" : "") +
      backButtonHtml(false) +
    "</div>";

    showResult(html);
  }

  /* ---------------- 이벤트 ---------------- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      lookup(input.value);
    });
  }

  if (input) {
    input.addEventListener("input", function () {
      var cleaned = input.value.replace(/[^\d]/g, "").slice(0, 5);
      if (cleaned !== input.value) input.value = cleaned;
      if (errorBox && !errorBox.hidden) clearError();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        lookup(input.value);
      }
    });
  }

  if (viewResult) {
    viewResult.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      if (action === "back") backToForm();
      if (action === "print") window.print();
    });
  }

  /* ---------------- 시작 ---------------- */
  fillStaticContent();
  initToggles();

  try {
    var params = new URLSearchParams(location.search);
    var directId = (params.get("id") || "").replace(/\D/g, "");
    if (directId.length === 5) {
      input.value = directId;
      lookup(directId);
    }
  } catch (err) {
    /* URLSearchParams 미지원 시 무시 */
  }
})();
