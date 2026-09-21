import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  CalendarPlus,
  Share2,
} from 'lucide-react';
import { SchoolEvent } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

interface EventsViewProps {
  events: SchoolEvent[];
}

export const EventsView: React.FC<EventsViewProps> = ({ events }) => {
  const [filter, setFilter] = useState<'Upcoming' | 'All' | 'Completed'>('Upcoming');

  const filteredEvents = events.filter((e) => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  return (
    <div className="py-12 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            School Calendar
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Academy Events & Schedule
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Mark your calendar for upcoming science symposiums, athletic matches, arts galas, and
            parent-educator conferences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setFilter('Upcoming')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'Upcoming'
                  ? 'bg-[#0f2444] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'All'
                  ? 'bg-[#0f2444] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'Completed'
                  ? 'bg-[#0f2444] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">No events found in this view.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredEvents.map((evt) => {
              const eventDate = new Date(evt.date);
              const day = eventDate.getDate() || '15';
              const month = eventDate.toLocaleDateString(undefined, { month: 'short' }) || 'APR';

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Date badge left column */}
                  <div className="bg-slate-50 p-6 flex md:flex-col items-center justify-center min-w-[130px] border-b md:border-b-0 md:border-r border-slate-200 text-center">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                      {month}
                    </div>
                    <div className="text-4xl font-extrabold text-[#0f2444] font-display my-0.5">
                      {day}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {eventDate.getFullYear() || '2026'}
                    </div>
                  </div>

                  {/* Main Event Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <StatusBadge status={evt.status} size="sm" />
                        <span className="text-2xs font-semibold text-slate-400">
                          Albright Academy Campus
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0f2444] font-display mb-3">
                        {evt.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>{evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{evt.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Added "${evt.title}" to your reminder list!`);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2444] hover:text-amber-600 cursor-pointer"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
