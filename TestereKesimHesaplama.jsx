// React bileşeni - WhatsApp butonu eklendi ve tüm form ile tablo render edildi
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const malzemeVerisi = {
  "St 37 / 42": { no: "1.0037 / 1.0042", hiz: [120, 130], ilerleme: [0.05, 0.07] },
  "St 52 / 60": { no: "1.0052 / 1.0060", hiz: [110, 120], ilerleme: [0.05, 0.07] },
  "C10 / C15": { no: "1.0301 / 1.0401", hiz: [120, 130], ilerleme: [0.06, 0.08] },
  "C35 / C45": { no: "1.0501 / 1.0503", hiz: [100, 110], ilerleme: [0.06, 0.08] },
  "4140 42 CrMo 4": { no: "1.7225", hiz: [90, 100], ilerleme: [0.05, 0.07] },
  "4340 34 CrNiMo 6": { no: "1.6582", hiz: [90, 100], ilerleme: [0.05, 0.07] },
  "7131 16 MnCr 5": { no: "1.7133", hiz: [110, 120], ilerleme: [0.06, 0.08] },
  "8620 21 NiCrMo 2": { no: "1.6523", hiz: [110, 120], ilerleme: [0.06, 0.08] },
  "2379 X 155 CrVMo 12 1": { no: "1.2379", hiz: [50, 70], ilerleme: [0.04, 0.05] },
};

export default function TestereKesimHesaplama() {
  const [celikKalitesi, setCelikKalitesi] = useState("");
  const [kesmeHizi, setKesmeHizi] = useState("");
  const [ilerleme, setIlerleme] = useState("");
  const [cap, setCap] = useState("");
  const [disSayisi, setDisSayisi] = useState("");
  const [malzemeCap, setMalzemeCap] = useState("");
  const [kesimBoyu, setKesimBoyu] = useState("");
  const [adet, setAdet] = useState("");
  const [devir, setDevir] = useState("");
  const [ilerlemeHizi, setIlerlemeHizi] = useState("");
  const [kayitlar, setKayitlar] = useState([]);
  const [sonKayit, setSonKayit] = useState(null);
  const [whatsAppNo, setWhatsAppNo] = useState("");

  useEffect(() => {
    if (celikKalitesi && malzemeVerisi[celikKalitesi]) {
      const { hiz, ilerleme } = malzemeVerisi[celikKalitesi];
      setKesmeHizi(`${hiz[0]} - ${hiz[1]}`);
      setIlerleme(`${ilerleme[0]} - ${ilerleme[1]}`);
    }
  }, [celikKalitesi]);

  const hesapla = () => {
    const capMm = parseFloat(cap);
    const hiz = malzemeVerisi[celikKalitesi]?.hiz?.[0];
    const iler = malzemeVerisi[celikKalitesi]?.ilerleme?.[0];
    const dis = parseFloat(disSayisi);
    const dCap = parseFloat(malzemeCap);
    const boy = parseFloat(kesimBoyu);
    const adetSayi = parseInt(adet);

    if (
      isNaN(capMm) ||
      isNaN(hiz) ||
      isNaN(iler) ||
      isNaN(dis) ||
      isNaN(dCap) ||
      isNaN(boy) ||
      isNaN(adetSayi)
    ) return;

    const d = (hiz * 1000) / (Math.PI * capMm);
    const f = (iler * d * dis) / 60;
    const alan = ((Math.PI * Math.pow(dCap / 2, 2)) * boy * adetSayi) / 1_000_0000;

    setDevir(d.toFixed(1));
    setIlerlemeHizi(f.toFixed(1));

    const tarih = new Date().toLocaleString("tr-TR");
    const yeni = {
      tarih,
      celikKalitesi,
      malzemeCap: dCap,
      kesimBoyu: boy,
      adet: adetSayi,
      alan: alan.toFixed(3),
      testereCap: capMm,
      disSayisi: dis,
      devir: d.toFixed(1),
      ilerlemeHizi: f.toFixed(1),
    };
    setKayitlar((prev) => [...prev, yeni]);
    setSonKayit(yeni);
  };

  const paylasWhatsapp = (veri) => {
    if (!veri) {
      alert("Paylaşılacak bir hesaplama bulunamadı.");
      return;
    }
    if (!whatsAppNo || !/^\d{12}$/.test(whatsAppNo)) {
      alert("Geçerli bir telefon numarası girin. (örn: 905xxxxxxxxx)");
      return;
    }
    const mesaj = `Kesim Bilgisi:\nTarih: ${veri.tarih}\nÇelik Kalitesi: ${veri.celikKalitesi}\nMalzeme Çapı: ${veri.malzemeCap} mm\nKesim Boyu: ${veri.kesimBoyu} mm\nAdet: ${veri.adet}\nToplam Alan: ${veri.alan} m²\nTestere Çapı: ${veri.testereCap} mm\nDiş Sayısı: ${veri.disSayisi}\nDevir: ${veri.devir} rpm\nİlerleme Hızı: ${veri.ilerlemeHizi} mm/sn`;
    const url = `https://wa.me/${whatsAppNo}?text=${encodeURIComponent(mesaj)}`;
    const win = window.open(url, "_blank");
    if (!win) alert("Tarayıcı açılır pencereyi engelliyor olabilir.");
  };

  return (
    <div className="p-4 space-y-4">
      {kayitlar.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">Tarih</th>
                <th className="border px-2">Çelik Kalitesi</th>
                <th className="border px-2">Çap (mm)</th>
                <th className="border px-2">Boy (mm)</th>
                <th className="border px-2">Adet</th>
                <th className="border px-2">Alan (m²)</th>
                <th className="border px-2">Testere Çapı</th>
                <th className="border px-2">Diş</th>
                <th className="border px-2">Devir</th>
                <th className="border px-2">İlerleme (mm/sn)</th>
              </tr>
            </thead>
            <tbody>
              {kayitlar.map((r, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-2">{r.tarih}</td>
                  <td className="border px-2">{r.celikKalitesi}</td>
                  <td className="border px-2">{r.malzemeCap}</td>
                  <td className="border px-2">{r.kesimBoyu}</td>
                  <td className="border px-2">{r.adet}</td>
                  <td className="border px-2">{r.alan}</td>
                  <td className="border px-2">{r.testereCap}</td>
                  <td className="border px-2">{r.disSayisi}</td>
                  <td className="border px-2">{r.devir}</td>
                  <td className="border px-2">{r.ilerlemeHizi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Çelik Kalitesi</Label><Select value={celikKalitesi} onValueChange={setCelikKalitesi}><SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger><SelectContent>{Object.entries(malzemeVerisi).map(([din, { no }]) => (<SelectItem key={din} value={din}>{din} ({no})</SelectItem>))}</SelectContent></Select></div>
          <div><Label>Malzeme Çapı (mm)</Label><Input value={malzemeCap} onChange={(e) => setMalzemeCap(e.target.value)} /></div>
          <div><Label>Kesim Boyu (mm)</Label><Input value={kesimBoyu} onChange={(e) => setKesimBoyu(e.target.value)} /></div>
          <div><Label>Adet</Label><Input value={adet} onChange={(e) => setAdet(e.target.value)} /></div>
          <div><Label>Testere Çapı (mm)</Label><Input value={cap} onChange={(e) => setCap(e.target.value)} /></div>
          <div><Label>Diş Sayısı</Label><Input value={disSayisi} onChange={(e) => setDisSayisi(e.target.value)} /></div>
          <div><Label>Kesme Hızı (öneri)</Label><Input value={kesmeHizi} readOnly /></div>
          <div><Label>İlerleme (öneri)</Label><Input value={ilerleme} readOnly /></div>
          <div><Label>Devir (rpm)</Label><Input value={devir} readOnly /></div>
          <div><Label>İlerleme Hızı (mm/sn)</Label><Input value={ilerlemeHizi} readOnly /></div>
          <div><Label>WhatsApp Numarası</Label><Input value={whatsAppNo} onChange={(e) => setWhatsAppNo(e.target.value)} placeholder="905xxxxxxxxx" /></div>
        </CardContent>
      </Card>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={hesapla}>Hesapla ve Kaydet</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={kayitlar.length === 0} onClick={() => paylasWhatsapp(sonKayit)}>Son Hesabı WhatsApp ile Gönder</button>
      {(!sonKayit || !/^\d{12}$/.test(whatsAppNo)) && (
  <p className="text-red-600 text-sm mt-2">
    Lütfen geçerli bir hesaplama ve 12 haneli WhatsApp numarası giriniz.
  </p>
)}

    </div>
  );
}
