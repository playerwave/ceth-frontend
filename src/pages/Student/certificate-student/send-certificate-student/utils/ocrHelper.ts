export interface OcrResultData {
  fullName: string;
  courseName: string;
  teacher: string;
  certificateId: string;
  rawText: string;
  date: string;
}

export async function callBuuOcr(file: File): Promise<OcrResultData> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5090/api/ocr", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // raw content OCR
  let rawContent =
    (data.results?.[0]?.message?.choices?.[0]?.message?.content as string) || "";
  if (rawContent.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(rawContent);
      rawContent = obj.natural_text || rawContent;
    } catch (e) {}
  }

  const lines = rawContent.split(/\n/).map((l) => l.trim()).filter(Boolean);

  // ========== BUU Parser ==========
  let fullName = "-";
  let courseName = "-";

  // full name: หลัง presented to
  const iPresented = lines.findIndex((l) =>
    l.toLowerCase().includes("presented to")
  );
  if (iPresented !== -1) {
    fullName = lines[iPresented + 1] || "-";
  }

  // course name
  // (1) เริ่มด้วยรหัสหลักสูตร
  const numIdx = lines.findIndex((l) => /^\d{6,}/.test(l));
  if (numIdx !== -1) {
    courseName = lines[numIdx].replace(/^\d+\s*/, "");
  } else {
    // (2) fallback หลังประโยคภาษาอังกฤษ
    const idxEng = lines.findIndex((l) =>
      /successfully completed/.test(l.toLowerCase())
    );
    if (idxEng !== -1) {
      courseName = lines[idxEng + 1] || "-";
    }
  }

  // teacher / signer
  let teacher = "-";
  const thaiTeach = lines.find((l) => /ผู้|ศาสตร/.test(l));
  if (thaiTeach) {
    teacher = thaiTeach;
  } else {
    const idxSigned = lines.findIndex((l) => /(Signed|Department)/i.test(l));
    if (idxSigned !== -1 && lines[idxSigned - 1]) {
      teacher = lines[idxSigned - 1];
    }
  }
  teacher = teacher.replace(/^\(|\)$/g, ""); // remove ()

  // Certificate ID
  const certificateId =
    rawContent.match(/Certificate ID.*?([A-Za-z0-9]{8,})/i)?.[1] || "-";

  // Extract date: eg. "On August 2, 2025" --> "August 2, 2025"
  let date = "-";
  const dateMatch = rawContent.match(
    /On\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
  );
  if (dateMatch) {
    date = dateMatch[1];
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
