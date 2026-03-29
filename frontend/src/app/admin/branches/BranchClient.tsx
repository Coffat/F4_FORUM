"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, Building2, Plus, 
  TrendingUp, Users, DollarSign, ChevronDown, 
  ArrowUpRight, Download, Edit2, Trash2,
  Map as MapIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { createBranch, deleteBranch, updateBranch, type BranchCommandData } from "./actions";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  capacity: number;
  currentEnrollment: number;
  manager: {
    id: number;
    fullName: string;
    email: string;
  } | null;
}

export default function BranchManagementClient({ initialList }: { initialList: Branch[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Stats calculation
  const totalBranches = initialList.length;
  const totalCapacity = initialList.reduce((acc, b) => acc + (b.capacity || 0), 0);

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận xóa chi nhánh này?")) {
      await deleteBranch(id);
      router.refresh(); // Re-validation standard in Next.js 15
    }
  };

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 ${isPending ? 'opacity-80 grayscale-[0.2]' : ''}`}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Branch Locations</h2>
          <p className="text-slate-500 mt-1 font-medium">Overview and operational health of all English Center campus locations.</p>
        </div>
        <button 
          onClick={() => { setEditingBranch(null); setIsModalOpen(true); }}
          className="bg-[#0B3A9A] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Branch
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Branches */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">Active</span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total Branches</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-1">{totalBranches.toString().padStart(2, '0')}</h3>
        </div>

        {/* Global Capacity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Global Capacity</span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Total Student Capacity</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-1">{totalCapacity.toLocaleString()}</h3>
        </div>

        {/* Regional Revenue */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> 12.5%
                </div>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Regional Revenue MTD</p>
            <h3 className="text-4xl font-bold text-slate-900 mt-1">$142.5k</h3>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden relative">
        
        {isPending && (
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-600/20 overflow-hidden">
                <div className="h-full bg-blue-600 animate-progress origin-left" />
            </div>
        )}

        {/* Filters Overlay */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-slate-50 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-slate-100 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                    Filter by Status: <span className="text-slate-900">All</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-slate-100 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                    City: <span className="text-slate-900">All Locations</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                Sort by: <span className="text-slate-900 flex items-center gap-1">Name <ChevronDown className="w-4 h-4" /></span>
            </div>
        </div>

        {/* Table Head */}
        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-50 grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="col-span-4">Branch Name & Location</div>
            <div className="col-span-2">Branch Manager</div>
            <div className="col-span-3">Student Capacity</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-50">
            {initialList.map((branch) => {
                const occupancy = Math.round((branch.currentEnrollment / branch.capacity) * 100) || 0;
                return (
                    <div key={branch.id} className="px-8 py-6 grid grid-cols-12 items-center hover:bg-slate-50/30 transition-colors group">
                        {/* Name & Location */}
                        <div className="col-span-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 flex items-center justify-center transition-all">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{branch.name}</h4>
                                <p className="text-xs font-medium text-slate-400 mt-0.5">{branch.address}</p>
                            </div>
                        </div>

                        {/* Manager */}
                        <div className="col-span-2 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-white shadow-sm">
                                <Image 
                                    src={`https://ui-avatars.com/api/?name=${branch.manager?.fullName || 'Manager'}&background=random`}
                                    alt="manager" width={32} height={32}
                                />
                            </div>
                            <span className="text-sm font-bold text-slate-700 line-clamp-1">{branch.manager?.fullName || 'N/A'}</span>
                        </div>

                        {/* Capacity Progress */}
                        <div className="col-span-3 pr-10">
                            <div className="flex justify-between items-center text-[10px] font-bold mb-2">
                                <span className="text-slate-400">{branch.currentEnrollment} / {branch.capacity}</span>
                                <span className={occupancy > 80 ? 'text-blue-600' : 'text-purple-600'}>{occupancy}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-[1500ms] ${occupancy > 80 ? 'bg-blue-600' : 'bg-purple-600'}`}
                                    style={{ width: `${occupancy}%` }}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                            {branch.status === 'ACTIVE' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ACTIVE
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MAINTENANCE
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 text-right flex justify-end gap-1">
                            <button 
                                onClick={() => { setEditingBranch(branch); setIsModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(branch.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-8 py-6 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
            <p className="text-sm font-semibold text-slate-400">
                Showing <span className="text-slate-900">1-{initialList.length}</span> of <span className="text-slate-900 text-bold">{initialList.length}</span> branches
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all text-slate-400 disabled:opacity-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-[#0B3A9A] text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200">1</button>
                <button className="w-10 h-10 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl font-bold transition-all text-slate-600">2</button>
                <button className="w-10 h-10 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl font-bold transition-all text-slate-600">3</button>
                <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all text-slate-400">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      {/* Bottom Layout - Insights & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expansion Insight */}
        <div className="lg:col-span-2 bg-[#0B3A9A] rounded-[32px] p-10 text-white relative overflow-hidden group shadow-xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110 duration-1000" />
            
            <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-bold mb-4">Expansion Insight</h3>
                    <p className="text-blue-100/80 max-w-lg leading-relaxed font-medium">
                        Based on current student enrollment trends, the <span className="text-white font-bold border-b border-white/30 pb-0.5">Hanoi East</span> region 
                        shows a 45% increase in demand. Consider planning a satellite branch for Q4.
                    </p>
                </div>

                <div className="flex gap-4 mt-12">
                    <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2 active:scale-95">
                        Download Reports <Download className="w-4 h-4" />
                    </button>
                    <button className="bg-blue-800/50 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700/50 transition-all border border-blue-400/20 flex items-center gap-2 active:scale-95">
                        View Trend Maps <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Abstract map graphic */}
            <div className="absolute right-12 bottom-0 w-64 h-64 opacity-10 pointer-events-none">
                <MapIcon className="w-full h-full stroke-[0.5]" />
            </div>
        </div>

        {/* Branch Map Card */}
        <div className="bg-[#EBECEF] rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start">
               <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Branch Map</h3>
               <ArrowUpRight className="w-6 h-6 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" />
            </div>
            
            <div className="flex-1 flex items-center justify-center my-6">
                {/* Visual Map Placeholder */}
                <div className="relative w-full aspect-square bg-slate-300/40 rounded-2xl flex items-center justify-center border-4 border-white/50 shadow-inner overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping absolute" />
                    <div className="w-3 h-3 bg-blue-600 rounded-full absolute shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                    <MapPin className="w-12 h-12 text-slate-400 opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 leading-none">Status: Operational</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">3 Key Hubs Active</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
            </div>
        </div>
      </div>

      {/* Modal - Fully styled modal for Adding/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {editingBranch ? 'Edit Campus' : 'Add New Branch'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>
                <form action={(formData) => {
                    startTransition(async () => {
                        const data: BranchCommandData = {
                            name: formData.get('name') as string,
                            address: formData.get('address') as string,
                            phone: formData.get('phone') as string,
                            status: (formData.get('status') as string) || 'ACTIVE',
                            capacity: Number(formData.get('capacity')),
                            currentEnrollment: Number(formData.get('enrollment')) || 0,
                            managerId: Number(formData.get('managerId')) || null
                        };
                        
                        if (editingBranch) await updateBranch(editingBranch.id, data);
                        else await createBranch(data);
                        
                        setIsModalOpen(false);
                        router.refresh();
                    });
                }} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Branch Name</label>
                        <input name="name" defaultValue={editingBranch?.name} required placeholder="Saigon Central..." className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Address</label>
                        <textarea name="address" defaultValue={editingBranch?.address} required placeholder="Building name, Street..." className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold h-24 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Capacity</label>
                            <input name="capacity" type="number" defaultValue={editingBranch?.capacity || 500} required className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Enrollment</label>
                            <input name="enrollment" type="number" defaultValue={editingBranch?.currentEnrollment || 0} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
                            <select name="status" defaultValue={editingBranch?.status || 'ACTIVE'} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold appearance-none">
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assign Manager</label>
                            <select name="managerId" defaultValue={editingBranch?.manager?.id || ''} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold appearance-none">
                                <option value="">No Manager</option>
                                <option value="1">Sys Admin (ID 1)</option>
                                <option value="2">Nguyễn Lan Anh (ID 2)</option>
                                <option value="4">Phạm Thu Hà (ID 4)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Contact Phone</label>
                        <input name="phone" defaultValue={editingBranch?.phone} required placeholder="028 - ..." className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
                        <button type="submit" disabled={isPending} className="flex-1 bg-[#0B3A9A] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {editingBranch ? 'Update Campus' : 'Save Location'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
