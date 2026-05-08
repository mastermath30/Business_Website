// One-shot extractor: walks ./sem1 and ./sem2, parses every Office file with
// officeparser, and dumps slide-by-slide text to scripts/slides.json.
//
// Run: node scripts/extract-slides.js
// Output: scripts/slides.json
//
// We use the structured `content` array (one entry per slide) so each
// generated question can carry a real `slide_ref`.

const fs = require("node:fs");
const path = require("node:path");
const { parseOffice } = require("officeparser");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "slides.json");

function flattenSlideText(slide) {
  // slide.children: paragraphs / headings, each with .text and .children
  const lines = [];
  for (const block of slide.children ?? []) {
    if (typeof block.text === "string" && block.text.trim()) {
      lines.push(block.text.trim());
    }
  }
  return lines;
}

async function extractFile(absPath) {
  try {
    const out = await parseOffice(absPath);
    if (!out || !Array.isArray(out.content)) return { error: "no content" };
    const slides = out.content
      .filter((s) => s && s.type === "slide")
      .map((s, i) => ({
        slide_ref: i + 1,
        lines: flattenSlideText(s),
      }));
    return {
      title: out.metadata?.title ?? null,
      slides,
    };
  } catch (e) {
    return { error: e?.message ?? String(e) };
  }
}

async function main() {
  const dirs = [
    { semester: 1, dir: path.join(ROOT, "sem1") },
    { semester: 2, dir: path.join(ROOT, "sem2") },
  ];
  const result = { files: [] };
  for (const { semester, dir } of dirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs
      .readdirSync(dir)
      .filter((f) => /\.(pptx?|key)$/i.test(f))
      .sort();
    for (const filename of entries) {
      const abs = path.join(dir, filename);
      const rel = `/sem${semester}/${filename}`;
      process.stdout.write(`[sem${semester}] ${filename} … `);
      const ext = path.extname(filename).toLowerCase();
      const parsed = await extractFile(abs);
      if (parsed.error) {
        console.log(`✗ ${parsed.error}`);
        result.files.push({
          semester,
          rel_path: rel,
          filename,
          ext,
          error: parsed.error,
          slides: [],
        });
        continue;
      }
      const slideCount = parsed.slides.length;
      const totalLines = parsed.slides.reduce(
        (n, s) => n + s.lines.length,
        0
      );
      console.log(`✓ ${slideCount} slides / ${totalLines} text blocks`);
      result.files.push({
        semester,
        rel_path: rel,
        filename,
        ext,
        title: parsed.title,
        slides: parsed.slides,
      });
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${OUT}`);
  console.log(`Files: ${result.files.length}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
