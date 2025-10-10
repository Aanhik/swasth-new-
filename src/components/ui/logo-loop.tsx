"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoLoopProps {
  children: React.ReactNode;
  className?: string;
}

export const LogoLoop = ({ children, className }: LogoLoopProps) => {
  return (
    <div className={cn("relative flex overflow-hidden group", className)}>
      <div className="flex animate-logo-loop group-hover:[animation-play-state:paused] space-x-8">
        {children}
      </div>
      <div className="flex animate-logo-loop group-hover:[animation-play-state:paused] space-x-8" aria-hidden="true">
        {children}
      </div>
    </div>
  );
};

export default LogoLoop;
