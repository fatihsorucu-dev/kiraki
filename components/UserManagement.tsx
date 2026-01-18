
import React, { useState, useMemo } from 'react';
import { User, PermissionKey, Company } from '../types';
import { Icons } from '../constants';

interface UserManagementProps {
  lang: 'tr' | 'en';
  t: any;
  currentUserId: string;
  isMaster: boolean;
  companyId: string;
  companies: Company[];
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onLog: (action: string, details: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  lang, t, currentUserId, isMaster, companyId, companies, allUsers, setAllUsers, onLog 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterCompanyId, setFilterCompanyId] = useState<string>(isMaster ? 'all' : companyId);
  const [editForm, setEditForm] = useState<Partial<User>>({
    companyId: isMaster ? '' : companyId
  });

  const filteredUsers = useMemo(() => {
    if (isMaster) {
      if (filterCompanyId === 'all') return allUsers;
      return allUsers.filter(u => u.companyId === filterCompanyId);
    }
    return allUsers.filter(u => u.companyId === companyId);
  }, [allUsers, isMaster, filterCompanyId, companyId]);

  const togglePermission = (userId: string, permission: PermissionKey) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newPermissions = { ...u.permissions, [permission]: !u.permissions[permission] };
        onLog('UpdatePermission', `User ${u.name} permission ${permission} changed to ${newPermissions[permission]}`);
        return { ...u, permissions: newPermissions };
      }
      return u;
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCompanyId = isMaster ? editForm.companyId : companyId;
    if (!targetCompanyId || targetCompanyId === 'all') return alert(t.selectCompany);

    const newUserObj: User = {
      id: `u-${Date.now()}`,
      name: editForm.name || '',
      email: editForm.email || '',
      role: editForm.role || 'Member',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name || '')}&background=1e3a8a&color=fff`,
      permissions: {
        canUploadData: false, canRunSimulations: false, canViewInsights: true,
        canManageUsers: false, canAccessFX: false, canAccessForecast: true, canAccessAlerts: true
      },
      companyId: targetCompanyId
    };

    setAllUsers(prev => [...prev, newUserObj]);
    onLog('AddUser', `New user added: ${newUserObj.name} to company: ${targetCompanyId}`);
    setIsAdding(false);
    setEditForm({ companyId: isMaster ? '' : companyId });
  };

  const removeUser = (id: string) => {
    if (id === currentUserId) return alert("Kendinizi silemezsiniz.");
    const user = allUsers.find(u => u.id === id);
    if (confirm(lang === 'tr' ? 'Bu kullanıcıyı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this user?')) {
      setAllUsers(prev => prev.filter(u => u.id !== id));
      onLog('DeleteUser', `User removed: ${user?.name}`);
    }
  };

  const permissionList: { key: PermissionKey; label: string }[] = [
    { key: 'canUploadData', label: t.uploadData },
    { key: 'canManageUsers', label: t.users },
    { key: 'canAccessFX', label: t.fxRisk },
    { key: 'canAccessForecast', label: t.forecast },
    { key: 'canViewInsights', label: t.insights },
    { key: 'canAccessAlerts', label: t.alerts },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">{t.users}</h2>
          <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isMaster ? t.allUsers : t.teamMembers}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isMaster && (
            <select 
              className="w-full sm:w-auto bg-white dark:bg-cardDark border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl text-[10px] font-black uppercase outline-none"
              value={filterCompanyId}
              onChange={(e) => setFilterCompanyId(e.target.value)}
            >
              <option value="all">{t.allCompanies}</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="w-full sm:w-auto bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl"
          >
            {isAdding ? t.cancel : '+ ' + (lang === 'tr' ? 'Yeni Kullanıcı' : 'New User')}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddUser} className="bg-white dark:bg-cardDark p-6 lg:p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Ad Soyad</label>
              <input required className="w-full px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 outline-none font-bold" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">E-posta</label>
              <input required type="email" className="w-full px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 outline-none font-bold" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.roleName}</label>
              <input required placeholder="örn: CEO" className="w-full px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 outline-none font-bold" value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value})} />
            </div>
            {isMaster && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">{t.selectCompany}</label>
                <select required className="w-full px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 outline-none font-bold" value={editForm.companyId || ''} onChange={e => setEditForm({...editForm, companyId: e.target.value})}>
                  <option value="">{t.selectCompany}</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end"><button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg">{t.save}</button></div>
        </form>
      )}

      <div className="bg-white dark:bg-cardDark rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-5">Kullanıcı & Şirket</th>
                {permissionList.map(p => <th key={p.key} className="px-2 py-5 text-center">{p.label}</th>)}
                <th className="px-6 py-5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
                      <div>
                        <p className="text-sm font-black leading-tight">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[80px]">{user.role}</span>
                          {isMaster && (
                            <span className="text-[10px] text-blue-500 font-black uppercase">
                              {companies.find(c => c.id === user.companyId)?.name || 'Platform'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {permissionList.map(p => (
                    <td key={p.key} className="px-2 py-5 text-center">
                      <input type="checkbox" disabled={user.isMaster} className="w-5 h-5 rounded-lg text-blue-900 border-slate-300 dark:bg-slate-800 cursor-pointer disabled:opacity-30" checked={user.permissions[p.key]} onChange={() => togglePermission(user.id, p.key)} />
                    </td>
                  ))}
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => removeUser(user.id)} disabled={user.isMaster} className="text-rose-500 hover:text-rose-700 font-black text-[10px] uppercase transition-colors disabled:opacity-0">{t.delete}</button>
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

export default UserManagement;
