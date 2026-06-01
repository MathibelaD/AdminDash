'use client'
import React, { useState } from 'react';
import {
  Home,
  ChefHat,
  ShoppingCart,
  Package,
  Wrench,
  Trash2,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Menu', href: '/dashboard/menus', icon: ChefHat },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Equipment', href: '/dashboard/equipment', icon: Wrench },
  { name: 'Waste', href: '/dashboard/waste', icon: Trash2 },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-[#1a1a2e] text-white transition-all duration-300 z-40 flex flex-col ${collapsed ? 'w-[72px]' : 'w-60'}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight">Kota Admin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-orange-600/20 text-orange-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-orange-400' : ''}`} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 w-full transition-colors"
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
