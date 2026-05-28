'use client'
import React, { useState } from 'react';
import { Plus, X, Save, Bell } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', priority: 'medium' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements([
      { id: Date.now(), ...newAnnouncement, createdAt: new Date() },
      ...announcements,
    ]);
    setNewAnnouncement({ title: '', message: '', priority: 'medium' });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-gray-600">Broadcast messages to your team</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No announcements yet. Create one to get started.</p>
          </div>
        )}
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-lg">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${a.priority === 'high' ? 'bg-red-100 text-red-800' :
                      a.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {a.priority}
                  </span>
                </div>
                <p className="text-gray-600">{a.message}</p>
                <p className="text-sm text-gray-400 mt-2">{a.createdAt.toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">New Announcement</h3>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required className="w-full p-2 border rounded-lg" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows={4} className="w-full p-2 border rounded-lg" value={newAnnouncement.message} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full p-2 border rounded-lg" value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="w-5 h-5 mr-2" />Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
