
import React, { useState } from 'react';
import { Icons } from '../constants';

interface DataCenterProps {
  lang: 'tr' | 'en';
  t: any;
}

const DataCenter: React.FC<DataCenterProps> = ({ lang, t }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [history] = useState([
    { id: '1', name: 'bank_statement_june.csv', date: '2024-06-01', status: 'Success', size: '24KB', type: 'Bank' },
    { id: '2', name: 'invoices_q2.xlsx', date: '2024-05-15', status: 'Success', size: '1.2MB', type: 'Invoice' },
  ]);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert(lang === 'tr' ? 'Veri başarıyla işlendi ve normalleştirildi.' : 'Data successfully processed and normalized.');
    }, 1500);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-cardDark p-6 lg:p-12 rounded-[2rem] lg:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 rounded-[1.2rem] lg:rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
             <Icons.Upload />
          </div>
          <h2 className="text-xl lg:text-2xl font-black mb-2 uppercase tracking-tight">{t.uploadData}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm mb-8 font-medium leading-relaxed px-4">
            {lang === 'tr' ? 'Banka ekstreleri (.csv), fatura listeleri (.xlsx) veya tedarikçi kontratlarını yükleyin.' : 'Upload bank statements (.csv), invoice lists (.xlsx) or supplier contracts.'}
          </p>
          
          <div 
            onClick={handleSimulateUpload}
            className={`border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] lg:rounded-[2rem] p-8 lg:p-12 cursor-pointer hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Veri İşleniyor...</p>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-xs lg:text-sm font-black uppercase tracking-widest mb-1">{lang === 'tr' ? 'Buraya Sürükleyin' : 'Drag Files Here'}</p>
                <p className="text-[8px] lg:text-[10px] text-slate-300 uppercase font-black tracking-widest">Maks 10MB | .CSV, .XLSX, .PDF</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-cardDark rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 lg:px-8 py-4 lg:py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'tr' ? 'Yükleme Geçmişi' : 'Upload History'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {history.map(item => (
                <tr key={item.id} className="text-sm hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <p className="font-black text-slate-800 dark:text-slate-200">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.type} • {item.size}</p>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{item.date}</td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5">
                    <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-5 text-right">
                    <button className="text-slate-300 hover:text-blue-900 transition-colors"><Icons.Layers /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataCenter;
