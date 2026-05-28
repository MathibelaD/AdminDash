'use client'
import React, { useState, useEffect } from 'react';
import { Star, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
  orderNumber?: string;
  menuItem?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (!data.error) setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, status: newStatus }),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus.toUpperCase();
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderStars = (rating: number) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Review Management</h1>
        <p className="text-gray-600">Manage and moderate customer reviews</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search reviews..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <select className="px-4 py-2 border rounded-lg min-w-[150px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.customerName}</span>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${review.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      review.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {review.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                {(review.orderNumber || review.menuItem) && (
                  <div className="flex gap-4 text-sm text-gray-500">
                    {review.orderNumber && <span>Order: {review.orderNumber}</span>}
                    {review.menuItem && <span>Item: {review.menuItem}</span>}
                  </div>
                )}
              </div>
              {review.status === 'PENDING' && (
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleStatusChange(review.id, 'APPROVED')} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                    <CheckCircle className="w-4 h-4" />Approve
                  </button>
                  <button onClick={() => handleStatusChange(review.id, 'REJECTED')} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                    <XCircle className="w-4 h-4" />Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredReviews.length === 0 && (
          <div className="p-8 text-center text-gray-500">No reviews found</div>
        )}
      </div>
    </div>
  );
}
