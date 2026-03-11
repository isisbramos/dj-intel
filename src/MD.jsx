export default function MD({ text, accentColor }) {
  if (!text) return null;
  const lines = text.split("\n");
  const els = [];
  let buf = [];

  const inl = (t) =>
    t
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/`(.*?)`/g, "<code style='background:#111;padding:1px 5px;border-radius:3px;font-size:11px'>$1</code>");

  const flush = (k) => {
    if (buf.length) {
      els.push(
        <ul key={`ul-${k}`} style={{ paddingLeft: 16, margin: "0 0 12px" }}>
          {buf.map((x, i) => (
            <li
              key={i}
              style={{ color: "#bbb", fontSize: 13, lineHeight: 1.7, marginBottom: 3 }}
              dangerouslySetInnerHTML={{ __html: inl(x) }}
            />
          ))}
        </ul>
      );
      buf = [];
    }
  };

  lines.forEach((l, i) => {
    if (l.startsWith("## ")) {
      flush(i);
      els.push(
        <div
          key={i}
          style={{
            fontSize: 16,
            fontFamily: "'Bebas Neue', display",
            letterSpacing: 2,
            color: accentColor,
            marginTop: 24,
            marginBottom: 8,
            paddingBottom: 6,
            borderBottom: `1px solid ${accentColor}33`,
          }}
        >
          {l.slice(3)}
        </div>
      );
    } else if (l.match(/^[-*] /) || l.match(/^\d+\. /)) {
      buf.push(l.replace(/^[-*] /, "").replace(/^\d+\. /, ""));
    } else if (!l.trim()) {
      flush(i);
    } else {
      flush(i);
      els.push(
        <p
          key={i}
          style={{ color: "#bbb", fontSize: 13, lineHeight: 1.7, margin: "0 0 8px" }}
          dangerouslySetInnerHTML={{ __html: inl(l) }}
        />
      );
    }
  });
  flush("end");
  return <div>{els}</div>;
}
