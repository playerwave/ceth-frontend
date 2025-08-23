// utils/ocrHelper.ts
export interface OcrResultData {
  fullName: string;
  courseName: string;
  teacher: string;
  certificateId: string;
  rawText: string;
  date: string;
}

/* ---------------- Preprocess ---------------- */
function stripFigureBlocks(s: string) {
  return s.replace(/<figure[\s\S]*?<\/figure>/gi, " ");
}
function stripHtmlTags(s: string) {
  return s.replace(/<[^>]+>/g, " ");
}
function stripMarkdown(s: string) {
  return s
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1");
}
function normalizeWhitespace(s: string) {
  return s.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").replace(/\s+\n/g, "\n");
}

/* ---------------- Helpers ---------------- */
function isDateLike(s: string) {
  const str = (s || "").trim();
  return (
    /(on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4}/i.test(
      str
    ) ||
    /^\d{1,2}\s*[\/\-]\s*\d{1,2}\s*[\/\-]\s*\d{2,4}$/.test(str) ||
    /\b\d{4}\b/.test(str)
  );
}

function isLikelyCourse(s: string) {
  const str = (s || "").trim();
  const courseHints =
    /(course|completed|communicative|english|design|presentation|basic|media|subject|mooc|massive open online course)/i;
  const thaiCourseHints = /(การ|หลักสูตร|วิชา|รายวิชา|คอร์ส|ทักษะ)/;
  const hasLongDigits = /\b\d{5,}\b/.test(str);
  return courseHints.test(str) || thaiCourseHints.test(str) || hasLongDigits;
}

function isLikelyName(s: string) {
  const str = (s || "").replace(/^\(|\)$/g, "").trim();
  const noDigits = !/\d/.test(str);
  const hasThai = /[ก-๙]{2,}/.test(str);
  const hasLatinFullName = /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(str);
  const hasTitle =
    /(Miss|Mr\.|Mrs\.|Dr\.|Prof\.|Professor|Assistant|Assoc\.?\s*Prof\.?|รศ\.|ผศ\.|ศาสตราจารย์|อาจารย์|ดร\.)/i.test(
      str
    );
  return noDigits && !isDateLike(str) && !isLikelyCourse(str) && (hasThai || hasLatinFullName || hasTitle);
}

function isBoundaryForCourse(s: string) {
  return (
    isDateLike(s) ||
    /(On\s+|Signed|Signature|Department|Head|Dean|presented to|Certificate ID|Reason:)/i.test(s || "")
  );
}

function collectCourseBlock(lines: string[], startIdx: number, lookAhead = 4) {
  const acc: string[] = [];
  for (let i = 1; i <= lookAhead; i++) {
    const s = (lines[startIdx + i] || "").trim();
    if (!s) break;
    if (isBoundaryForCourse(s)) break;
    if (isLikelyCourse(s) && !isLikelyName(s)) acc.push(s);
  }
  if (acc.length === 0) return "";
  return acc.join(" ");
}

function combineCourse(first: string, tail: string) {
  if (!tail) return first;
  if (/\([^)]+\)\s*$/i.test(first)) {
    return first.replace(/\)\s*$/i, ` ${tail})`);
  }
  return `${first} (${tail})`;
}

function pickNeighborAbove(lines: string[], anchorIdx: number, depth = 3) {
  const windowAbove: string[] = [];
  for (let i = 1; i <= depth; i++) {
    const v = lines[anchorIdx - i];
    if (v) windowAbove.push(v.replace(/^\(|\)$/g, "").trim());
  }
  const picked = windowAbove.find((s) => isLikelyName(s));
  return picked || "-";
}

/* ---- Thai date → English ---- */
const THAI_MONTHS: Record<string, string> = {
  มกราคม: "January",
  กุมภาพันธ์: "February",
  มีนาคม: "March",
  เมษายน: "April",
  พฤษภาคม: "May",
  มิถุนายน: "June",
  กรกฎาคม: "July",
  สิงหาคม: "August",
  กันยายน: "September",
  ตุลาคม: "October",
  พฤศจิกายน: "November",
  ธันวาคม: "December",
};
function parseThaiDateToEnglish(s: string): string | null {
  const m = s.match(/วันที่?\s*(\d{1,2})\s+([ก-๙]+)\s+(\d{4})/);
  if (!m) return null;
  const d = parseInt(m[1], 10);
  const monthTh = m[2];
  const yearTh = parseInt(m[3], 10);
  const monthEn = THAI_MONTHS[monthTh];
  if (!monthEn) return null;
  const year = yearTh > 2400 ? yearTh - 543 : yearTh;
  return `${monthEn} ${d}, ${year}`;
}

/* ---- Cleanup course name ---- */
function cleanupCourseName(s: string) {
  let t = (s || "").trim();

  // ตัดคำเกริ่นก่อนชื่อคอร์ส (THAI MOOC)
  t = t.replace(
    /^[^()\n]*?(?:ออนไลน์จนได้รับประกาศนียบัตร(?:ใน)?รายวิชา|ได้ผ่านเกณฑ์(?:หลักสูตร)?ออนไลน์จนได้รับประกาศนียบัตร(?:ใน)?รายวิชา|ในรายวิชา|รายวิชา)\s*[:\-]?\s*/i,
    ""
  );

  // ลบวงเล็บที่เป็น "จำนวนชั่วโมง" เท่านั้น
  t = t.replace(/\(\s*\d+\s*(?:ชั่วโมง|ชม\.?|hours?)\s*\)/gi, "");

  // จัดช่องว่างขอบวงเล็บให้ปกติ เช่น "( ชื่อ )" -> "(ชื่อ)"
  t = t.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");

  // ✅ ถ้าทั้งสตริงถูกห่อด้วยวงเล็บ และด้านใน "ไม่มีตัวอักษรอังกฤษ/คำว่า Basic"
  //    ให้แกะวงเล็บนอกสุดออก (เคส: "(ทักษะการสื่อสารระหว่างบุคคลในการทำงาน )")
  const unwrapIfThaiOnly = () => {
    const m = t.match(/^\((.+)\)$/);
    if (!m) return;
    const inner = m[1].trim();
    const hasEnglish = /[A-Za-z]/.test(inner);
    const hasBasic = /\bBasic\b/i.test(inner);
    if (!hasEnglish && !hasBasic) {
      t = inner; // แกะวงเล็บ
    }
  };
  unwrapIfThaiOnly();

  // แก้วงเล็บซ้ำจาก OCR เช่น ")))"
  t = t.replace(/\)\)+$/g, ")");

  // ช่องว่างซ้ำ
  t = t.replace(/\s{2,}/g, " ").trim();

  return t;
}


/* ---------------------------------------- */

export async function callBuuOcr(file: File): Promise<OcrResultData> {
  const formData = new FormData();
  formData.append("file", file);

      const res = await fetch("/api/ocr", { // ✅ ใช้ relative path
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  let rawContent =
    (data.results?.[0]?.message?.choices?.[0]?.message?.content as string) || "";

  if (rawContent.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(rawContent);
      rawContent = (obj.natural_text as string) || rawContent;
    } catch {}
  }

  rawContent = normalizeWhitespace(stripMarkdown(stripHtmlTags(stripFigureBlocks(rawContent))));

  const lines = rawContent
    .split(/\n/)
    .map((l: string) => l.trim())
    .filter(Boolean);

  /* ===== Full Name ===== */
  let fullName = "-";
  const iPresented = lines.findIndex((l) => l.toLowerCase().includes("presented to"));
  if (iPresented !== -1) {
    for (let i = iPresented + 1; i < iPresented + 4 && i < lines.length; i++) {
      const cand = lines[i];
      if (cand && !isLikelyCourse(cand) && !/successfully completed/i.test(cand)) {
        fullName = cand;
        break;
      }
    }
  }
  if (fullName === "-") {
    const iShow = lines.findIndex((l) => /แสดงว่า/.test(l));
    if (iShow !== -1) {
      for (let i = iShow + 1; i < iShow + 4 && i < lines.length; i++) {
        const cand = lines[i];
        if (cand && !isLikelyCourse(cand)) {
          fullName = cand;
          break;
        }
      }
    }
  }

  /* ===== Course Name ===== */
  let courseName = "-";
  const numIdx = lines.findIndex((l) => /^\d{6,}/.test(l));
  if (numIdx !== -1) {
    const first = lines[numIdx].replace(/^\d+\s*/, "");
    const tail = collectCourseBlock(lines, numIdx, 4);
    courseName = combineCourse(first, tail);
  } else {
    const idxCompleted = lines.findIndex((l) => /successfully completed/i.test(l));
    if (idxCompleted !== -1) {
      const firstCandidate = (lines[idxCompleted + 1] || "").trim();
      const tail = collectCourseBlock(lines, idxCompleted + 1, 4);
      if (firstCandidate && isLikelyCourse(firstCandidate) && !isLikelyName(firstCandidate)) {
        courseName = combineCourse(firstCandidate, tail);
      } else if (tail) {
        courseName = tail;
      }
    }
    if (courseName === "-") {
      const idxCtx = lines.findIndex((l) => /(ในรายวิชา|รายวิชา|หลักสูตร)/.test(l));
      if (idxCtx !== -1) {
        const sameLine = lines[idxCtx].replace(/^.*?(ในรายวิชา|รายวิชา|หลักสูตร)\s*/, "").trim();
        if (sameLine && isLikelyCourse(sameLine)) {
          const tail = collectCourseBlock(lines, idxCtx, 3);
          courseName = combineCourse(sameLine, tail);
        } else {
          const first = (lines[idxCtx + 1] || "").trim();
          const tail = collectCourseBlock(lines, idxCtx + 1, 3);
          if (first && isLikelyCourse(first) && !isLikelyName(first)) {
            courseName = combineCourse(first, tail);
          } else if (tail) {
            courseName = tail;
          }
        }
      }
    }
  }
  if (courseName === "-") {
    const anyIdx = lines.findIndex((l) => isLikelyCourse(l) && !isBoundaryForCourse(l));
    if (anyIdx !== -1) {
      const first = lines[anyIdx];
      const tail = collectCourseBlock(lines, anyIdx, 3);
      courseName = combineCourse(first, tail);
    }
  }
  // ✅ cleanup
  courseName = cleanupCourseName(courseName);

  /* ===== Teacher ===== */
  let teacher = "-";
  const directTeacher = lines.find((l) =>
    /(Miss|Mr\.|Mrs\.|Dr\.|Prof\.|Professor|รศ\.|ผศ\.|ศาสตราจารย์|อาจารย์|ดร\.)/i.test(l)
  );
  if (directTeacher && isLikelyName(directTeacher)) {
    teacher = directTeacher.replace(/^\(|\)$/g, "");
  } else {
    const idxDept = lines.findIndex((l) => /(Department|Head|Dean|ภาควิชา|คณะ)/i.test(l));
    if (idxDept !== -1) {
      const picked = pickNeighborAbove(lines, idxDept, 3);
      if (picked !== "-" && !isLikelyCourse(picked)) teacher = picked;
    }
    if (teacher === "-") {
      const idxSigned = lines.findIndex((l) => /Signed/i.test(l));
      if (idxSigned !== -1) {
        const picked = pickNeighborAbove(lines, idxSigned, 2);
        if (picked !== "-" && !isLikelyCourse(picked)) teacher = picked;
      }
    }
    if (teacher === "-") {
      const parenName = lines
        .map((l) => (l.match(/\(([^)]+)\)/)?.[1] || "").trim())
        .find((x) => x && isLikelyName(x) && !isLikelyCourse(x));
      if (parenName) teacher = parenName;
    }
  }

  /* ===== Certificate ID ===== */
  let certificateId =
    rawContent.match(/Certificate ID.*?([A-Za-z0-9]{8,})/i)?.[1] || "-";
  if (certificateId === "-") {
    const idxHint = lines.findIndex((l) => /(Date:|Reason:)/i.test(l));
    for (let i = Math.max(0, idxHint - 3); i <= Math.min(lines.length - 1, idxHint + 5); i++) {
      const m = (lines[i] || "").match(/^[A-Za-z0-9]{6,}$/);
      if (m) {
        certificateId = m[0];
        break;
      }
    }
  }

  /* ===== Date ===== */
  let date = "-";
  const mOn = rawContent.match(/On\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
  if (mOn) date = mOn[1];
  if (date === "-") {
    const mIso = rawContent.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
    if (mIso) {
      const [y, m, d] = mIso[1].split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      const en = dt.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
      date = en;
    }
  }
  if (date === "-") {
    const linesThaiDate = lines.find((l) => /วันที่\s*\d{1,2}\s*[ก-๙]+\s*\d{4}/.test(l));
    if (linesThaiDate) {
      const parsed = parseThaiDateToEnglish(linesThaiDate);
      if (parsed) date = parsed;
    }
  }

  return {
    fullName,
    courseName,
    teacher,
    certificateId,
    rawText: rawContent,
    date,
  };
}
