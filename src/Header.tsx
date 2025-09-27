// Header.tsx
import React from 'react';
import type { ApiMode } from './types';
import { formatDate, formatTime } from './utils';

interface HeaderProps {
  currentDateTime: Date;
  apiMode: ApiMode;
  onToggleApiMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDateTime, 
  apiMode, 
  onToggleApiMode 
}) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">天気予報アプリ</h1>
      <p className="text-blue-100">世界各地の天気情報をお届け</p>
      <p className="text-blue-200 text-sm mt-1">🗾 日本全国対応 + OpenWeatherMap API連携</p>
      
      {/* API Mode Toggle */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 inline-block">
          <div className="flex items-center justify-center gap-3 text-white">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-lg font-semibold">{formatDate(currentDateTime)}</p>
              <p className="text-sm text-blue-100">{formatTime(currentDateTime)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${apiMode === 'live' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className="text-white text-sm">
                {apiMode === 'live' ? 'リアルタイム' : 'デモモード'}
              </span>
            </div>
            <button
              onClick={onToggleApiMode}
              className="px-3 py-1 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white text-sm transition-colors"
              type="button"
            >
              {apiMode === 'live' ? 'デモに切替' : 'API有効化'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;