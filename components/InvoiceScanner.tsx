
import React, { useState } from 'react';
import { scanInvoiceImage } from '../services/gemini';
import { Icons } from '../constants';

const InvoiceScanner: React.FC<{ onInvoiceAdded: (inv: any) => void, t: any }> = ({ onInvoiceAdded, t }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await scanInvoiceImage(base64);
        onInvoiceAdded({
          ...data,
          id: `ai-${Date.now()}`,
          status: 'pending'
        });
        alert(t.scanSuccess);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Hata: Fatura okunamadı.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white dark:bg-cardDark p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {isScanning ? <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div> : <Icons.Camera />}
      </div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{isScanning ? t.scanning : t.scanInvoice}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">AI VISION DESTEKLİ VERİ GİRİŞİ</p>
      
      <label className="block w-full cursor-pointer group">
        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isScanning} />
        <div className="bg-blue-900 text-white p-6 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-blue-950 transition-all shadow-xl shadow-blue-900/20">
          FATURA FOTOĞRAFI YÜKLE
        </div>
      </label>
    </div>
  );
};

export default InvoiceScanner;
