/* ============================================================
 *  경기고등학교 방송부(KGBS) 신입부원 선발 결과 조회 — 동작 스크립트
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
  var inputShell = input ? input.closest(".input-shell") : null;
  var errorBox = $("#form-error");
  var lastId = "";

  /* ---------------- 유틸 ---------------- */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function nl2br(str) { return esc(str).replace(/\n/g, "<br>"); }

  /* ---------------- 초기 화면 채우기 ---------------- */
  function fillStaticContent() {
    var notices = DATA.notices || [];
    var noticeList = $("#notice-list");
    if (noticeList && notices.length) {
      noticeList.innerHTML = notices.map(function (t) {
        return "<li>" + t + "</li>"; // data.js 의 문구만 사용 (굵게 표시용 HTML 허용)
      }).join("");
    }

    var schedule = DATA.schedule || [];
    var scheduleList = $("#schedule-list");
    if (scheduleList && schedule.length) {
      scheduleList.innerHTML = schedule.map(function (s) {
        return '<li' + (s.current ? ' class="is-current"' : "") + ">" +
          '<span class="s-date">' + esc(s.date) + "</span>" +
          '<span class="s-label">' + esc(s.label) + "</span>" +
          "</li>";
      }).join("");
    }

    var contact = $("#contact-text");
    if (contact && DATA.contact) contact.innerHTML = nl2br(DATA.contact);

    var guide = $("#test-guide");
    if (guide && DATA.showExamples && DATA.examples) {
      var pass = (DATA.examples.pass || []).join(" · ");
      var fail = (DATA.examples.fail || []).join(" · ");
      guide.innerHTML =
        "테스트용 예시 학번 &nbsp;|&nbsp; 합격 <strong class=\"t-pass\">" + esc(pass) + "</strong>" +
        (fail ? " &nbsp;·&nbsp; 불합격 <strong class=\"t-fail\">" + esc(fail) + "</strong>" : "") +
        '<br><span style="opacity:.7">실제 명단은 data.js 에서 교체할 수 있습니다.</span>';
    } else if (guide) {
      guide.hidden = true;
    }
  }

  /* ---------------- 오류 표시 ---------------- */
  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
    if (inputShell) inputShell.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.hidden = true;
    errorBox.textContent = "";
    if (inputShell) inputShell.classList.remove("is-invalid");
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
    var value = String(rawValue || "").replace(/\s+/g, "");
    if (!value) { showError("학번을 입력해 주세요."); input.focus(); return; }
    if (!/^\d{5}$/.test(value)) { showError("학번은 숫자 5자리로 입력해 주세요. (예: 10101)"); input.focus(); return; }

    clearError();
    lastId = value;
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
    stopConfetti();
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

  /* ---------------- 결과: 합격 ---------------- */
  function renderPass(a) {
    var m = (DATA.messages && DATA.messages.pass) || {};
    var meta = DATA.meta || {};
    var html =
      '<div class="wrap">' +
        '<div class="result-head">' +
          '<span class="result-eyebrow">' + esc(m.eyebrow || "선발 결과 안내") + "</span>" +
          "<h2>선발 결과가 확인되었습니다</h2>" +
          "<p>" + esc(meta.year || "") + " " + esc(meta.club || "방송부") + " 신입부원 선발</p>" +
        "</div>" +

        '<article class="certificate" role="document" aria-label="합격 통지서">' +
          '<div class="cert-inner">' +
            '<svg class="cert-emblem" viewBox="0 0 72 82" aria-hidden="true">' +
              '<defs><linearGradient id="certGold" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#f0dfa2"/><stop offset="45%" stop-color="#c8a951"/>' +
                '<stop offset="100%" stop-color="#9a7b2e"/></linearGradient></defs>' +
              '<path d="M36 3 66 12v26c0 19-13 31-30 37C19 69 6 57 6 38V12z" fill="none" stroke="url(#certGold)" stroke-width="2.4"/>' +
              '<g fill="none" stroke="url(#certGold)" stroke-linecap="round">' +
                '<path d="M26 27.5a14 14 0 0 1 20 0" stroke-width="2"/>' +
                '<path d="M31 32.5a8 8 0 0 1 10 0" stroke-width="1.8"/>' +
                '<circle cx="36" cy="38.5" r="3" fill="url(#certGold)" stroke="none"/>' +
                '<path d="M27 47h18" stroke-width="1.6"/><path d="M30 52h12" stroke-width="1.6"/>' +
              "</g>" +
              '<text x="36" y="63" text-anchor="middle" font-family="Georgia, serif" font-size="9.5" letter-spacing="1.6" fill="url(#certGold)">KGBS</text>' +
            "</svg>" +
            '<p class="cert-org">' + esc(meta.school || "") + " " + esc(meta.club || "") + "</p>" +
            '<h3 class="cert-heading">' + esc(m.heading || "합격 통지서") + "</h3>" +
            '<p class="cert-subline">CERTIFICATE OF ADMISSION</p>' +
            '<p class="cert-lead"><strong>' + esc(m.lead || "") + "</strong></p>" +
            '<p class="cert-body">' + nl2br(m.body || "") + "</p>" +

            '<table class="cert-table">' +
              "<caption class=\"sr-only\">지원자 정보</caption>" +
              "<tbody>" +
                "<tr><th scope=\"row\">성명</th><td>" + esc(a.name) + "</td></tr>" +
                "<tr><th scope=\"row\">학번</th><td><span class=\"value-id\">" + esc(a.studentId) + "</span></td></tr>" +
                "<tr><th scope=\"row\">배정 파트</th><td><span class=\"value-part\">" + esc(a.part || "미배정") + "</span></td></tr>" +
              "</tbody>" +
            "</table>" +

            '<div class="cert-ot">' +
              "<h4>" + esc(m.otTitle || "안내") + "</h4>" +
              "<p>" + nl2br(m.ot || "") + "</p>" +
            "</div>" +

            '<div class="cert-stamp" aria-label="직인">' +
              "합격<span>KGBS</span>" +
            "</div>" +

            '<p class="cert-sign">' +
              '<span class="cert-sign-authority">' + esc(meta.school || "") + " " + esc(meta.club || "") + "장</span>" +
              "<small>KYUNGGI HIGH SCHOOL BROADCASTING SYSTEM</small>" +
            "</p>" +
          "</div>" +
        "</article>" +

        '<div class="result-actions">' +
          '<button type="button" class="btn btn-ghost" data-action="back">다시 조회하기</button>' +
          '<button type="button" class="btn btn-gold" data-action="print">합격통지서 인쇄</button>' +
        "</div>" +
      "</div>";

    showResult(html);
    launchConfetti();
  }

  /* ---------------- 결과: 불합격 ---------------- */
  function renderFail(a) {
    var m = (DATA.messages && DATA.messages.fail) || {};
    var html =
      '<div class="wrap">' +
        '<div class="result-head">' +
          '<span class="result-eyebrow">선발 결과 안내</span>' +
          "<h2>선발 결과가 확인되었습니다</h2>" +
          "<p>학번 " + esc(a.studentId) + "</p>" +
        "</div>" +
        '<div class="plain-card" role="document">' +
          '<div class="plain-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M4 7.5 12 13l8-5.5"/><rect x="3" y="5" width="18" height="14" rx="2"/>' +
            "</svg>" +
          "</div>" +
          "<h2>" + esc(m.title || "선발 결과 안내") + "</h2>" +
          '<p class="plain-lead">' + nl2br(m.lead || "") + "</p>" +
          '<p class="plain-sub">' + nl2br(m.sub || "") + "</p>" +
        "</div>" +
        '<div class="result-actions">' +
          '<button type="button" class="btn btn-ghost" data-action="back">다시 조회하기</button>' +
        "</div>" +
      "</div>";

    showResult(html);
    stopConfetti();
  }

  /* ---------------- 결과: 미등록 학번 ---------------- */
  function renderNotFound(value) {
    var m = (DATA.messages && DATA.messages.notFound) || {};
    var html =
      '<div class="wrap">' +
        '<div class="result-head">' +
          '<span class="result-eyebrow">조회 결과</span>' +
          "<h2>입력하신 정보를 확인해 주세요</h2>" +
        "</div>" +
        '<div class="plain-card" role="alert">' +
          '<div class="plain-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">' +
              '<circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/>' +
            "</svg>" +
          "</div>" +
          "<h2>" + esc(m.title || "조회 결과가 없습니다") + "</h2>" +
          '<p class="plain-lead">학번 <span class="id-chip">' + esc(value) + "</span> 에 해당하는 지원 정보를 찾을 수 없습니다.<br>" +
            "학번을 다시 한 번 확인해 주시기 바랍니다.</p>" +
          '<p class="plain-sub">' + nl2br(m.sub || "") + "</p>" +
        "</div>" +
        '<div class="result-actions">' +
          '<button type="button" class="btn btn-ghost" data-action="back">다시 조회하기</button>' +
        "</div>" +
      "</div>";

    showResult(html);
    stopConfetti();
  }

  /* ---------------- 축하 효과 ---------------- */
  var confettiTimer = null;
  function launchConfetti() {
    var layer = $("#confetti-layer");
    if (!layer) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stopConfetti();
    var colors = ["#c8a951", "#e6d191", "#1b4e8c", "#7fa7d4", "#0b2545", "#ffffff"];
    var count = window.innerWidth < 640 ? 46 : 74;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      var size = 5 + Math.random() * 6;
      piece.style.left = (Math.random() * 100).toFixed(2) + "%";
      piece.style.width = size.toFixed(1) + "px";
      piece.style.height = (size * (Math.random() < .35 ? 1 : 1.7)).toFixed(1) + "px";
      piece.style.background = colors[(Math.random() * colors.length) | 0];
      piece.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);
      if (Math.random() < .3) piece.style.borderRadius = "50%";
      piece.style.setProperty("--drift", ((Math.random() - 0.5) * 220).toFixed(0) + "px");
      piece.style.setProperty("--spin", ((Math.random() * 720 + 180) | 0) + "deg");
      piece.style.animationDuration = (2.4 + Math.random() * 1.6).toFixed(2) + "s";
      piece.style.animationDelay = (Math.random() * 0.55).toFixed(2) + "s";
      frag.appendChild(piece);
    }
    layer.appendChild(frag);

    confettiTimer = window.setTimeout(stopConfetti, 4600);
  }

  function stopConfetti() {
    if (confettiTimer) { window.clearTimeout(confettiTimer); confettiTimer = null; }
    var layer = $("#confetti-layer");
    if (layer) layer.innerHTML = "";
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
      // 숫자만 남기기 (붙여넣기 포함)
      var cleaned = input.value.replace(/[^\d]/g, "").slice(0, 5);
      if (cleaned !== input.value) input.value = cleaned;
      if (!errorBox || !errorBox.hidden) clearError();
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

  // 공유 링크(?id=10101)로 들어온 경우 자동 조회
  try {
    var params = new URLSearchParams(location.search);
    var directId = (params.get("id") || "").replace(/[^\d]/g, "");
    if (/^\d{5}$/.test(directId)) {
      input.value = directId;
      lookup(directId);
    } else {
      input.focus({ preventScroll: true });
    }
  } catch (err) {
    /* URLSearchParams 미지원 시 무시 */
  }
})();
