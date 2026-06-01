'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from "next-auth/react";

export default function HeaderComponent() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="input-field pl-9 py-2 text-sm"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                <div className="px-4 py-3 bg-orange-50/50">
                  <p className="text-sm font-medium text-gray-900">New Order #1042</p>
                  <p className="text-xs text-gray-500 mt-0.5">2 min ago</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Low stock: Russian Sausage</p>
                  <p className="text-xs text-gray-500 mt-0.5">15 min ago</p>
                </div>
              </div>
              <Link href="/dashboard/orders" className="block px-4 py-2.5 text-xs text-center text-orange-600 font-medium border-t border-gray-100 hover:bg-gray-50">
                View all
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Image
              src={session?.user?.image || "/profile-picture-circle.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              width={32}
              height={32}
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight">{session?.user?.name || "Admin"}</p>
              <p className="text-[11px] text-gray-500">Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
              <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <User className="w-4 h-4 text-gray-400" /> Profile
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
