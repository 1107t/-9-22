// ApiKeyInput.tsx
import React from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  apiKey,
  onApiKeyChange,
  onSubmit,
  onCancel
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 max-w-md mx-auto">
      <p className="text-white text-sm mb-3">OpenWeatherMap APIキーを入力してください</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="APIキーを入力..."
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white placeholder-white placeholder-opacity-70 text-sm"
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 bg-opacity-60 hover:bg-green-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors"
          type="button"
        >
          設定
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 bg-opacity-60 hover:bg-gray-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors"
          type="button"
        >
          キャンセル
        </button>
      </div>
      <p className="text-blue-200 text-xs mt-2">
        💡 <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">
          OpenWeatherMap
        </a> で無料APIキーを取得できます
      </p>
    </div>
  );
};

export default ApiKeyInput;