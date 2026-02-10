const { useState, useEffect } = React;

// Icon Shim for Vanilla Lucide
const LucideIcon = ({ name, className = "" }) => {
  const iconRef = React.useRef(null);

  useEffect(() => {
    if (typeof lucide !== 'undefined' && iconRef.current) {
      lucide.createIcons({
        attrs: { class: className },
        nameAttr: 'data-lucide',
        icons: { [name]: lucide.icons[name] }
      });
    }
  }, [name, className]);

  return <i ref={iconRef} data-lucide={name} className={className}></i>;
};

const CalendarIcon = (props) => <LucideIcon name="calendar" {...props} />;
const UsersIcon = (props) => <LucideIcon name="users" {...props} />;
const HomeIcon = (props) => <LucideIcon name="home" {...props} />;
const SettingsIcon = (props) => <LucideIcon name="settings" {...props} />;
const LogOutIcon = (props) => <LucideIcon name="log-out" {...props} />;
const ChevronLeftIcon = (props) => <LucideIcon name="chevron-left" {...props} />;
const ChevronRightIcon = (props) => <LucideIcon name="chevron-right" {...props} />;
const AlertCircleIcon = (props) => <LucideIcon name="alert-circle" {...props} />;
const CheckIcon = (props) => <LucideIcon name="check" {...props} />;
const XIcon = (props) => <LucideIcon name="x" {...props} />;

// Initial room inventory
const INITIAL_INVENTORY = {
  'Farm House': [
    { id: 'fh1', name: 'Farmhouse #1', displayName: 'Farmhouse #1', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'fh2', name: 'Farmhouse #2', displayName: 'Farmhouse #2', bathroom: true, beds: '2 Single Beds', price: 150 },
    { id: 'fh3', name: 'Farmhouse #3', displayName: 'Farmhouse #3', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'fh4', name: 'Farmhouse #4', displayName: 'Farmhouse #4', bathroom: false, beds: '2 Single Beds', price: 100 },
    { id: 'fh5', name: 'Farmhouse #5', displayName: 'Farmhouse #5', bathroom: false, beds: '1 Queen Bed', price: 100 },
    { id: 'fh6', name: 'Farmhouse #6', displayName: 'Farmhouse #6', bathroom: false, beds: '2 Single Beds', price: 100 },
  ],
  'Club House': [
    { id: 'ch1', name: 'Clubhouse #1', displayName: 'Clubhouse #1', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'ch2', name: 'Clubhouse #2', displayName: 'Clubhouse #2', bathroom: true, beds: '2 Single Beds', price: 150 },
    { id: 'ch3', name: 'Clubhouse #3', displayName: 'Clubhouse #3', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'ch4', name: 'Clubhouse #4', displayName: 'Clubhouse #4', bathroom: false, beds: '2 Single Beds', price: 100 },
    { id: 'ch5', name: 'Clubhouse #5', displayName: 'Clubhouse #5', bathroom: false, beds: '1 Queen Bed', price: 100 },
    { id: 'ch6', name: 'Clubhouse #6', displayName: 'Clubhouse #6', bathroom: false, beds: '2 Single Beds', price: 100 },
  ],
  'Lazy Lodge': [
    { id: 'll1', name: 'Lazy Lodge #1', displayName: 'Lazy Lodge #1', bathroom: true, beds: '1 Queen Bed', price: 200 },
    { id: 'll2', name: 'Lazy Lodge #2', displayName: 'Lazy Lodge #2', bathroom: true, beds: '1 Queen Bed', price: 200 },
  ]
};

// Flatten inventory for booking selection
const getAllRooms = (inventory) => {
  const rooms = [];
  Object.entries(inventory).forEach(([building, buildingRooms]) => {
    buildingRooms.forEach(room => {
      rooms.push({ ...room, building });
    });
  });
  return rooms;
};

const MEAL_TIMES = {
  breakfast: '8:00 AM',
  lunch: '12:30 PM',
  barSupper: '6:00 PM'
};


// Confirmation Modal Component
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-stone-900 mb-4">{message}</h3>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Modal Component
const ExportModal = ({ isOpen, onClose, data, filename }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    alert('CSV data copied to clipboard!');
  };

  const handleDownload = () => {
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">Export Bookings</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-stone-600 mb-4">
          Below is your booking data in CSV format. You can copy it to your clipboard or try downloading it as a file.
        </p>

        <textarea
          readOnly
          value={data}
          className="w-full h-64 p-3 bg-stone-50 border border-stone-200 rounded-lg font-mono text-xs mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors border border-stone-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy to Clipboard
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2"
          >
            <LucideIcon name="download" className="w-4 h-4" />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};

// Components
// Login View
const LoginView = ({ username, setUsername, handleLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <img
              src="logo.png"
              alt="Tuscarora Club Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-light text-emerald-900" style={{ fontFamily: 'Georgia, serif' }}>The Tuscarora Club</h1>
          <p className="text-amber-700 mt-2 font-light">Member Portal</p>
          <p className="text-stone-400 text-xs mt-1">v4.1</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              placeholder="Chris, Markley, David, Rob, Kerry, or admin"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-emerald-700 text-white py-2 px-4 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Sign In
          </button>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-800 font-medium mb-2">Demo Accounts:</p>
            <p className="text-xs text-stone-600">Chris, Markley, David, Rob, Kerry, admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar View
const CalendarView = ({
  currentDate,
  calendarView,
  setCalendarView,
  navigateCalendar,
  setCurrentDate,
  startBooking,
  inventory,
  isRoomAvailable,
  bookings,
  selectedCells,
  setSelectedCells,
  setBookingMode,
  currentUser,
  lazyLodgeHistory,
  hasRentedLazyLodge
}) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getThreeWeeks = (date) => {
    const startOfCentralWeek = new Date(date);
    startOfCentralWeek.setDate(date.getDate() - date.getDay());

    const startOfThreeWeeks = new Date(startOfCentralWeek);
    startOfThreeWeeks.setDate(startOfCentralWeek.getDate() - 7);

    const days = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(startOfThreeWeeks);
      d.setDate(startOfThreeWeeks.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const monthHeaderDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = calendarView === 'month' ? getDaysInMonth(currentDate) : [];
  const threeWeeks = calendarView === 'week' ? getThreeWeeks(currentDate) : [];
  const displayDays = calendarView === 'month' ? monthDays : threeWeeks;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-emerald-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          {calendarView === 'week' && (
            <p className="text-sm text-stone-500 mt-1">
              3-Week View: {threeWeeks[0] ? threeWeeks[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} -
              {threeWeeks[20] ? threeWeeks[20].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 rounded ${calendarView === 'month' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'}`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 rounded ${calendarView === 'week' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'}`}
            >
              Week
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigateCalendar(-1)} className="p-2 hover:bg-emerald-100 rounded text-emerald-800">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 hover:bg-emerald-100 rounded text-sm text-emerald-800">
              Today
            </button>
            <button onClick={() => navigateCalendar(1)} className="p-2 hover:bg-emerald-100 rounded text-emerald-800">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar content */}
      {calendarView === 'month' ? (
        <div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {monthHeaderDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-stone-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {displayDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="aspect-square"></div>;

              const dateStr = formatDate(day);
              const isToday = formatDate(new Date()) === dateStr;
              const isPast = day < new Date(2026, 1, 4);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(day);
                    setCalendarView('week');
                  }}
                  className={`min-h-[140px] border rounded-lg p-1.5 cursor-pointer transition-all ${isToday ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-stone-200 hover:border-emerald-400 hover:bg-emerald-50'
                    } ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-sm font-medium text-stone-800 mb-1 flex justify-between">
                    <span>{day.getDate()}</span>
                    {isToday && <span className="text-[10px] bg-emerald-600 text-white px-1 rounded uppercase">Today</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] leading-tight">
                    {getAllRooms(inventory).map(room => {
                      const booking = bookings.find(b =>
                        b.roomId === room.id &&
                        dateStr >= b.startDate &&
                        dateStr < b.endDate
                      );
                      return (
                        <div key={room.id} className={`truncate flex justify-between gap-1 ${booking ? 'text-red-700 font-medium' : 'text-stone-400'}`}>
                          <span>{room.id.toUpperCase()}:</span>
                          <span className="truncate">
                            {booking ? (
                              booking.isGuest ? `${booking.member} (G)` : booking.member
                            ) : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] border border-stone-300 rounded-lg overflow-hidden">
            {/* Single Grid Container for perfect alignment */}
            <div className="grid" style={{ gridTemplateColumns: '150px repeat(21, minmax(0, 1fr))' }}>
              {/* Header Row */}
              <div className="bg-stone-50 p-2 text-sm font-medium text-stone-600 border-r border-b border-stone-300 sticky left-0 z-10">
                Room
              </div>
              {threeWeeks.map((day, idx) => {
                const dateStr = formatDate(day);
                const isToday = formatDate(new Date()) === dateStr;
                const dayOfWeek = day.getDay();
                const isSat = dayOfWeek === 6;
                const isSun = dayOfWeek === 0;
                const isMon = dayOfWeek === 1;
                const isWeekend = isSat || isSun;

                return (
                  <div
                    key={`header-${idx}`}
                    className={`p-2 text-center text-[10px] border-r border-b border-stone-300
                      ${isToday ? 'bg-emerald-600 text-white' : isWeekend ? 'bg-amber-50 text-stone-900' : 'bg-stone-50 text-stone-600'}
                      ${isMon ? 'border-l-2 border-stone-400' : ''}`}
                  >
                    <div className="font-bold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div>{day.getDate()}</div>
                  </div>
                );
              })}

              {/* Body Rows */}
              {getAllRooms(inventory).map(room => (
                <React.Fragment key={room.id}>
                  <div className="bg-white p-2 text-xs font-medium text-stone-800 truncate border-r border-b border-stone-200 sticky left-0 z-10">
                    {room.name}
                  </div>
                  {threeWeeks.map((day, idx) => {
                    const dateStr = formatDate(day);
                    const booking = bookings.find(b =>
                      b.roomId === room.id &&
                      dateStr >= b.startDate &&
                      dateStr < b.endDate
                    );
                    const dayOfWeek = day.getDay();
                    const isSat = dayOfWeek === 6;
                    const isSun = dayOfWeek === 0;
                    const isMon = dayOfWeek === 1;
                    const isWeekend = isSat || isSun;
                    const isSelected = selectedCells.some(cell => cell.roomId === room.id && cell.date === dateStr);

                    // Lazy Lodge logic
                    const isLazyLodge = room.id === 'll1' || room.id === 'll2';
                    const year = new Date(dateStr).getFullYear();
                    const userHasUsedLL = hasRentedLazyLodge(currentUser, year);
                    const showProvisionalIndicator = !booking && isLazyLodge && userHasUsedLL;
                    const isProvisionalBooking = booking && booking.provisional;
                    const canOverrideProvisional = isProvisionalBooking && isLazyLodge && !userHasUsedLL;

                    const handleCellClick = () => {
                      // Allow selecting if: no booking OR provisional booking that user can override
                      if (booking && !canOverrideProvisional) return;

                      if (isSelected) {
                        setSelectedCells(selectedCells.filter(cell => !(cell.roomId === room.id && cell.date === dateStr)));
                      } else {
                        setSelectedCells([...selectedCells, { roomId: room.id, date: dateStr }]);
                      }
                    };

                    return (
                      <div
                        key={`${room.id}-${idx}`}
                        onClick={handleCellClick}
                        className={`h-12 transition-colors cursor-pointer flex items-center justify-center p-0.5 border-r border-b border-stone-200
                          ${booking && !canOverrideProvisional ? 'bg-emerald-100 cursor-not-allowed' :
                            isProvisionalBooking ? 'bg-amber-100 hover:bg-amber-200' :
                            isSelected ? 'bg-blue-500 hover:bg-blue-600' :
                            isWeekend ? 'bg-amber-50/30 hover:bg-emerald-50' :
                            'bg-white hover:bg-emerald-50'}
                          ${isMon ? 'border-l-2 border-stone-400' : ''}`}
                      >
                        {booking && !canOverrideProvisional ? (
                          <div className={`w-full h-full rounded text-[9px] flex flex-col items-center justify-center px-1 truncate font-medium shadow-sm leading-tight
                            ${isProvisionalBooking ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'}`}>
                            <div className="truncate w-full text-center">
                              {isProvisionalBooking ? 'Provisional' : booking.member}
                            </div>
                            {booking.isGuest && !isProvisionalBooking && <div className="opacity-80 font-normal">guest</div>}
                          </div>
                        ) : isProvisionalBooking && canOverrideProvisional ? (
                          <div className="w-full h-full bg-amber-600 text-white rounded text-[9px] flex flex-col items-center justify-center px-1 truncate font-medium shadow-sm leading-tight">
                            <div className="truncate w-full text-center">Provisional</div>
                            <div className="text-[8px] opacity-90">(click to override)</div>
                          </div>
                        ) : isSelected ? (
                          <CheckIcon className="w-5 h-5 text-white" />
                        ) : showProvisionalIndicator ? (
                          <div className="text-3xl font-bold text-stone-400">P</div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <div className="flex gap-6 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-600 bg-emerald-50 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[10px] font-bold">XX: —</span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-700 text-[10px] font-bold">XX: name</span>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-3xl font-bold">P</span>
            <span>Provisional (Lazy Lodge)</span>
          </div>
        </div>

        {/* Selection Actions */}
        {calendarView === 'week' && selectedCells.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-stone-600">
              <span className="font-semibold text-emerald-700">{selectedCells.length}</span> room-day{selectedCells.length !== 1 ? 's' : ''} selected
            </div>
            <button
              onClick={() => setSelectedCells([])}
              className="px-4 py-2 text-sm border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setBookingMode('details')}
              className="px-6 py-2 text-sm bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Booking Flow
const BookingFlow = ({
  bookingStep,
  setBookingStep,
  newBooking,
  setNewBooking,
  bookingWarnings,
  setBookingWarnings,
  confirmBooking,
  setView,
  isRoomAvailable,
  getRoomById,
  inventory,
  validateAndProceed,
  getAllRooms,
  mealTimesConfig,
  bookings
}) => {
  // Step 1: Select Room & Dates (Grid View)
  if (bookingStep === 1) {
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Generate next 7 days from start date
    const gridDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(newBooking.startDate);
      d.setDate(d.getDate() + i);
      return d;
    });

    const handleGridClick = (room, date) => {
      const dateStr = formatDate(date);

      // If clicking same room that is already selected
      if (newBooking.roomId === room.id) {
        // If clicking a date after start date, set end date
        if (dateStr > newBooking.startDate) {
          // Check if any dates in between are booked
          const isRangeAvailable = isRoomAvailable(room.id, newBooking.startDate, dateStr);
          if (isRangeAvailable) {
            setNewBooking({ ...newBooking, endDate: formatDate(new Date(date.getTime() + 86400000)) }); // Set end date to next day (checkout)
          } else {
            alert('Cannot book range: room is occupied on intermediate dates.');
          }
        } else {
          // Reset start date if clicking before or same
          setNewBooking({ ...newBooking, startDate: dateStr, endDate: '' });
        }
      } else {
        // New room selection
        if (isRoomAvailable(room.id, dateStr, formatDate(new Date(date.getTime() + 86400000)))) {
          setNewBooking({
            ...newBooking,
            roomId: room.id,
            building: room.building,
            startDate: dateStr,
            endDate: ''
          });
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-emerald-900">Select Room & Dates</h2>
          <button onClick={() => setView('calendar')} className="text-stone-600 hover:text-stone-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[150px_repeat(7,1fr)] bg-stone-50 border-b border-stone-200">
            <div className="p-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Room</div>
            {gridDates.map((day, idx) => (
              <div key={idx} className="p-2 text-center border-l border-stone-200">
                <div className="text-xs font-bold text-stone-700">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-xs text-stone-500">{day.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-stone-200">
            {getAllRooms(inventory).map(room => (
              <div key={room.id} className={`grid grid-cols-[150px_repeat(7,1fr)] hover:bg-stone-50 transition-colors ${newBooking.roomId === room.id ? 'bg-emerald-50' : ''}`}>
                <div className="p-3 text-sm font-medium text-stone-900 truncate border-r border-stone-200 flex flex-col justify-center">
                  {room.displayName}
                  <span className="text-[10px] text-stone-500 font-normal">{room.beds} • {room.bathroom ? 'Pv' : 'Sh'}</span>
                </div>
                {gridDates.map((day, idx) => {
                  const dateStr = formatDate(day);

                  // Find actual booking object if occupied
                  const booking = bookings && bookings.find(b =>
                    b.roomId === room.id &&
                    dateStr >= b.startDate &&
                    dateStr < b.endDate
                  );

                  const isAvailable = !booking;
                  const isSelected = newBooking.roomId === room.id;
                  const isStart = isSelected && newBooking.startDate === dateStr;
                  const isInRange = isSelected && newBooking.endDate && dateStr >= newBooking.startDate && dateStr < newBooking.endDate;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleGridClick(room, day)}
                      className={`border-l border-stone-200 h-16 cursor-pointer flex items-center justify-center text-[10px] relative px-1
                         ${!isAvailable ? 'bg-red-50 cursor-not-allowed' : ''}
                         ${isAvailable && !isSelected ? 'hover:bg-emerald-100' : ''}
                         ${isInRange ? 'bg-emerald-200' : ''}
                         ${isStart ? 'bg-emerald-600 text-white' : ''}
                       `}
                    >
                      {!isAvailable ? (
                        <div className="text-red-800 font-medium text-center leading-tight truncate w-full" title={booking.member}>
                          {booking.member}
                          {booking.isGuest && <div className="text-[8px] font-normal opacity-75">Guest</div>}
                        </div>
                      ) : (
                        isStart ? 'Start' : isInRange ? 'Stay' : ''
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-stone-600">
          <p>Click a date to start. Click a later date to confirm range.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setView('calendar')}
              className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={validateAndProceed}
              disabled={!newBooking.roomId || !newBooking.startDate || !newBooking.endDate}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Guests & Arrival
  if (bookingStep === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-emerald-900">Guest Details</h2>
          <div className="text-sm text-stone-500">Step 2 of 3</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Number of Guests (including yourself)
            </label>
            <input
              type="number"
              min="1"
              value={newBooking.guests}
              onChange={(e) => setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Member Arrival Time</label>
              <input
                type="time"
                value={newBooking.memberArrival}
                onChange={(e) => setNewBooking({ ...newBooking, memberArrival: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Guest Arrival Time</label>
              <input
                type="time"
                value={newBooking.guestArrival}
                onChange={(e) => setNewBooking({ ...newBooking, guestArrival: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <label className="flex items-center gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
              <input
                type="checkbox"
                checked={newBooking.isGuestRoom}
                onChange={(e) => setNewBooking({ ...newBooking, isGuestRoom: e.target.checked })}
                className="w-5 h-5 text-emerald-700 rounded border-stone-300"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-900">Guest-Only Room</div>
                <div className="text-xs text-amber-700 leading-relaxed">
                  Is this room for guests only (you will be staying in a different room)?
                  <span className="block mt-1 font-medium italic">NOTE: Members MUST be at the club while guests are present.</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setBookingStep(1)}
            className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Back
          </button>
          <button
            onClick={validateAndProceed}
            className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Meals & Confirmation
  if (bookingStep === 3) {
    const room = getRoomById(newBooking.roomId);

    // Generate array of dates for the stay
    const getDatesInStay = () => {
      const dates = [];
      const start = new Date(newBooking.startDate);
      const end = new Date(newBooking.endDate);
      const current = new Date(start);

      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    const stayDates = getDatesInStay();

    // Initialize dailyMeals if empty
    if (Object.keys(newBooking.dailyMeals).length === 0 && stayDates.length > 0) {
      const initialDailyMeals = {};
      stayDates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        initialDailyMeals[dateStr] = {
          breakfast: false,
          lunch: false,
          barSupper: false,
          packedBreakfast: false,
          packedLunch: false,
          packedBarSupper: false
        };
      });
      setNewBooking({ ...newBooking, dailyMeals: initialDailyMeals });
    }

    const updateMeal = (dateStr, meal, value) => {
      setNewBooking({
        ...newBooking,
        dailyMeals: {
          ...newBooking.dailyMeals,
          [dateStr]: {
            ...newBooking.dailyMeals[dateStr],
            [meal]: value,
            // Reset packed option if meal is unchecked
            ...((!value && meal === 'breakfast') ? { packedBreakfast: false } : {}),
            ...((!value && meal === 'lunch') ? { packedLunch: false } : {}),
            ...((!value && meal === 'barSupper') ? { packedBarSupper: false } : {})
          }
        }
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-emerald-900">Meals & Confirmation</h2>
          <div className="text-sm text-stone-500">Step 3 of 3</div>
        </div>

        {bookingWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            {bookingWarnings.map((warning, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{warning}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-stone-50 rounded-lg p-6 space-y-3">
          <h3 className="font-medium text-emerald-900">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Building:</span>
              <span className="font-medium">{newBooking.building}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Room:</span>
              <span className="font-medium">{room ? room.name : ''} ({room ? room.beds : ''})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Dates:</span>
              <span className="font-medium">
                {new Date(newBooking.startDate).toLocaleDateString()} - {new Date(newBooking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Guests:</span>
              <span className="font-medium">{newBooking.guests}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Meals by Day (for {newBooking.guests} guest{newBooking.guests > 1 ? 's' : ''})
            </label>
            <div className="space-y-4">
              {stayDates.map((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayData = newBooking.dailyMeals[dateStr] || {};
                const isFirstDay = dayIndex === 0;
                const isLastDay = dayIndex === stayDates.length - 1;

                return (
                  <div key={dateStr} className="border border-stone-300 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-emerald-900">
                        Day {dayIndex + 1} - {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h4>
                      {isFirstDay && (
                        <div className="flex gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-stone-600">Arrival:</span>
                            <span className="font-medium">{newBooking.memberArrival || 'Not set'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {/* Special handling for single-day stays */}
                      {isFirstDay && isLastDay ? (
                        <>
                          <div className="text-xs text-stone-600 italic mb-2">
                            Single day stay - Lunch and Bar Supper available
                          </div>
                          {/* Lunch for arrival day */}
                          <div className="flex items-center gap-3 p-2 border border-stone-200 rounded bg-stone-50">
                            <input
                              type="checkbox"
                              checked={dayData.lunch || false}
                              onChange={(e) => updateMeal(dateStr, 'lunch', e.target.checked)}
                              className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-stone-800">Lunch</div>
                              <div className="text-xs text-stone-500">{mealTimesConfig.lunch}</div>
                            </div>
                            {dayData.lunch && (
                              <label className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dayData.packedLunch || false}
                                  onChange={(e) => updateMeal(dateStr, 'packedLunch', e.target.checked)}
                                  className="w-3 h-3 text-emerald-700 rounded"
                                />
                                <span className="text-xs text-emerald-800">Packed</span>
                              </label>
                            )}
                          </div>
                          {/* Bar Supper for arrival day */}
                          <div className="flex items-center gap-3 p-2 border border-stone-200 rounded bg-stone-50">
                            <input
                              type="checkbox"
                              checked={dayData.barSupper || false}
                              onChange={(e) => updateMeal(dateStr, 'barSupper', e.target.checked)}
                              className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-stone-800">Bar Supper</div>
                              <div className="text-xs text-stone-500">{mealTimesConfig.barSupper}</div>
                            </div>
                            {dayData.barSupper && (
                              <label className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dayData.packedBarSupper || false}
                                  onChange={(e) => updateMeal(dateStr, 'packedBarSupper', e.target.checked)}
                                  className="w-3 h-3 text-emerald-700 rounded"
                                />
                                <span className="text-xs text-emerald-800">Packed</span>
                              </label>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Breakfast - Not on first day arrival, available on checkout */}
                          {!isFirstDay && (
                            <div className="flex items-center gap-3 p-2 border border-stone-200 rounded bg-stone-50">
                              <input
                                type="checkbox"
                                checked={dayData.breakfast || false}
                                onChange={(e) => updateMeal(dateStr, 'breakfast', e.target.checked)}
                                className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-stone-800">Breakfast</div>
                                <div className="text-xs text-stone-500">{mealTimesConfig.breakfast}</div>
                              </div>
                              {dayData.breakfast && (
                                <label className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={dayData.packedBreakfast || false}
                                    onChange={(e) => updateMeal(dateStr, 'packedBreakfast', e.target.checked)}
                                    className="w-3 h-3 text-emerald-700 rounded"
                                  />
                                  <span className="text-xs text-emerald-800">Packed</span>
                                </label>
                              )}
                            </div>
                          )}

                          {/* Lunch - Available on arrival and full days, not on checkout */}
                          {!isLastDay && (
                            <div className="flex items-center gap-3 p-2 border border-stone-200 rounded bg-stone-50">
                              <input
                                type="checkbox"
                                checked={dayData.lunch || false}
                                onChange={(e) => updateMeal(dateStr, 'lunch', e.target.checked)}
                                className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-stone-800">Lunch</div>
                                <div className="text-xs text-stone-500">{mealTimesConfig.lunch}</div>
                              </div>
                              {dayData.lunch && (
                                <label className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={dayData.packedLunch || false}
                                    onChange={(e) => updateMeal(dateStr, 'packedLunch', e.target.checked)}
                                    className="w-3 h-3 text-emerald-700 rounded"
                                  />
                                  <span className="text-xs text-emerald-800">Packed</span>
                                </label>
                              )}
                            </div>
                          )}

                          {/* Bar Supper - Available on arrival and full days, not on checkout */}
                          {!isLastDay && (
                            <div className="flex items-center gap-3 p-2 border border-stone-200 rounded bg-stone-50">
                              <input
                                type="checkbox"
                                checked={dayData.barSupper || false}
                                onChange={(e) => updateMeal(dateStr, 'barSupper', e.target.checked)}
                                className="w-4 h-4 text-emerald-700 rounded border-stone-300"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-stone-800">Bar Supper</div>
                                <div className="text-xs text-stone-500">{mealTimesConfig.barSupper}</div>
                              </div>
                              {dayData.barSupper && (
                                <label className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={dayData.packedBarSupper || false}
                                    onChange={(e) => updateMeal(dateStr, 'packedBarSupper', e.target.checked)}
                                    className="w-3 h-3 text-emerald-700 rounded"
                                  />
                                  <span className="text-xs text-emerald-800">Packed</span>
                                </label>
                              )}
                            </div>
                          )}

                          {/* Checkout day message */}
                          {isLastDay && !isFirstDay && (
                            <div className="text-xs text-stone-600 italic mt-2">
                              Checkout day - Breakfast only available
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setBookingStep(2)}
            className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Back
          </button>
          <button
            onClick={confirmBooking}
            className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  }
};

// Multi-Room Booking Details Page
const MultiRoomBookingDetails = ({
  selectedCells,
  setSelectedCells,
  setBookingMode,
  getRoomById,
  confirmMultiRoomBooking,
  mealTimesConfig
}) => {
  // Group selected cells by room into continuous date ranges
  const groupSelectionsByRoom = () => {
    const roomGroups = {};

    selectedCells.forEach(cell => {
      if (!roomGroups[cell.roomId]) {
        roomGroups[cell.roomId] = [];
      }
      roomGroups[cell.roomId].push(cell.date);
    });

    // Sort dates for each room and create continuous ranges
    const roomBookings = [];
    Object.entries(roomGroups).forEach(([roomId, dates]) => {
      dates.sort();

      // Group into continuous date ranges
      let currentRange = [dates[0]];
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i-1]);
        const currDate = new Date(dates[i]);
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          currentRange.push(dates[i]);
        } else {
          // Start new range
          const room = getRoomById(roomId);
          roomBookings.push({
            roomId,
            roomName: room?.name || roomId,
            building: room?.building || '',
            startDate: currentRange[0],
            endDate: getNextDay(currentRange[currentRange.length - 1]),
            dates: [...currentRange],
            guestName: '',
            guests: 1,
            dailyMeals: {}
          });
          currentRange = [dates[i]];
        }
      }

      // Add final range
      if (currentRange.length > 0) {
        const room = getRoomById(roomId);
        roomBookings.push({
          roomId,
          roomName: room?.name || roomId,
          building: room?.building || '',
          startDate: currentRange[0],
          endDate: getNextDay(currentRange[currentRange.length - 1]),
          dates: [...currentRange],
          guestName: '',
          guests: 1,
          dailyMeals: {}
        });
      }
    });

    return roomBookings;
  };

  const getNextDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const isMealAvailable = (dateStr, mealType) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // No meals between Sunday lunch and Tuesday breakfast inclusive
    // Sunday lunch: not available
    // Sunday dinner (barSupper): not available
    // Monday all meals: not available (dayOfWeek === 1)
    // Tuesday breakfast: not available (dayOfWeek === 2, meal === breakfast)

    if (dayOfWeek === 0 && mealType === 'lunch') return false; // Sunday lunch
    if (dayOfWeek === 0 && mealType === 'barSupper') return false; // Sunday dinner
    if (dayOfWeek === 1) return false; // Monday - all meals
    if (dayOfWeek === 2 && mealType === 'breakfast') return false; // Tuesday breakfast

    return true;
  };

  const initializeDefaultMeals = (dates) => {
    const meals = {};
    dates.forEach((date, index) => {
      const isFirstDay = index === 0;
      const isLastDay = index === dates.length - 1;
      const isSingleDay = dates.length === 1;

      meals[date] = {
        breakfast: false,
        lunch: false,
        barSupper: false,
        packedBreakfast: false,
        packedLunch: false,
        packedBarSupper: false
      };

      // Default: Start with bar supper on first day, end with lunch on last day
      if (isSingleDay) {
        // Single day: lunch and bar supper
        meals[date].lunch = isMealAvailable(date, 'lunch');
        meals[date].barSupper = isMealAvailable(date, 'barSupper');
      } else if (isFirstDay) {
        // First day: lunch and bar supper
        meals[date].lunch = isMealAvailable(date, 'lunch');
        meals[date].barSupper = isMealAvailable(date, 'barSupper');
      } else if (isLastDay) {
        // Last day: breakfast and lunch
        meals[date].breakfast = isMealAvailable(date, 'breakfast');
        meals[date].lunch = isMealAvailable(date, 'lunch');
      } else {
        // Middle days: all meals
        meals[date].breakfast = isMealAvailable(date, 'breakfast');
        meals[date].lunch = isMealAvailable(date, 'lunch');
        meals[date].barSupper = isMealAvailable(date, 'barSupper');
      }
    });

    return meals;
  };

  const [roomBookings, setRoomBookings] = React.useState(() => {
    const initial = groupSelectionsByRoom();
    return initial.map(rb => ({
      ...rb,
      dailyMeals: initializeDefaultMeals(rb.dates)
    }));
  });

  const [partyArrivalTime, setPartyArrivalTime] = React.useState('');

  const updateRoomBooking = (index, field, value) => {
    const updated = [...roomBookings];
    updated[index] = { ...updated[index], [field]: value };
    setRoomBookings(updated);
  };

  const updateMeal = (roomIndex, dateStr, mealField, value) => {
    const updated = [...roomBookings];
    updated[roomIndex].dailyMeals[dateStr] = {
      ...updated[roomIndex].dailyMeals[dateStr],
      [mealField]: value
    };
    setRoomBookings(updated);
  };

  const handleConfirm = () => {
    confirmMultiRoomBooking(roomBookings, partyArrivalTime);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-emerald-900">Booking Details</h2>
        <button
          onClick={() => setBookingMode('calendar')}
          className="text-sm text-stone-600 hover:text-emerald-700"
        >
          ← Back to Selection
        </button>
      </div>

      {/* Party Arrival Time */}
      <div className="bg-stone-50 rounded-lg p-6">
        <h3 className="font-medium text-emerald-900 mb-4">Party Information</h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Arrival Time (for entire party)
          </label>
          <select
            value={partyArrivalTime}
            onChange={(e) => setPartyArrivalTime(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="">Select arrival time...</option>
            <option value="07:00">7:00 AM</option>
            <option value="07:30">7:30 AM</option>
            <option value="08:00">8:00 AM</option>
            <option value="08:30">8:30 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="09:30">9:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="13:30">1:30 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="14:30">2:30 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="15:30">3:30 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="16:30">4:30 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
            <option value="21:30">9:30 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>
      </div>

      {/* Room Bookings */}
      <div className="space-y-6">
        {roomBookings.map((booking, roomIndex) => (
          <div key={roomIndex} className="border border-stone-300 rounded-lg p-6 bg-white">
            <h3 className="font-semibold text-emerald-900 mb-4">
              {booking.roomName} ({booking.building})
            </h3>
            <div className="text-sm text-stone-600 mb-4">
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              <span className="ml-2">({booking.dates.length} night{booking.dates.length !== 1 ? 's' : ''})</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Guest Name / Description
                </label>
                <input
                  type="text"
                  value={booking.guestName}
                  onChange={(e) => updateRoomBooking(roomIndex, 'guestName', e.target.value)}
                  placeholder="e.g., Smith Family"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={booking.guests}
                  onChange={(e) => updateRoomBooking(roomIndex, 'guests', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Meals by Day */}
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3">Meals</h4>
              <div className="space-y-2">
                {booking.dates.map((date, dayIndex) => {
                  const dayData = booking.dailyMeals[date];
                  const isFirstDay = dayIndex === 0;
                  const isLastDay = dayIndex === booking.dates.length - 1;
                  const dateObj = new Date(date);
                  const dayOfWeek = dateObj.getDay();
                  const showNoMeals = dayOfWeek === 1;

                  return (
                    <div key={date} className="grid grid-cols-[140px_1fr] gap-4 border border-stone-200 rounded p-3 bg-stone-50">
                      {/* Date column */}
                      <div className="flex flex-col justify-center">
                        <div className="font-medium text-sm text-stone-800">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        {showNoMeals && (
                          <div className="text-xs text-amber-700 mt-1">No meals served</div>
                        )}
                      </div>

                      {/* Meals column - stacked vertically */}
                      <div className="space-y-1">
                        {/* Breakfast */}
                        {!isFirstDay && (
                          <div className={`flex items-center justify-between ${!isMealAvailable(date, 'breakfast') ? 'opacity-60' : ''}`}>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={dayData.breakfast}
                                disabled={!isMealAvailable(date, 'breakfast')}
                                onChange={(e) => updateMeal(roomIndex, date, 'breakfast', e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span className={`font-medium ${!isMealAvailable(date, 'breakfast') ? 'line-through' : ''}`}>
                                Breakfast
                              </span>
                            </label>
                            {dayData.breakfast && (
                              <label className="flex items-center gap-1 text-xs text-stone-600">
                                <input
                                  type="checkbox"
                                  checked={dayData.packedBreakfast}
                                  onChange={(e) => updateMeal(roomIndex, date, 'packedBreakfast', e.target.checked)}
                                  className="w-3 h-3"
                                />
                                <span>Packed</span>
                              </label>
                            )}
                          </div>
                        )}

                        {/* Lunch */}
                        {(isFirstDay || !isLastDay || booking.dates.length > 1) && (
                          <div className={`flex items-center justify-between ${!isMealAvailable(date, 'lunch') ? 'opacity-60' : ''}`}>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={dayData.lunch}
                                disabled={!isMealAvailable(date, 'lunch')}
                                onChange={(e) => updateMeal(roomIndex, date, 'lunch', e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span className={`font-medium ${!isMealAvailable(date, 'lunch') ? 'line-through' : ''}`}>
                                Lunch
                              </span>
                            </label>
                            {dayData.lunch && (
                              <label className="flex items-center gap-1 text-xs text-stone-600">
                                <input
                                  type="checkbox"
                                  checked={dayData.packedLunch}
                                  onChange={(e) => updateMeal(roomIndex, date, 'packedLunch', e.target.checked)}
                                  className="w-3 h-3"
                                />
                                <span>Packed</span>
                              </label>
                            )}
                          </div>
                        )}

                        {/* Bar Supper */}
                        {!isLastDay && (
                          <div className={`flex items-center justify-between ${!isMealAvailable(date, 'barSupper') ? 'opacity-60' : ''}`}>
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={dayData.barSupper}
                                disabled={!isMealAvailable(date, 'barSupper')}
                                onChange={(e) => updateMeal(roomIndex, date, 'barSupper', e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span className={`font-medium ${!isMealAvailable(date, 'barSupper') ? 'line-through' : ''}`}>
                                Bar Supper
                              </span>
                            </label>
                            {dayData.barSupper && (
                              <label className="flex items-center gap-1 text-xs text-stone-600">
                                <input
                                  type="checkbox"
                                  checked={dayData.packedBarSupper}
                                  onChange={(e) => updateMeal(roomIndex, date, 'packedBarSupper', e.target.checked)}
                                  className="w-3 h-3"
                                />
                                <span>Packed</span>
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setBookingMode('calendar')}
          className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          Confirm Bookings
        </button>
      </div>
    </div>
  );
};

// My Reservations View
const MyReservationsView = ({ bookings, currentUser, getRoomById, cancelBooking, setView }) => {
  const userBookings = bookings.filter(b => b.member === currentUser);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-stone-800">My Reservations</h2>

      {userBookings.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-stone-500">No reservations found</p>
          <button
            onClick={() => setView('calendar')}
            className="mt-4 px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Make a Reservation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map(booking => {
            const room = getRoomById(booking.roomId);
            return (
              <div key={booking.id} className="border border-stone-200 rounded-lg p-6 space-y-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{booking.building} - {booking.roomName}</h3>
                      {booking.provisional && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded font-medium">
                          Provisional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-600 mt-1">
                      {new Date(booking.startDate).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })} - {new Date(booking.endDate).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this reservation?')) {
                        cancelBooking(booking.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone-600">Guests:</span>
                    <span className="ml-2 font-medium">{booking.guests}</span>
                  </div>
                  <div>
                    <span className="text-stone-600">Arrival:</span>
                    <span className="ml-2 font-medium">{booking.memberArrival}</span>
                  </div>
                </div>

                {/* Display meals - supports both old format (meals object) and new format (dailyMeals) */}
                {booking.dailyMeals ? (
                  Object.keys(booking.dailyMeals).length > 0 && (
                    <div>
                      <div className="text-sm text-stone-600 mb-2">Meals by Day:</div>
                      <div className="space-y-2">
                        {Object.entries(booking.dailyMeals).map(([date, meals]) => {
                          const hasMeals = meals.breakfast || meals.lunch || meals.barSupper;
                          if (!hasMeals) return null;

                          return (
                            <div key={date} className="text-xs">
                              <div className="font-medium text-stone-700 mb-1">
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {meals.breakfast && (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                                    Breakfast {meals.packedBreakfast ? '(Packed)' : ''}
                                  </span>
                                )}
                                {meals.lunch && (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                                    Lunch {meals.packedLunch ? '(Packed)' : ''}
                                  </span>
                                )}
                                {meals.barSupper && (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-100">
                                    Bar Supper {meals.packedBarSupper ? '(Packed)' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                ) : (booking.meals && (booking.meals.breakfast || booking.meals.lunch || booking.meals.barSupper)) ? (
                  <div>
                    <div className="text-sm text-stone-600 mb-2">Meals (legacy format):</div>
                    <div className="flex flex-wrap gap-2">
                      {booking.meals.breakfast && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-100">
                          Breakfast {(booking.packedMeals && booking.packedMeals.breakfast) ? '(Packed)' : ''}
                        </span>
                      )}
                      {booking.meals.lunch && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-100">
                          Lunch {(booking.packedMeals && booking.packedMeals.lunch) ? '(Packed)' : ''}
                        </span>
                      )}
                      {booking.meals.barSupper && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-100">
                          Bar Supper {(booking.packedMeals && booking.packedMeals.barSupper) ? '(Packed)' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}

                {booking.provisional && (
                  <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded">
                    This is a provisional booking. You've already rented Lazy Lodge this year, so members who haven't used it yet have priority and may bump this reservation.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Admin Inventory View
const AdminInventoryView = ({
  maxRoomThreshold,
  setMaxRoomThreshold,
  mealTimes,
  setMealTimes,
  inventory
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-stone-800">Room Inventory Management</h2>

      {/* System Settings */}
      <div className="bg-stone-50 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-stone-800">System Settings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Multi-Room Booking Threshold
            </label>
            <input
              type="number"
              min="1"
              value={maxRoomThreshold}
              onChange={(e) => setMaxRoomThreshold(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-xs text-stone-500 mt-1">
              Triggers House Committee Chairman consultation
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">Meal Times</label>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(mealTimes).map(([meal, time]) => (
              <div key={meal}>
                <label className="block text-xs text-stone-600 mb-1 capitalize">
                  {meal === 'barSupper' ? 'Bar Supper' : meal}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setMealTimes({ ...mealTimes, [meal]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Inventory by Building */}
      {Object.entries(inventory).map(([building, rooms]) => (
        <div key={building} className="border border-stone-200 rounded-lg p-6 space-y-4 bg-white shadow-sm">
          <h3 className="font-medium text-lg">{building}</h3>

          <div className="space-y-2">
            {rooms.map(room => (
              <div key={room.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-stone-600">Room</div>
                    <div className="font-medium">{room.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-600">Beds</div>
                    <div className="font-medium">{room.beds}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-600">Bathroom</div>
                    <div className="font-medium">{room.bathroom ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-600">Price</div>
                    <div className="font-medium">${room.price}/night</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Messages View
const MessagesView = ({ messages, currentUser }) => {
  const userMessages = messages.filter(m => m.recipient === currentUser);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-stone-800">Messages</h2>

      {userMessages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-stone-500">No messages</div>
        </div>
      ) : (
        <div className="space-y-4">
          {userMessages.map(message => (
            <div
              key={message.id}
              className={`border rounded-lg p-6 space-y-3 ${message.read ? 'bg-white border-stone-200' : 'bg-amber-50 border-amber-200'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-stone-900">{message.subject}</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {new Date(message.timestamp).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {!message.read && (
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded font-medium">
                    New
                  </span>
                )}
              </div>
              <div className="text-sm text-stone-700 whitespace-pre-line">
                {message.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Navigation
const Navigation = ({ currentUser, view, setView, setCurrentUser, downloadCSV, onLogoutClick }) => {
  if (!currentUser) return null;

  return (
    <div className="bg-emerald-900 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="95" fill="none" stroke="#D97706" strokeWidth="3" opacity="0.8" />
                <circle cx="100" cy="100" r="88" fill="none" stroke="#D97706" strokeWidth="1.5" opacity="0.6" />
                <text x="100" y="115" textAnchor="middle" fontSize="60" fontFamily="Georgia, serif" fill="#FCD34D" fontWeight="300">TC</text>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-light text-amber-200" style={{ fontFamily: 'Georgia, serif' }}>The Tuscarora Club</h1>
              <span className="text-stone-400 text-xs">v4.1</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setView('my-reservations')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${view === 'my-reservations' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                }`}
            >
              <UsersIcon className="w-5 h-5" />
              <span>My Reservations</span>
            </button>

            <button
              onClick={() => setView('messages')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${view === 'messages' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                }`}
            >
              <LucideIcon name="mail" className="w-5 h-5" />
              <span>Messages</span>
            </button>

            {currentUser === 'admin' && (
              <button
                onClick={() => setView('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${view === 'admin' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                  }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Admin</span>
              </button>
            )}

            <div className="border-l border-emerald-700 pl-6 flex items-center gap-6">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 text-stone-200 hover:text-amber-200 transition-colors"
                title="Export to Spreadsheet"
              >
                <LucideIcon name="download" className="w-5 h-5" />
                <span className="text-sm font-medium">Export</span>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-200">{currentUser}</span>
                <button
                  type="button"
                  onClick={onLogoutClick}
                  className="text-stone-200 hover:text-white p-2 rounded-lg hover:bg-emerald-800 transition-colors"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ClubReservationSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');

  // Trigger Lucide to replace <i> tags with SVGs - only on initial mount
  useEffect(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, []); // Empty array = run only once on mount

  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [bookings, setBookings] = useState([
    // Farm House bookings
    { "id": "b1", "member": "Chris", "building": "Farm House", "roomId": "fh1", "roomName": "Farmhouse #1", "startDate": "2026-02-01", "endDate": "2026-02-04", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "10:00", "guestArrival": "10:00", "provisional": false },
    { "id": "b2", "member": "David", "building": "Farm House", "roomId": "fh1", "roomName": "Farmhouse #1", "startDate": "2026-02-06", "endDate": "2026-02-09", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-06": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-07": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-08": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "14:30", "guestArrival": "14:30", "provisional": false },
    { "id": "b3", "member": "Rob", "building": "Farm House", "roomId": "fh1", "roomName": "Farmhouse #1", "startDate": "2026-02-13", "endDate": "2026-02-17", "guests": 4, "isGuest": true, "dailyMeals": { "2026-02-13": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-14": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-15": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-16": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-17": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "16:00", "guestArrival": "16:00", "provisional": false },

    { "id": "b4", "member": "Kerry", "building": "Farm House", "roomId": "fh2", "roomName": "Farmhouse #2", "startDate": "2026-02-02", "endDate": "2026-02-05", "guests": 3, "isGuest": true, "dailyMeals": { "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "09:00", "guestArrival": "09:00", "provisional": false },
    { "id": "b5", "member": "Chris", "building": "Farm House", "roomId": "fh2", "roomName": "Farmhouse #2", "startDate": "2026-02-10", "endDate": "2026-02-12", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-10": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "18:00", "guestArrival": "18:00", "provisional": false },

    { "id": "b6", "member": "Markley", "building": "Farm House", "roomId": "fh3", "roomName": "Farmhouse #3", "startDate": "2026-02-05", "endDate": "2026-02-09", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-05": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": true, "packedLunch": false }, "2026-02-07": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-08": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "11:30", "guestArrival": "11:30", "provisional": false },
    { "id": "b7", "member": "David", "building": "Farm House", "roomId": "fh3", "roomName": "Farmhouse #3", "startDate": "2026-02-11", "endDate": "2026-02-15", "guests": 3, "isGuest": true, "dailyMeals": { "2026-02-11": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-13": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-14": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-15": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "15:00", "guestArrival": "15:00", "provisional": false },

    { "id": "b8", "member": "Rob", "building": "Farm House", "roomId": "fh4", "roomName": "Farmhouse #4", "startDate": "2026-02-01", "endDate": "2026-02-04", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "08:00", "guestArrival": "08:00", "provisional": false },
    { "id": "b9", "member": "Kerry", "building": "Farm House", "roomId": "fh4", "roomName": "Farmhouse #4", "startDate": "2026-02-07", "endDate": "2026-02-11", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-07": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-08": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-11": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "13:00", "guestArrival": "13:00", "provisional": false },

    { "id": "b10", "member": "Chris", "building": "Farm House", "roomId": "fh5", "roomName": "Farmhouse #5", "startDate": "2026-02-03", "endDate": "2026-02-07", "guests": 5, "isGuest": true, "dailyMeals": { "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-07": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "12:00", "guestArrival": "12:00", "provisional": false },
    { "id": "b11", "member": "David", "building": "Farm House", "roomId": "fh5", "roomName": "Farmhouse #5", "startDate": "2026-02-12", "endDate": "2026-02-14", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-12": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-13": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-14": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "17:00", "guestArrival": "17:00", "provisional": false },

    { "id": "b12", "member": "Rob", "building": "Farm House", "roomId": "fh6", "roomName": "Farmhouse #6", "startDate": "2026-02-02", "endDate": "2026-02-06", "guests": 3, "isGuest": false, "dailyMeals": { "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "10:30", "guestArrival": "10:30", "provisional": false },
    { "id": "b13", "member": "Markley", "building": "Farm House", "roomId": "fh6", "roomName": "Farmhouse #6", "startDate": "2026-02-10", "endDate": "2026-02-13", "guests": 2, "isGuest": true, "dailyMeals": { "2026-02-10": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-12": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-13": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "14:00", "guestArrival": "14:00", "provisional": false },

    // Club House bookings
    { "id": "b14", "member": "Kerry", "building": "Club House", "roomId": "ch1", "roomName": "Clubhouse #1", "startDate": "2026-02-01", "endDate": "2026-02-05", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "11:00", "guestArrival": "11:00", "provisional": false },
    { "id": "b15", "member": "Chris", "building": "Club House", "roomId": "ch1", "roomName": "Clubhouse #1", "startDate": "2026-02-08", "endDate": "2026-02-11", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-08": { "breakfast": false, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "19:00", "guestArrival": "19:00", "provisional": false },

    { "id": "b16", "member": "David", "building": "Club House", "roomId": "ch2", "roomName": "Clubhouse #2", "startDate": "2026-02-01", "endDate": "2026-02-04", "guests": 4, "isGuest": true, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "13:30", "guestArrival": "13:30", "provisional": false },
    { "id": "b17", "member": "Rob", "building": "Club House", "roomId": "ch2", "roomName": "Clubhouse #2", "startDate": "2026-02-08", "endDate": "2026-02-13", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-08": { "breakfast": false, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-13": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "15:30", "guestArrival": "15:30", "provisional": false },

    { "id": "b18", "member": "Kerry", "building": "Club House", "roomId": "ch3", "roomName": "Clubhouse #3", "startDate": "2026-02-05", "endDate": "2026-02-09", "guests": 3, "isGuest": true, "dailyMeals": { "2026-02-05": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-07": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-08": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "09:30", "guestArrival": "09:30", "provisional": false },
    { "id": "b19", "member": "Chris", "building": "Club House", "roomId": "ch3", "roomName": "Clubhouse #3", "startDate": "2026-02-14", "endDate": "2026-02-18", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-14": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-15": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-16": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-17": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "16:30", "guestArrival": "16:30", "provisional": false },

    { "id": "b20", "member": "David", "building": "Club House", "roomId": "ch4", "roomName": "Clubhouse #4", "startDate": "2026-02-03", "endDate": "2026-02-06", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-05": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": true, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "12:30", "guestArrival": "12:30", "provisional": false },
    { "id": "b21", "member": "Markley", "building": "Club House", "roomId": "ch4", "roomName": "Clubhouse #4", "startDate": "2026-02-11", "endDate": "2026-02-14", "guests": 5, "isGuest": true, "dailyMeals": { "2026-02-11": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-13": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-14": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "08:30", "guestArrival": "08:30", "provisional": false },

    { "id": "b22", "member": "Rob", "building": "Club House", "roomId": "ch5", "roomName": "Clubhouse #5", "startDate": "2026-02-01", "endDate": "2026-02-05", "guests": 2, "isGuest": false, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "14:00", "guestArrival": "14:00", "provisional": false },
    { "id": "b23", "member": "Kerry", "building": "Club House", "roomId": "ch5", "roomName": "Clubhouse #5", "startDate": "2026-02-09", "endDate": "2026-02-12", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "17:30", "guestArrival": "17:30", "provisional": false },

    { "id": "b24", "member": "Chris", "building": "Club House", "roomId": "ch6", "roomName": "Clubhouse #6", "startDate": "2026-02-04", "endDate": "2026-02-08", "guests": 3, "isGuest": true, "dailyMeals": { "2026-02-04": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-06": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-07": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-08": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "11:30", "guestArrival": "11:30", "provisional": false },
    { "id": "b25", "member": "David", "building": "Club House", "roomId": "ch6", "roomName": "Clubhouse #6", "startDate": "2026-02-13", "endDate": "2026-02-17", "guests": 4, "isGuest": true, "dailyMeals": { "2026-02-13": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-14": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-15": { "breakfast": true, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-16": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-17": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "13:00", "guestArrival": "13:00", "provisional": false },

    // Lazy Lodge bookings - Markley has priority booking at beginning of February
    { "id": "b26", "member": "Markley", "building": "Lazy Lodge", "roomId": "ll1", "roomName": "Lazy Lodge #1", "startDate": "2026-02-01", "endDate": "2026-02-05", "guests": 3, "isGuest": false, "dailyMeals": { "2026-02-01": { "breakfast": false, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "10:00", "guestArrival": "10:00", "provisional": false },
    { "id": "b27", "member": "Chris", "building": "Lazy Lodge", "roomId": "ll1", "roomName": "Lazy Lodge #1", "startDate": "2026-02-08", "endDate": "2026-02-12", "guests": 2, "isGuest": true, "dailyMeals": { "2026-02-08": { "breakfast": false, "lunch": false, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": true }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "15:00", "guestArrival": "15:00", "provisional": false },

    { "id": "b28", "member": "David", "building": "Lazy Lodge", "roomId": "ll2", "roomName": "Lazy Lodge #2", "startDate": "2026-02-02", "endDate": "2026-02-05", "guests": 1, "isGuest": false, "dailyMeals": { "2026-02-02": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-03": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-04": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-05": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "18:00", "guestArrival": "18:00", "provisional": false },
    { "id": "b29", "member": "Kerry", "building": "Lazy Lodge", "roomId": "ll2", "roomName": "Lazy Lodge #2", "startDate": "2026-02-09", "endDate": "2026-02-13", "guests": 4, "isGuest": true, "dailyMeals": { "2026-02-09": { "breakfast": false, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false }, "2026-02-10": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-11": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": false, "packedLunch": false }, "2026-02-12": { "breakfast": true, "lunch": true, "barSupper": true, "packedBreakfast": true, "packedLunch": true }, "2026-02-13": { "breakfast": true, "lunch": false, "barSupper": false, "packedBreakfast": false, "packedLunch": false } }, "memberArrival": "12:00", "guestArrival": "12:00", "provisional": false }
  ]);
  const [lazyLodgeHistory, setLazyLodgeHistory] = useState({
    2026: ['Markley']
  });
  const [messages, setMessages] = useState([]); // System messages for users
  const [maxRoomThreshold, setMaxRoomThreshold] = useState(5);
  const [mealTimes, setMealTimes] = useState(MEAL_TIMES);

  // Calendar state
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date
  const [selectedDate, setSelectedDate] = useState(null);

  // Multi-selection booking state
  const [selectedCells, setSelectedCells] = useState([]); // Array of {roomId, date}
  const [bookingMode, setBookingMode] = useState('calendar'); // 'calendar', 'selection', 'details'
  const [multiRoomBookings, setMultiRoomBookings] = useState([]); // Array of room booking details

  // Booking flow state
  const [bookingStep, setBookingStep] = useState(1);
  const [newBooking, setNewBooking] = useState({
    building: '',
    roomId: '',
    startDate: '',
    endDate: '',
    guests: 1,
    dailyMeals: {}, // Will be populated with dates as keys
    memberArrival: '',
    guestArrival: '',
    isGuestRoom: false,
    partyArrivalTime: '', // Single arrival time for entire party
    partyName: '' // Name for the entire booking party
  });
  const [bookingWarnings, setBookingWarnings] = useState([]);
  const [loginUsername, setLoginUsername] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  // Helper functions
  const hasRentedLazyLodge = (member, year) => {
    return (lazyLodgeHistory[year] && lazyLodgeHistory[year].includes(member)) || false;
  };

  const isRoomAvailable = (roomId, startDate, endDate) => {
    return !bookings.some(booking => {
      if (booking.roomId !== roomId) return false;
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      const checkStart = new Date(startDate);
      const checkEnd = new Date(endDate);
      return checkStart < bookingEnd && checkEnd > bookingStart;
    });
  };

  const getRoomById = (roomId) => {
    for (const building in inventory) {
      const room = inventory[building].find(r => r.id === roomId);
      if (room) return { ...room, building };
    }
    return null;
  };

  const countSimultaneousRooms = (startDate, endDate) => {
    const userBookings = bookings.filter(b => b.member === currentUser);
    let maxOverlap = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    userBookings.forEach(booking => {
      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);
      if (start < bEnd && end > bStart) {
        maxOverlap++;
      }
    });
    return maxOverlap + 1;
  };

  const handleLogin = () => {
    const validUsers = ['admin', 'Chris', 'Markley', 'David', 'Rob', 'Kerry'];
    if (validUsers.includes(loginUsername)) {
      setCurrentUser(loginUsername);
      setView('calendar');
    }
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const startBooking = (date, roomId = null) => {
    setSelectedDate(date);
    const formatDate = (d) => d.toISOString().split('T')[0];
    setNewBooking({
      ...newBooking,
      startDate: formatDate(date),
      endDate: formatDate(new Date(date.getTime() + 86400000)),
      roomId: roomId || ''
    });
    setView('booking');
    setBookingStep(roomId ? 2 : 1);
  };

  const validateAndProceed = () => {
    const warnings = [];
    if (newBooking.building === 'Lazy Lodge') {
      const year = new Date(newBooking.startDate).getFullYear();
      if (hasRentedLazyLodge(currentUser, year)) {
        warnings.push('You have already rented Lazy Lodge this year. This will be a PROVISIONAL BOOKING and can be bumped by members who haven\'t used it yet.');
      }
    }

    const roomCount = countSimultaneousRooms(newBooking.startDate, newBooking.endDate);
    if (roomCount >= maxRoomThreshold) {
      warnings.push(`You are booking ${roomCount} or more rooms simultaneously. Please confer with the House Committee Chairman.`);
    }

    if (newBooking.isGuestRoom) {
      const hostStays = bookings.filter(b =>
        b.member === currentUser &&
        !b.isGuest &&
        !(new Date(b.endDate) <= new Date(newBooking.startDate) || new Date(b.startDate) >= new Date(newBooking.endDate))
      );
      if (hostStays.length === 0) {
        warnings.push("Guest Restriction: Members must have their own room booking during the guest stay period. Please book your own room first.");
      }
    }

    setBookingWarnings(warnings);
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    } else {
      confirmBooking();
    }
  };

  const confirmBooking = () => {
    const isProvisional = newBooking.building === 'Lazy Lodge' &&
      hasRentedLazyLodge(currentUser, new Date(newBooking.startDate).getFullYear());

    const room = getRoomById(newBooking.roomId);
    const booking = {
      id: `b${bookings.length + 1}`,
      member: currentUser,
      building: newBooking.building,
      roomId: newBooking.roomId,
      roomName: room.name,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      guests: newBooking.guests,
      dailyMeals: newBooking.dailyMeals,
      memberArrival: newBooking.memberArrival,
      guestArrival: newBooking.guestArrival,
      isGuest: newBooking.isGuestRoom,
      provisional: isProvisional
    };

    setBookings([...bookings, booking]);

    if (newBooking.building === 'Lazy Lodge' && !isProvisional) {
      const year = new Date(newBooking.startDate).getFullYear();
      setLazyLodgeHistory({
        ...lazyLodgeHistory,
        [year]: [...(lazyLodgeHistory[year] || []), currentUser]
      });
    }

    setView('my-reservations');
    setBookingStep(1);
    setNewBooking({
      building: '',
      roomId: '',
      startDate: '',
      endDate: '',
      guests: 1,
      dailyMeals: {},
      memberArrival: '',
      guestArrival: '',
      isGuestRoom: false
    });
    setBookingWarnings([]);
  };

  const confirmMultiRoomBooking = (roomBookings, partyArrivalTime) => {
    const newBookings = [];
    const bookingsToRemove = [];
    const bumpedMembers = new Set();

    roomBookings.forEach(roomBooking => {
      const isProvisional = roomBooking.building === 'Lazy Lodge' &&
        hasRentedLazyLodge(currentUser, new Date(roomBooking.startDate).getFullYear());

      // Check for provisional bookings in this room/date range
      const startDate = new Date(roomBooking.startDate);
      const endDate = new Date(roomBooking.endDate);

      bookings.forEach(existingBooking => {
        if (existingBooking.provisional &&
            existingBooking.roomId === roomBooking.roomId) {
          const existingStart = new Date(existingBooking.startDate);
          const existingEnd = new Date(existingBooking.endDate);

          // Check for date overlap
          if (existingStart < endDate && existingEnd > startDate) {
            bookingsToRemove.push(existingBooking.id);
            bumpedMembers.add(existingBooking.member);
          }
        }
      });

      const booking = {
        id: `b${bookings.length + newBookings.length + 1}`,
        member: currentUser,
        building: roomBooking.building,
        roomId: roomBooking.roomId,
        roomName: roomBooking.roomName,
        startDate: roomBooking.startDate,
        endDate: roomBooking.endDate,
        guests: roomBooking.guests,
        dailyMeals: roomBooking.dailyMeals,
        memberArrival: partyArrivalTime,
        guestArrival: partyArrivalTime,
        guestName: roomBooking.guestName,
        isGuest: false,
        provisional: isProvisional
      };

      newBookings.push(booking);

      // Track Lazy Lodge usage for non-provisional bookings
      if (roomBooking.building === 'Lazy Lodge' && !isProvisional) {
        const year = new Date(roomBooking.startDate).getFullYear();
        setLazyLodgeHistory({
          ...lazyLodgeHistory,
          [year]: [...(lazyLodgeHistory[year] || []), currentUser]
        });
      }
    });

    // Remove provisional bookings that were bumped
    const updatedBookings = bookings.filter(b => !bookingsToRemove.includes(b.id));

    // Create messages for bumped members
    const newMessages = [];
    bumpedMembers.forEach(member => {
      const message = {
        id: `msg${messages.length + newMessages.length + 1}`,
        recipient: member,
        subject: 'Lazy Lodge Provisional Booking Bumped',
        body: `Your provisional Lazy Lodge booking has been replaced by ${currentUser}, who has priority for Lazy Lodge this calendar year. Please make an alternative reservation.`,
        timestamp: new Date().toISOString(),
        read: false
      };
      newMessages.push(message);
    });

    setBookings([...updatedBookings, ...newBookings]);
    setMessages([...messages, ...newMessages]);
    setBookingMode('calendar');
    setSelectedCells([]);
    setView('my-reservations');
  };

  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  const downloadBookingsCSV = () => {
    const headers = [
      'ID', 'Member', 'Building', 'Room', 'Start Date', 'End Date',
      'Nights', 'Guests', 'Provisional',
      'Breakfasts', 'Lunches', 'Bar Suppers',
      'Packed Breakfasts', 'Packed Lunches', 'Packed Suppers'
    ];

    const rows = bookings.map(b => {
      // Calculate duration in nights
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate meal counts with safe access
      // Breakfast: 1 per night + departure morning = nights + 1
      const hasBreakfast = (b.meals && b.meals.breakfast) || false;
      const totalBreakfasts = hasBreakfast ? (nights + 1) * b.guests : 0;

      // Lunch: 1 per full day (arrival lunch is assumed?) -> Requirement says:
      // "first night... breakfast, lunch, and dinner... everyday... breakfast only on checkout"
      // Interpretation: B/L/D on Arrival + Full Days. Checkout is B only.
      // So Lunch count = 1 (Arrival) + (Nights - 1) (Full Days) = Nights
      const hasLunch = (b.meals && b.meals.lunch) || false;
      const totalLunches = hasLunch ? nights * b.guests : 0;

      // Supper: 1 per night
      const hasSupper = (b.meals && b.meals.barSupper) || false;
      const totalSuppers = hasSupper ? nights * b.guests : 0;

      // Safe access for packed meals
      const packedBreakfast = (b.packedMeals && b.packedMeals.breakfast) ? 'Yes' : 'No';
      const packedLunch = (b.packedMeals && b.packedMeals.lunch) ? 'Yes' : 'No';
      const packedSupper = (b.packedMeals && b.packedMeals.barSupper) ? 'Yes' : 'No';

      return [
        b.id,
        b.member,
        b.building,
        b.roomName,
        b.startDate,
        b.endDate,
        nights,
        b.guests,
        b.provisional ? 'Yes' : 'No',
        totalBreakfasts,
        totalLunches,
        totalSuppers,
        packedBreakfast,
        packedLunch,
        packedSupper
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    setExportData(csvContent);
    setShowExportModal(true);
  };

  // Main render
  if (!currentUser) {
    return <LoginView
      username={loginUsername}
      setUsername={setLoginUsername}
      handleLogin={handleLogin}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-100">
      <Navigation
        currentUser={currentUser}
        view={view}
        setView={setView}
        setCurrentUser={setCurrentUser}
        downloadCSV={downloadBookingsCSV}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'calendar' && bookingMode !== 'details' && <CalendarView
          currentDate={currentDate}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          navigateCalendar={navigateCalendar}
          setCurrentDate={setCurrentDate}
          startBooking={startBooking}
          inventory={inventory}
          isRoomAvailable={isRoomAvailable}
          bookings={bookings}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
          setBookingMode={setBookingMode}
          currentUser={currentUser}
          lazyLodgeHistory={lazyLodgeHistory}
          hasRentedLazyLodge={hasRentedLazyLodge}
        />}
        {view === 'calendar' && bookingMode === 'details' && <MultiRoomBookingDetails
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
          setBookingMode={setBookingMode}
          getRoomById={getRoomById}
          confirmMultiRoomBooking={confirmMultiRoomBooking}
          mealTimesConfig={mealTimes}
        />}
        {view === 'booking' && <BookingFlow
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          bookingWarnings={bookingWarnings}
          setBookingWarnings={setBookingWarnings}
          confirmBooking={confirmBooking}
          setView={setView}
          isRoomAvailable={isRoomAvailable}
          getRoomById={getRoomById}
          inventory={inventory}
          validateAndProceed={validateAndProceed}
          getAllRooms={getAllRooms}
          mealTimesConfig={mealTimes}
          bookings={bookings}
        />}
        {view === 'my-reservations' && <MyReservationsView
          bookings={bookings}
          currentUser={currentUser}
          getRoomById={getRoomById}
          cancelBooking={cancelBooking}
          setView={setView}
        />}
        {view === 'admin' && currentUser === 'admin' && <AdminInventoryView
          maxRoomThreshold={maxRoomThreshold}
          setMaxRoomThreshold={setMaxRoomThreshold}
          mealTimes={mealTimes}
          setMealTimes={setMealTimes}
          inventory={inventory}
        />}
        {view === 'messages' && <MessagesView
          messages={messages}
          currentUser={currentUser}
        />}
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        message="Are you sure you want to sign out?"
        onConfirm={() => {
          setCurrentUser(null);
          setView('login');
          setShowLogoutConfirm(false);
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={exportData}
        filename={`tuscarora_bookings_${new Date().toISOString().split('T')[0]}.csv`}
      />
    </div>
  );
}

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ClubReservationSystem />);