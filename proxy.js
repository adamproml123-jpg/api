export default async function handler(req, res) {
  const { nokp } = req.query;
  if (!nokp) {
    res.status(400).json({ error: "Missing nokp parameter" });
    return;
  }

  try {
    const targetUrl = `http://spmp.psmza.edu.my/stdrprofilehep.jsp?nokp=${encodeURIComponent(nokp)}`;
    const response = await fetch(targetUrl);
    const text = await response.text();

    const match = text.match(/NOPEND :<\/td>\s*<td[^>]*>([^<]+)/i);
    if (match) {
      res.status(200).json({ nopendidikan: match[1].trim() });
    } else {
      res.status(404).json({ error: "No Pendidikan not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to PSMZA", details: err.message });
  }
}
