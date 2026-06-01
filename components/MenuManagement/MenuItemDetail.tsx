'use client'
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, Loader2, Plus, X, Minus, ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface InventoryItem {
  id: string;
  name: string;
  category: { name: string };
  costPerUnit: string;
  unit: string;
}

interface LinkedIngredient {
  id: string;
  name: string;
  costPerUnit: string;
  unit: string;
  category?: { name: string };
  quantityPerServing: number;
  yieldFactor: number; // e.g. 0.7 means 30% loss (potatoes → chips)
}

interface MenuItemData {
  id: string;
  name: string;
  description: string | null;
  price: string;
  costPerUnit: string;
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: { id: string; name: string };
  ingredients: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

export default function MenuItemDetail({ id }: { id: string }) {
  const [item, setItem] = useState<MenuItemData | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [prepInstructions, setPrepInstructions] = useState('');
  const [linkedIngredients, setLinkedIngredients] = useState<LinkedIngredient[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/menu/${id}`).then(r => r.json()),
      fetch('/api/menu/categories').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json()),
    ]).then(([menuItem, cats, inv]) => {
      if (!menuItem.error) {
        setItem(menuItem);
        setName(menuItem.name);
        setDescription(menuItem.description || '');
        setPrice(menuItem.price);
        setCategoryId(menuItem.categoryId);
        setIsAvailable(menuItem.isAvailable);
        setImageUrl(menuItem.image || '');
        // Parse notes/prep from description if stored there
        const descParts = (menuItem.description || '').split('---PREP---');
        setDescription(descParts[0]?.trim() || '');
        setPrepInstructions(descParts[1]?.trim() || '');
        const notesParts = descParts[0]?.split('---NOTES---') || [];
        if (notesParts.length > 1) {
          setDescription(notesParts[0]?.trim() || '');
          setNotes(notesParts[1]?.trim() || '');
        }
        // Map existing ingredients
        setLinkedIngredients(menuItem.ingredients.map((ing: InventoryItem) => ({
          ...ing,
          quantityPerServing: 1,
          yieldFactor: 1,
        })));
      }
      if (!cats.error) setCategories(cats);
      if (!inv.error) setInventoryItems(inv);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const ingredientCost = linkedIngredients.reduce((sum, ing) => {
    const rawCost = Number(ing.costPerUnit) * ing.quantityPerServing;
    // If yield < 1, you need more raw material to get the usable amount
    return sum + (rawCost / ing.yieldFactor);
  }, 0);

  const sellingPrice = Number(price) || 0;
  const profit = sellingPrice - ingredientCost;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  const addIngredient = (inv: InventoryItem) => {
    if (linkedIngredients.find(i => i.id === inv.id)) return;
    setLinkedIngredients([...linkedIngredients, {
      ...inv,
      quantityPerServing: 1,
      yieldFactor: 1,
    }]);
  };

  const updateIngredient = (ingId: string, field: 'quantityPerServing' | 'yieldFactor', value: number) => {
    setLinkedIngredients(linkedIngredients.map(ing =>
      ing.id === ingId ? { ...ing, [field]: value } : ing
    ));
  };

  const removeIngredient = (ingId: string) => {
    setLinkedIngredients(linkedIngredients.filter(i => i.id !== ingId));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    // Store notes and prep instructions in description field
    let fullDescription = description;
    if (notes) fullDescription += `\n---NOTES---\n${notes}`;
    if (prepInstructions) fullDescription += `\n---PREP---\n${prepInstructions}`;

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: fullDescription,
          price: Number(price),
          categoryId,
          isAvailable,
          image: imageUrl || null,
          costPerUnit: ingredientCost,
          ingredients: linkedIngredients.map(i => i.id),
        }),
      });
      if (res.ok) setSaved(true);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, create a local object URL. In production you'd upload to S3/Cloudinary
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Menu item not found</p>
        <Link href="/dashboard/menus" className="text-orange-600 text-sm mt-2 inline-block">← Back to menu</Link>
      </div>
    );
  }

  // Group available inventory for picker
  const grouped = inventoryItems.reduce((acc: Record<string, InventoryItem[]>, inv) => {
    const cat = inv.category?.name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(inv);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/menus" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name || 'Menu Item'}</h1>
            <p className="text-sm text-gray-500">Last updated {new Date(item.updatedAt).toLocaleDateString('en-ZA')}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</>
            : saved ? <><Save className="w-4 h-4 mr-1.5" /> Saved!</>
            : <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" className="input-field" placeholder="e.g. Quarter bread with polony, russian, chips, cheese & atchar" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="available" className="rounded border-gray-300" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
              <label htmlFor="available" className="text-sm text-gray-700">Available for ordering</label>
            </div>
          </div>

          {/* Ingredients & Yield */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Ingredients & Stock Usage</h2>
              <p className="text-xs text-gray-500 mt-1">
                Set how much of each ingredient goes into one serving. Use yield factor for items that lose weight during prep (e.g. potatoes → chips: yield 0.7 means 30% loss from peeling/frying).
              </p>
            </div>

            {/* Linked ingredients */}
            {linkedIngredients.length > 0 && (
              <div className="space-y-2">
                {linkedIngredients.map(ing => (
                  <div key={ing.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ing.name}</p>
                      <p className="text-xs text-gray-500">R{Number(ing.costPerUnit).toFixed(2)}/{ing.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Qty/serving</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          className="w-16 text-center text-sm border border-gray-200 rounded-md py-1"
                          value={ing.quantityPerServing}
                          onChange={(e) => updateIngredient(ing.id, 'quantityPerServing', Number(e.target.value))}
                        />
                      </div>
                      <div className="text-center">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Yield</label>
                        <input
                          type="number"
                          min="0.1"
                          max="1"
                          step="0.05"
                          className="w-16 text-center text-sm border border-gray-200 rounded-md py-1"
                          value={ing.yieldFactor}
                          onChange={(e) => updateIngredient(ing.id, 'yieldFactor', Number(e.target.value))}
                        />
                      </div>
                      <div className="text-center">
                        <label className="block text-[10px] text-gray-500 mb-0.5">Cost</label>
                        <p className="text-sm font-medium text-gray-900">
                          R{((Number(ing.costPerUnit) * ing.quantityPerServing) / ing.yieldFactor).toFixed(2)}
                        </p>
                      </div>
                      <button onClick={() => removeIngredient(ing.id)} className="p-1 rounded hover:bg-red-50">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add from inventory */}
            <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto p-3">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(inv => {
                      const isLinked = linkedIngredients.some(i => i.id === inv.id);
                      return (
                        <button
                          key={inv.id}
                          type="button"
                          disabled={isLinked}
                          onClick={() => addIngredient(inv)}
                          className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                            isLinked
                              ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                              : 'text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <Plus className="w-3 h-3 inline mr-0.5" />{inv.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {inventoryItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-3">No inventory items. Add stock first.</p>
              )}
            </div>

            {/* Potato/yield explainer */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Yield factor tip:</span> Potatoes have ~0.7 yield (30% lost to peeling & frying). 
                If a serving needs 200g chips, you actually use ~285g raw potatoes. Set qty to 0.2kg and yield to 0.7.
              </p>
            </div>
          </div>

          {/* Notes & Prep */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Notes & Preparation</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea
                className="input-field h-20 resize-none"
                placeholder="e.g. Customer favourite, spicy version available, only sell on weekends..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Instructions</label>
              <textarea
                className="input-field h-28 resize-none"
                placeholder="e.g. Cut bread in half, hollow out, layer chips first, then polony slices, russian cut lengthwise, cheese on top, atchar on the side..."
                value={prepInstructions}
                onChange={(e) => setPrepInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right column - Image & Pricing */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Image</h2>
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 relative">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt={name} fill className="object-cover rounded-lg" />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                  <span className="text-xs text-gray-500">Click to upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Or paste an image URL:</p>
            <input
              type="text"
              className="input-field text-xs"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (R)</label>
              <input
                type="number"
                min="1"
                step="0.50"
                className="input-field text-lg font-bold"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ingredient cost</span>
                <span className="font-medium">R{ingredientCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Profit</span>
                <span className={`font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  R{profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Margin</span>
                <span className={`font-bold ${margin >= 30 ? 'text-emerald-600' : margin >= 15 ? 'text-amber-600' : 'text-red-600'}`}>
                  {margin.toFixed(0)}%
                </span>
              </div>
            </div>
            {margin < 30 && margin > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                Margin is below 30%. Consider adjusting your price or ingredient quantities.
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Info</h2>
            <div className="text-xs text-gray-500 space-y-1.5">
              <p>Created: {new Date(item.createdAt).toLocaleDateString('en-ZA')}</p>
              <p>Updated: {new Date(item.updatedAt).toLocaleDateString('en-ZA')}</p>
              <p>Ingredients: {linkedIngredients.length}</p>
              <p>Status: {isAvailable ? '✓ Available' : '✗ Unavailable'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
