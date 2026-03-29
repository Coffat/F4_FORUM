"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  Plus, X, Trash2, Edit2, 
  DoorOpen, Users, Layout, 
  Check, AlertCircle, Loader2
} from "lucide-react";
import { getRoomList, createRoom, updateRoom, deleteRoom, type RoomCommandData } from "../roomActions";

interface Room {
  id: number;
  name: string;
  capacity: number;
  roomType: string;
}

interface RoomModalProps {
  branchId: number;
  branchName: string;
  onClose: () => void;
}

export default function RoomModal({ branchId, branchName, onClose }: RoomModalProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    let isMounted = true;
    const loadRoomsData = async () => {
      setLoading(true);
      try {
        const data = await getRoomList(branchId);
        if (isMounted) setRooms(data);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadRoomsData();
    return () => { isMounted = false; };
  }, [branchId]);

  // Re-fetch function for manual triggers (e.g. after CRUD)
  const refreshRooms = async () => {
    const data = await getRoomList(branchId);
    setRooms(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: RoomCommandData = {
      name: formData.get("name") as string,
      capacity: Number(formData.get("capacity")),
      roomType: formData.get("roomType") as string,
    };

    startTransition(async () => {
      let result;
      if (editingRoom) {
        result = await updateRoom(branchId, editingRoom.id, data);
      } else {
        result = await createRoom(branchId, data);
      }

      if (result.success) {
        setShowForm(false);
        setEditingRoom(null);
        await refreshRooms();
      }
    });
  };

  const handleDelete = async (roomId: number) => {
    if (confirm("Xác nhận xóa phòng này?")) {
      startTransition(async () => {
        const result = await deleteRoom(branchId, roomId);
        if (result.success) {
          await refreshRooms();
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wider">Campus Rooms</span>
                <h3 className="text-2xl font-bold text-slate-900">{branchName}</h3>
            </div>
            <p className="text-sm font-medium text-slate-400">Manage classroom configurations and capacity settings.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            
            <div className="flex justify-between items-center mb-8">
                <h4 className="text-lg font-bold text-slate-800">Room Inventory <span className="text-slate-400 ml-1">({rooms.length})</span></h4>
                {!showForm && (
                    <button 
                        onClick={() => { setEditingRoom(null); setShowForm(true); }}
                        className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hovrer:bg-blue-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Room
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="font-bold tracking-widest uppercase text-[10px]">Loading Rooms...</p>
                </div>
            ) : rooms.length === 0 && !showForm ? (
                <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                    <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h5 className="font-bold text-slate-900 mb-1">No rooms found</h5>
                    <p className="text-sm text-slate-500 mb-6">This branch doesn&apos;t have any classrooms configured yet.</p>
                    <button 
                        onClick={() => setShowForm(true)}
                        className="bg-[#0B3A9A] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200"
                    >
                        Create First Room
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {rooms.map((room) => (
                        <div key={room.id} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <Layout className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{room.roomType || 'Standard Class'}</p>
                                    <h5 className="text-lg font-bold text-slate-900 leading-none">{room.name}</h5>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Users className="w-3.5 h-3.5" /> 
                                            Max {room.capacity} students
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => { setEditingRoom(room); setShowForm(true); }}
                                    className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(room.id)}
                                    className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Right Sidebar - Form Area */}
          <div className={`w-full md:w-[380px] bg-slate-50/80 p-10 border-l border-slate-100 transition-all duration-500 ${showForm ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-8">
                <h4 className="text-lg font-bold text-slate-800">{editingRoom ? 'Edit Room' : 'Add New Room'}</h4>
                <button 
                    onClick={() => { setShowForm(false); setEditingRoom(null); }}
                    className="p-1 text-slate-400 hover:text-slate-900"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Room Name</label>
                    <input name="name" defaultValue={editingRoom?.name} required placeholder="Ex: Theory Room 101" className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-semibold" />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Room Type</label>
                    <div className="relative">
                        <select name="roomType" defaultValue={editingRoom?.roomType || 'Theory'} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-semibold appearance-none">
                            <option value="Theory">Theory Class</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Seminar">Seminar Room</option>
                            <option value="Library">Mini Library</option>
                        </select>
                        <Layout className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Max Capacity</label>
                    <div className="relative">
                        <input name="capacity" type="number" defaultValue={editingRoom?.capacity || 20} required className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-semibold" />
                        <Users className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full bg-[#0B3A9A] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingRoom ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingRoom ? 'Save Changes' : 'Create Room'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { setShowForm(false); setEditingRoom(null); }}
                        className="w-full py-4 text-sm font-bold text-slate-400 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Quick Tips */}
            <div className="mt-12 bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <h5 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Architect Tip</h5>
                </div>
                <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
                    Set capacity accurately to optimize teacher allocation and student safety standards.
                </p>
            </div>
          </div>
        </div>

        {/* CSS for custom scrollbar */}
        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #e2e8f0;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #cbd5e1;
            }
        `}</style>
      </div>
    </div>
  );
}
