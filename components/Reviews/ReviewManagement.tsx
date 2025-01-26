'use client'
import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Search,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  orderNumber?: string;
  menuItem?: string;
}

export default function Reviews() {
  // Sample reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      customerName: "John Smith",
      rating: 4,
      comment: "Great food! The Classic Kota was amazing. Will definitely order again.",
      date: new Date('2024-01-10'),
      status: 'pending',
      orderNumber: "ORD-001",
      menuItem: "Classic Kota"
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "Best burger in town! The service was excellent too.",
      date: new Date('2024-01-11'),
      status: 'approved',
      orderNumber: "ORD-002",
      menuItem: "Cheese Burger"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApprove = (reviewId: number) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'approved' } : review
    ));
  };

  const handleReject = (reviewId: number) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'rejected' } : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Review Management</h1>
        <p className="text-gray-600">Manage and moderate customer reviews</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg min-w-[150px]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.customerName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 mb-2">{review.comment}</p>

                {(review.orderNumber || review.menuItem) && (
                  <div className="flex gap-4 text-sm text-gray-500">
                    {review.orderNumber && (
                      <span>Order: {review.orderNumber}</span>
                    )}
                    {review.menuItem && (
                      <span>Item: {review.menuItem}</span>
                    )}
                  </div>
                )}
              </div>

              {review.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
}