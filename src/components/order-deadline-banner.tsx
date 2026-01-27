'use client';

import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

function getNextDeadline() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours();

  // Order deadlines:
  // Sunday 12:00 PM for Monday delivery
  // Wednesday 12:00 PM for Thursday delivery

  let nextDeadline: Date;
  let deliveryDay: string;

  if (day === 0) {
    // Sunday
    if (hour < 12) {
      // Before noon Sunday - deadline is today
      nextDeadline = new Date(now);
      nextDeadline.setHours(12, 0, 0, 0);
      deliveryDay = 'Monday';
    } else {
      // After noon Sunday - deadline is Wednesday for Thursday
      nextDeadline = new Date(now);
      nextDeadline.setDate(now.getDate() + 3); // Wednesday
      nextDeadline.setHours(12, 0, 0, 0);
      deliveryDay = 'Thursday';
    }
  } else if (day === 1 || day === 2) {
    // Monday or Tuesday - deadline is Wednesday for Thursday
    nextDeadline = new Date(now);
    nextDeadline.setDate(now.getDate() + (3 - day)); // Wednesday
    nextDeadline.setHours(12, 0, 0, 0);
    deliveryDay = 'Thursday';
  } else if (day === 3) {
    // Wednesday
    if (hour < 12) {
      // Before noon Wednesday - deadline is today
      nextDeadline = new Date(now);
      nextDeadline.setHours(12, 0, 0, 0);
      deliveryDay = 'Thursday';
    } else {
      // After noon Wednesday - deadline is Sunday for Monday
      nextDeadline = new Date(now);
      nextDeadline.setDate(now.getDate() + 4); // Sunday
      nextDeadline.setHours(12, 0, 0, 0);
      deliveryDay = 'Monday';
    }
  } else {
    // Thursday, Friday, Saturday - deadline is Sunday for Monday
    nextDeadline = new Date(now);
    nextDeadline.setDate(now.getDate() + (7 - day)); // Sunday
    nextDeadline.setHours(12, 0, 0, 0);
    deliveryDay = 'Monday';
  }

  return { deadline: nextDeadline, deliveryDay };
}

function formatTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Deadline passed';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}

export function OrderDeadlineBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [deliveryDay, setDeliveryDay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const { deadline, deliveryDay: day } = getNextDeadline();
      setTimeRemaining(formatTimeRemaining(deadline));
      setDeliveryDay(day);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Hide when scrolling down, show when scrolling up or at top
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald to-emerald/90 text-white py-2.5 px-4 shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container-wide flex items-center justify-center gap-3 text-sm">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span>
          <strong>{deliveryDay} orders:</strong> Order by{' '}
          {deliveryDay === 'Monday' ? 'Sunday' : 'Wednesday'} at 12:00 PM
          <span className="mx-2">|</span>
          <span className="text-gold font-medium">{timeRemaining}</span>
        </span>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
