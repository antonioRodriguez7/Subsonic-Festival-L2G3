import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generarEntradaPDF = async (pedido) => {
    const doc = new jsPDF("landscape", "mm", [200, 80]); // Formato de entrada panorámica

    let firstPage = true;

    for (const item of pedido) {
        for (let i = 0; i < item.cantidad; i++) {
            if (!firstPage) {
                doc.addPage();
            }
            firstPage = false;

            // FONDO NEGRO Y BORDE COLORIDO
            doc.setFillColor(15, 15, 20);
            doc.rect(0, 0, 200, 80, "F");
            
            // Lado izquierdo (Ticket info)
            doc.setFillColor(30, 30, 40);
            doc.roundedRect(5, 5, 140, 70, 3, 3, "F");
            
            // Lado derecho (Control / QR)
            doc.setFillColor(30, 30, 40);
            doc.roundedRect(150, 5, 45, 70, 3, 3, "F");

            // Linea discontinua (corte)
            doc.setDrawColor(100, 100, 100);
            doc.setLineDashPattern([2, 2], 0);
            doc.line(147.5, 5, 147.5, 75);

            //  TÍTULO
            doc.setTextColor(0, 255, 200);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("SUBSONIC FESTIVAL", 10, 20);

            doc.setFontSize(12);
            doc.setTextColor(200, 200, 200);
            doc.setFont("helvetica", "normal");
            doc.text("Entrada Oficial 2026", 10, 28);

            //  TIPO ENTRADA
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text(`🎫 ${item.nombre}`, 10, 45);

            doc.setFontSize(12);
            doc.setTextColor(150, 150, 150);
            doc.text(`Precio: ${item.precio} €`, 10, 55);

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`TICKET: ${i + 1} / ${item.cantidad} | CAT: ${item.nombre.substring(0,3).toUpperCase()}`, 10, 70);

            //  QR ÚNICO (lado derecho)
            const qrData = JSON.stringify({
                entrada: item.nombre,
                numero: i + 1,
                fecha: new Date().toISOString()
            });

            const qrImage = await QRCode.toDataURL(qrData, { margin: 1 });
            doc.addImage(qrImage, "PNG", 155, 15, 35, 35);

            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("ESCANEAR", 172.5, 55, { align: "center" });
            doc.text("VALIDACIÓN", 172.5, 60, { align: "center" });
            
            // Número serial
            doc.setFontSize(6);
            const serial = Math.random().toString(36).substring(2, 10).toUpperCase();
            doc.text(`S/N: ${serial}`, 172.5, 70, { align: "center" });
        }
    }

    doc.save("entradas-subsonic.pdf");
    return doc.output('blob');
};


export const generarFacturaPDF = async (pedido, total) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 15, 20);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(0, 255, 200);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("SUBSONIC FESTIVAL", 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("FACTURA DE COMPRA", 140, 25);
    
    // Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString("es-ES");
    doc.text(`Fecha: ${today}`, 20, 60);
    doc.text(`Nº Factura: F-${Math.floor(Math.random() * 1000000)}`, 20, 68);
    
    // Tabla
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 85, 170, 10, "F");
    
    doc.setFont("helvetica", "bold");
    doc.text("CANT.", 25, 92);
    doc.text("CONCEPTO", 50, 92);
    doc.text("P.UNIT", 140, 92);
    doc.text("SUBT", 170, 92);
    
    doc.setFont("helvetica", "normal");
    let y = 105;
    for (const item of pedido) {
        doc.text(`${item.cantidad}`, 25, y);
        doc.text(`${item.nombre}`, 50, y);
        doc.text(`${item.precio.toFixed(2)} €`, 140, y);
        doc.text(`${(item.cantidad * item.precio).toFixed(2)} €`, 170, y);
        y += 10;
    }
    
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL:", 130, y);
    doc.text(`${total.toFixed(2)} €`, 165, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Gracias por su compra en Subsonic Festival.", 20, y + 40);
    doc.text("IVA incl. Desglosado según normativa vigente.", 20, y + 45);

    return doc.output('blob');
};