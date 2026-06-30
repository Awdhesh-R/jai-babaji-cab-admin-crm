"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * 🧾 Premium Professional Invoice Generator
 * Call: downloadInvoice(item);
 */
export async function downloadInvoice(item) {
  // Create temp container
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.top = "0";
  tempDiv.style.left = "0";
  tempDiv.style.background = "white";
  tempDiv.style.padding = "30px";
  tempDiv.style.width = "850px";
  tempDiv.style.zIndex = "-1";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.color = "#111827";

  tempDiv.innerHTML = `
    <div style="border:1px solid #e5e7eb; border-radius:10px; padding:28px;">
      
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div>
          <h1 style="color:#2563eb; margin:0;">Rodbez Auto Services</h1>
          <p style="margin:4px 0; font-size:13px; color:#6b7280;">
            Bihar, India • support@rodbez.com
          </p>
        </div>
        <div style="text-align:right;">
          <h3 style="margin:0; color:#2563eb;">Invoice</h3>
          <p style="margin:0; font-size:13px; color:#6b7280;">Date: ${item.date}</p>
        </div>
      </div>

      <hr style="border:none; border-top:2px solid #2563eb; margin:10px 0 25px 0;"/>

      <!-- Service Info -->
      <table style="width:100%; font-size:14px; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;"><b>Service Name:</b></td>
          <td>${item.title}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><b>Part Used:</b></td>
          <td>${item.part}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><b>Priority:</b></td>
          <td>${item.priority}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><b>Changed By:</b></td>
          <td>${item.changedBy}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><b>Approved By:</b></td>
          <td>${item.approvedBy}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><b>Status:</b></td>
          <td>${item.status}</td>
        </tr>
      </table>

      <!-- Description -->
      <div style="margin-top:25px; background:#f9fafb; border-radius:8px; padding:15px; border:1px solid #e5e7eb;">
        <p style="margin:0; color:#374151; line-height:1.5; font-size:14px;">
          ${item.description}
        </p>
      </div>

      <!-- Total Section -->
      <div style="margin-top:25px; display:flex; justify-content:flex-end;">
        <div style="text-align:right;">
          <h3 style="margin:0; color:#16a34a;">Total Amount</h3>
          <h2 style="margin:5px 0 0 0;">₹ ${item.amount}</h2>
        </div>
      </div>

      <!-- Footer -->
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0 10px 0;"/>
      <p style="text-align:center; color:#6b7280; font-size:12px;">
        Thank you for choosing <b>Rodbez Auto Services</b>.<br/>
        This invoice was generated automatically and does not require a signature.
      </p>
    </div>
  `;

  document.body.appendChild(tempDiv);

  // Wait a moment for rendering
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Capture the rendered content
  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Generate PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${item.title || "invoice"}.pdf`);

  // Cleanup
  document.body.removeChild(tempDiv);
}
