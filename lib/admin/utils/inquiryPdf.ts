// Builds and downloads a one-page PDF with the full details of a single inquiry.
const GREEN: [number, number, number] = [2, 214, 131];
const INK: [number, number, number] = [18, 18, 18];
const MUTED: [number, number, number] = [110, 110, 110];

const fmtStatus = (s?: string) => (s || "—").replace(/_/g, " ");

export async function downloadInquiryPdf(inq: any) {
  // Loaded on demand so the PDF library is not part of the page bundle
  const { jsPDF } = await import("jspdf");

  const user = typeof inq.user === "object" ? inq.user : null;
  const isTier = !!inq.planTier;
  const itemName =
    (isTier
      ? typeof inq.planTier === "object" ? inq.planTier?.name : ""
      : typeof inq.product === "object"
        ? inq.product?.productName || inq.product?.name
        : "") ||
    inq.productName ||
    "—";
  const listedPrice = isTier && inq.planTier?.price ? `$${Number(inq.planTier.price).toFixed(2)}` : "—";
  const agreedPrice = inq.customPrice ? `$${(inq.customPrice / 100).toFixed(2)}` : "—";

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  // Header band
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Greenpal", M, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREEN);
  doc.text("STAY CHARGED. KEEP MOVING.", M, 68);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("INQUIRY DETAILS", W - M, 50, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(190, 190, 190);
  doc.text(`Ref #${String(inq._id).slice(-6).toUpperCase()}`, W - M, 68, { align: "right" });
  doc.setFillColor(...GREEN);
  doc.rect(0, 90, W, 4, "F");
  y = 130;

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(title.toUpperCase(), M, y);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(1.5);
    doc.line(M, y + 6, M + 28, y + 6);
    y += 28;
  };

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), M, y);
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(value || "—", W - M * 2 - 140);
    doc.text(lines, M + 140, y);
    y += Math.max(lines.length, 1) * 15 + 8;
  };

  section("Customer");
  row("Name", user?.name || "—");
  row("Email", user?.email || "—");
  if (user?.phone || inq.phone) row("Phone", user?.phone || inq.phone);
  y += 10;

  section("Inquiry");
  row("Type", isTier ? "Plan tier" : "Product");
  row(isTier ? "Tier" : "Product", itemName);
  row("Status", fmtStatus(inq.status));
  row("Date received", new Date(inq.createdAt).toLocaleString());
  if (isTier) row("Listed price", listedPrice);
  row("Agreed price", agreedPrice);
  y += 10;

  section("Message");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  const msg = doc.splitTextToSize(inq.message || "No message provided.", W - M * 2 - 24);
  const boxH = msg.length * 15 + 24;
  doc.setFillColor(245, 245, 242);
  doc.roundedRect(M, y - 8, W - M * 2, boxH, 6, 6, "F");
  doc.setFillColor(...GREEN);
  doc.rect(M, y - 8, 3, boxH, "F");
  doc.text(msg, M + 16, y + 10);

  // Footer
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(M, H - 60, W - M, H - 60);
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Greenpal Canada · thegreenpal.ca · info@thegreenpal.ca · 780-719-5725", M, H - 42);
  doc.text(`Generated ${new Date().toLocaleString()}`, W - M, H - 42, { align: "right" });

  const who = (user?.name || "customer").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`inquiry-${who}-${String(inq._id).slice(-6)}.pdf`);
}
