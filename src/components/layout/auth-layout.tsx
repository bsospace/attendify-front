import { ReactNode } from 'react';
import { config } from '@/server/config';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      {/* Pattern Particles */}
      <div className="pattern-particles"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center">
        <div className="md:max-w-fit md:max-h-fit md:space-y-8 bg-white md:rounded-lg md:shadow-lg w-full md:w-auto p-8 flex items-center">
          {children}
        </div>
        <span className="absolute bottom-4 text-gray-500 text-sm">
          - {config.appTagline} -
        </span>
      </div>
    </div>
  );
}