"use client"

import React from 'react'

export const DashboardSkeleton: React.FC = () => (
  <div className="animate-pulse p-6">
    <div className="h-8 bg-muted rounded w-40 mb-4" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-36 bg-muted rounded" />
      <div className="h-36 bg-muted rounded" />
    </div>
  </div>
)

export const GenericViewSkeleton: React.FC = () => (
  <div className="animate-pulse p-6">
    <div className="h-6 bg-muted rounded w-48 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-3/4" />
    </div>
  </div>
)

export default null as unknown as void
