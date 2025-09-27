// Calendar.tsx
import React from 'react';
import type { Events, Event, EventTypes } from './types';
import { WEEKDAYS, EVENT_TYPES } from './constants';
import { getDaysInMonth, getFirstDayOfMonth, getWeatherForDate, formatDateKey } from './utils';

interface CalendarProps {
  calendarDate: Date;
  selectedDate: Date | null;
  currentDateTime: Date;
  events: Events;
  newEvent: Event;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: number) => void;
  onEventChange: (field: keyof Event, value: string) => void;
  onAddEvent: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  calendarDate,
  selectedDate,
  currentDateTime,
  events,
  newEvent,
  onDateSelect,
  onMonthChange,
  onEventChange,
  onAddEvent
}) => {
  return (
    <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">カレンダー</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onMonthChange(-1)}
            className="p-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white transition-colors text-xl"
            type="button"
          >
            ◀
          </button>
          <span className="text-white font-semibold text-lg min-w-[120px] text-center">
            {calendarDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
          </span>
          <button 
            onClick={() => onMonthChange(1)}
            className="p-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white transition-colors text-xl"
            type="button"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-white text-opacity-80 font-semibold p-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: getFirstDayOfMonth(calendarDate) }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        
        {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
          const day = i + 1;
          const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
          const dateKey = formatDateKey(date);
          const dayEvents = events[dateKey] || [];
          const weather = getWeatherForDate(date);
          const isToday = date.toDateString() === currentDateTime.toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={day}
              onClick={() => onDateSelect(date)}
              className={`p-2 min-h-[80px] rounded-lg cursor-pointer transition-colors relative
                ${isToday ? 'bg-blue-500 bg-opacity-60 border-2 border-blue-300' : 'bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20'}
                ${isSelected ? 'ring-2 ring-white ring-opacity-60' : ''}`}
            >
              <div className="text-white font-semibold">{day}</div>
              <div className="text-xs flex items-center justify-between mt-1">
                <span>{weather.icon}</span>
                <span className="text-white text-opacity-80">{weather.temp}°</span>
              </div>
              {dayEvents.length > 0 && (
                <div className="mt-1">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div 
                      key={idx} 
                      className={`text-xs p-1 rounded mb-1 truncate flex items-center gap-1 ${EVENT_TYPES[event.type as keyof EventTypes]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type as keyof EventTypes]?.bgOpacity || 'bg-opacity-50'}`}
                    >
                      <span>{EVENT_TYPES[event.type as keyof EventTypes]?.icon || '📝'}</span>
                      <span className="text-white">{event.time} {event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-white text-opacity-60">+{dayEvents.length - 2}件</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white bg-opacity-20 rounded-xl p-4 mt-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">📅</span>
            {selectedDate.toLocaleDateString('ja-JP', { 
              month: 'long', 
              day: 'numeric', 
              weekday: 'long' 
            })} の予定
          </h4>
          
          <div className="mb-4">
            {(events[formatDateKey(selectedDate)] || []).map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2 text-white">
                <span className="text-sm bg-white bg-opacity-30 px-2 py-1 rounded">{event.time}</span>
                <div className="flex items-center gap-2 flex-1">
                  <span>{EVENT_TYPES[event.type as keyof EventTypes]?.icon || '📝'}</span>
                  <span>{event.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded text-white ${EVENT_TYPES[event.type as keyof EventTypes]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type as keyof EventTypes]?.bgOpacity || 'bg-opacity-50'}`}>
                  {EVENT_TYPES[event.type as keyof EventTypes]?.label || '不明'}
                </span>
              </div>
            ))}
            {(events[formatDateKey(selectedDate)] || []).length === 0 && (
              <p className="text-white text-opacity-60 text-sm">この日の予定はありません</p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => onEventChange('time', e.target.value)}
              className="px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white text-sm"
              style={{colorScheme: 'dark'}}
            />
            <input
              type="text"
              placeholder="予定を入力"
              value={newEvent.title}
              onChange={(e) => onEventChange('title', e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white placeholder-white placeholder-opacity-70 text-sm"
            />
            <select
              value={newEvent.type}
              onChange={(e) => onEventChange('type', e.target.value)}
              className="px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white text-sm"
              style={{colorScheme: 'dark'}}
            >
              {Object.entries(EVENT_TYPES).map(([key, type]) => (
                <option key={key} value={key} className="bg-gray-800 text-white">
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <button
              onClick={onAddEvent}
              className="px-4 py-2 bg-blue-500 bg-opacity-60 hover:bg-blue-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="text-sm">➕</span>
              追加
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Calendar;