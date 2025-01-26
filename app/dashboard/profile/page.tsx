'use client'
import React from 'react';
import {
  Mail,
  Phone,
  Star,
  MapPin,
  Building,
  Users,
  Award,
  Clock,
  Edit,
  Share2,
  MessageSquare,
  Store,
  TrendingUp
} from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Header Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="/restaurant-manager-avatar.jpg"
                alt="Sarah Johnson"
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">Sarah Johnson</h1>
              <p className="text-blue-100 text-lg">Regional Operations Manager</p>
              <div className="flex items-center mt-2 text-blue-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Boston, Massachusetts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Locations Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Locations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2 locations this year</span>
            </div>
          </div>

          {/* Staff Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">248</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <span>98% retention rate</span>
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">4.8</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-600">
              <span>Top 5% of managers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:s.johnson@foodchain.com" className="text-blue-600 hover:text-blue-700">
                    s.johnson@foodchain.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Office Phone</p>
                  <p className="text-gray-900">+1 (555) 234-5678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="text-gray-900">+1 (555) 876-5432</p>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Revenue Growth</span>
                  <span className="text-green-600 font-medium">+18.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Customer Satisfaction</span>
                  <span className="text-blue-600 font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Team Performance</span>
                  <span className="text-purple-600 font-medium">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center and Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2 text-gray-500" />
                Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Store Operations</span>
                      <span className="text-sm font-medium text-gray-900">96%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Team Management</span>
                      <span className="text-sm font-medium text-gray-900">92%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-purple-600 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Customer Relations</span>
                      <span className="text-sm font-medium text-gray-900">88%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-green-600 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium">Experience</span>
                      </div>
                      <span className="text-gray-900 font-medium">8 Years</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">Locations Managed</span>
                      </div>
                      <span className="text-blue-600 font-medium">12 Active</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium">Team Size</span>
                      </div>
                      <span className="text-green-600 font-medium">248</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats or Charts could go here */}
          </div>
        </div>
      </div>
    </div>
  );
}