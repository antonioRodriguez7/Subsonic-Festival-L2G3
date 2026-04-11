import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generarEntradaPDF = async (pedido) => {
    const doc = new jsPDF();

    let firstPage = true;

    for (const item of pedido) {
        for (let i = 0; i < item.cantidad; i++) {

            //  NUEVA PÁGINA (excepto la primera)
            if (!firstPage) {
                doc.addPage();
            }
            firstPage = false;

            //  FONDO
            try {
                const img = await fetch("/cartel.jpg")
                    .then(res => res.blob())
                    .then(blob => new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    }));

                doc.addImage(img, "JPEG", 0, 0, 210, 297);
            } catch (e) {
                doc.setFillColor(0, 0, 0);
                doc.rect(0, 0, 210, 297, "F");
            }

            //  OVERLAY
            doc.setFillColor(0, 0, 0, 0.6);
            doc.rect(0, 0, 210, 297, "F");

            //  TÍTULO
            doc.setTextColor(0, 255, 200);
            doc.setFontSize(28);
            doc.text("SUBSONIC FESTIVAL", 20, 30);

            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text("2026 - Entrada Oficial", 20, 40);

            //  TIPO ENTRADA
            doc.setFontSize(18);
            doc.text(`🎫 ${item.nombre}`, 20, 70);

            doc.setFontSize(14);
            doc.text(`Precio: ${item.precio}€`, 20, 85);

            doc.text(`Entrada ${i + 1} de ${item.cantidad}`, 20, 100);

            //  QR ÚNICO
            const qrData = JSON.stringify({
                entrada: item.nombre,
                numero: i + 1,
                fecha: new Date().toISOString()
            });

            const qrImage = await QRCode.toDataURL(qrData);

            doc.addImage(qrImage, "PNG", 140, 70, 40, 40);

            //  FOOTER
            doc.setFontSize(10);
            doc.setTextColor(200, 200, 200);
            doc.text("Escanea para acceder al festival", 20, 250);
        }
    }

    doc.save("entradas-subsonic.pdf");
};