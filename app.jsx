const { useState } = React;
const { Calendar, Users, Home, Settings, LogOut, ChevronLeft, ChevronRight, AlertCircle, Check, X } = lucide;

// Initial room inventory
const INITIAL_INVENTORY = {
  'Farm House': [
    { id: 'fh1', name: 'Room 1', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'fh2', name: 'Room 2', bathroom: true, beds: '2 Single Beds', price: 150 },
    { id: 'fh3', name: 'Room 3', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'fh4', name: 'Room 4', bathroom: false, beds: '2 Single Beds', price: 100 },
    { id: 'fh5', name: 'Room 5', bathroom: false, beds: '1 Queen Bed', price: 100 },
    { id: 'fh6', name: 'Room 6', bathroom: false, beds: '2 Single Beds', price: 100 },
  ],
  'Club House': [
    { id: 'ch1', name: 'Room 1', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'ch2', name: 'Room 2', bathroom: true, beds: '2 Single Beds', price: 150 },
    { id: 'ch3', name: 'Room 3', bathroom: true, beds: '1 Queen Bed', price: 150 },
    { id: 'ch4', name: 'Room 4', bathroom: false, beds: '2 Single Beds', price: 100 },
    { id: 'ch5', name: 'Room 5', bathroom: false, beds: '1 Queen Bed', price: 100 },
    { id: 'ch6', name: 'Room 6', bathroom: false, beds: '2 Single Beds', price: 100 },
  ],
  'Lazy Lodge': [
    { id: 'll1', name: 'Room 1', bathroom: true, beds: '1 Queen Bed', price: 200 },
    { id: 'll2', name: 'Room 2', bathroom: true, beds: '1 Queen Bed', price: 200 },
  ]
};

const MEAL_TIMES = {
  breakfast: '8:00 AM',
  lunch: '12:30 PM',
  barSupper: '6:00 PM'
};

function ClubReservationSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [bookings, setBookings] = useState([
    {
      id: 'b1',
      member: 'member1',
      building: 'Farm House',
      roomId: 'fh1',
      roomName: 'Room 1',
      startDate: '2026-02-10',
      endDate: '2026-02-12',
      guests: 2,
      meals: { breakfast: true, lunch: true, barSupper: false },
      packedMeal: false,
      memberArrival: '14:00',
      guestArrival: '14:00',
      provisional: false
    },
    {
      id: 'b2',
      member: 'member2',
      building: 'Lazy Lodge',
      roomId: 'll1',
      roomName: 'Room 1',
      startDate: '2026-02-15',
      endDate: '2026-02-17',
      guests: 1,
      meals: { breakfast: true, lunch: true, barSupper: true },
      packedMeal: true,
      memberArrival: '15:00',
      guestArrival: '15:00',
      provisional: true
    }
  ]);
  const [lazyLodgeHistory, setLazyLodgeHistory] = useState({
    2026: ['member2']
  });
  const [maxRoomThreshold, setMaxRoomThreshold] = useState(5);
  const [mealTimes, setMealTimes] = useState(MEAL_TIMES);

  // Calendar state
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 4)); // Feb 4, 2026
  const [selectedDate, setSelectedDate] = useState(null);

  // Booking flow state
  const [bookingStep, setBookingStep] = useState(1);
  const [newBooking, setNewBooking] = useState({
    building: '',
    roomId: '',
    startDate: '',
    endDate: '',
    guests: 1,
    meals: { breakfast: false, lunch: false, barSupper: false },
    packedMeal: false,
    memberArrival: '',
    guestArrival: ''
  });
  const [bookingWarnings, setBookingWarnings] = useState([]);

  // Helper functions
  const hasRentedLazyLodge = (member, year) => {
    return lazyLodgeHistory[year]?.includes(member) || false;
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

  const getBookingForRoom = (roomId, date) => {
    return bookings.find(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      const checkDate = new Date(date);
      return booking.roomId === roomId &&
             checkDate >= bookingStart &&
             checkDate < bookingEnd;
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

    return maxOverlap + 1; // +1 for the new booking
  };

  // Login View
  const LoginView = () => {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
      if (username === 'admin' || username === 'member1' || username === 'member2' || username === 'member3') {
        setCurrentUser(username);
        setView('calendar');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='95' fill='none' stroke='%23374151' stroke-width='2'/%3E%3Ccircle cx='100' cy='100' r='88' fill='none' stroke='%23374151' stroke-width='1'/%3E%3Ctext x='100' y='60' text-anchor='middle' font-size='14' font-family='Georgia, serif' fill='%23374151' font-weight='300'%3ETUSCARORA%3C/text%3E%3Ctext x='100' y='110' text-anchor='middle' font-size='32' font-family='Georgia, serif' fill='%23374151' font-weight='300'%3ETC%3C/text%3E%3Ctext x='100' y='150' text-anchor='middle' font-size='12' font-family='Georgia, serif' fill='%23374151' font-weight='300'%3EMILLBROOK%3C/text%3E%3Ctext x='100' y='165' text-anchor='middle' font-size='10' font-family='Georgia, serif' fill='%236B7280'%3EEST. 1901%3C/text%3E%3C/svg%3E"
                alt="Tuscarora Club Logo"
                className="w-full h-full opacity-90 object-contain"
              />
            </div>
            <h1 className="text-3xl font-light text-emerald-900" style={{ fontFamily: 'Georgia, serif' }}>The Tuscarora Club</h1>
            <p className="text-amber-700 mt-2 font-light">Member Portal</p>
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
                placeholder="member1, member2, member3, or admin"
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
              <p className="text-xs text-stone-600">member1, member2, member3, admin</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calendar View
  const CalendarView = () => {
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

    const getWeekDays = (date) => {
      const day = date.getDay();
      const diff = date.getDate() - day;
      const sunday = new Date(date);
      sunday.setDate(diff);

      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        week.push(day);
      }
      return week;
    };

    const monthDays = calendarView === 'month' ? getDaysInMonth(currentDate) : [];
    const weekDays = calendarView === 'week' ? getWeekDays(currentDate) : [];
    const displayDays = calendarView === 'month' ? monthDays : weekDays;

    const formatDate = (date) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
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

    const startBooking = (date) => {
      setSelectedDate(date);
      setNewBooking({
        ...newBooking,
        startDate: formatDate(date),
        endDate: formatDate(new Date(date.getTime() + 86400000)) // +1 day
      });
      setView('booking');
      setBookingStep(1);
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
                {weekDays[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                {weekDays[6]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date(2026, 1, 4))} className="px-3 py-1 hover:bg-emerald-100 rounded text-sm text-emerald-800">
                Today
              </button>
              <button onClick={() => navigateCalendar(1)} className="p-2 hover:bg-emerald-100 rounded text-emerald-800">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Day headers */}
        <div className={`grid ${calendarView === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-2`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-stone-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={`grid ${calendarView === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
          {displayDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square"></div>;
            }

            const dateStr = formatDate(day);
            const isToday = formatDate(new Date(2026, 1, 4)) === dateStr;
            const isPast = day < new Date(2026, 1, 4);

            return (
              <div
                key={idx}
                onClick={() => !isPast && startBooking(day)}
                className={`aspect-square border rounded-lg p-2 cursor-pointer transition-all ${
                  isToday ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-stone-200 hover:border-emerald-400 hover:bg-emerald-50'
                } ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-sm font-medium text-stone-800 mb-1">{day.getDate()}</div>
                <div className="space-y-1">
                  {Object.keys(inventory).map(building => {
                    const availableCount = inventory[building].filter(room =>
                      isRoomAvailable(room.id, dateStr, formatDate(new Date(day.getTime() + 86400000)))
                    ).length;
                    const totalCount = inventory[building].length;

                    if (availableCount < totalCount) {
                      return (
                        <div key={building} className="text-xs text-emerald-700">
                          {building.split(' ')[0]}: {availableCount}/{totalCount}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm text-stone-600 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-600 bg-emerald-50 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-stone-200 bg-white rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-stone-200 bg-stone-100 rounded"></div>
            <span>Partially Booked</span>
          </div>
        </div>
      </div>
    );
  };

  // Booking Flow
  const BookingFlow = () => {
    const validateAndProceed = () => {
      const warnings = [];

      // Check Lazy Lodge eligibility
      if (newBooking.building === 'Lazy Lodge') {
        const year = new Date(newBooking.startDate).getFullYear();
        if (hasRentedLazyLodge(currentUser, year)) {
          warnings.push('You have already rented Lazy Lodge this year. This will be a PROVISIONAL BOOKING and can be bumped by members who haven\'t used it yet.');
        }
      }

      // Check multi-room threshold
      const roomCount = countSimultaneousRooms(newBooking.startDate, newBooking.endDate);
      if (roomCount >= maxRoomThreshold) {
        warnings.push(`You are booking ${roomCount} or more rooms simultaneously. Please confer with the House Committee Chairman.`);
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
        meals: newBooking.meals,
        packedMeal: newBooking.packedMeal,
        memberArrival: newBooking.memberArrival,
        guestArrival: newBooking.guestArrival,
        provisional: isProvisional
      };

      setBookings([...bookings, booking]);

      // Update Lazy Lodge history if confirmed
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
        meals: { breakfast: false, lunch: false, barSupper: false },
        packedMeal: false,
        memberArrival: '',
        guestArrival: ''
      });
      setBookingWarnings([]);
    };

    // Step 1: Select Room & Dates
    if (bookingStep === 1) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-emerald-900">New Booking</h2>
            <button onClick={() => setView('calendar')} className="text-stone-600 hover:text-stone-800">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Building</label>
              <select
                value={newBooking.building}
                onChange={(e) => setNewBooking({ ...newBooking, building: e.target.value, roomId: '' })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">Select a building</option>
                {Object.keys(inventory).map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>

            {newBooking.building && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Room</label>
                <div className="grid grid-cols-1 gap-2">
                  {inventory[newBooking.building].map(room => {
                    const available = isRoomAvailable(room.id, newBooking.startDate, newBooking.endDate);
                    return (
                      <button
                        key={room.id}
                        onClick={() => setNewBooking({ ...newBooking, roomId: room.id })}
                        disabled={!available}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          newBooking.roomId === room.id
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                            : available
                              ? 'border-stone-300 hover:border-emerald-400 hover:bg-emerald-50'
                              : 'border-stone-200 bg-stone-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{room.name}</div>
                            <div className="text-sm text-stone-600">{room.beds}</div>
                            <div className="text-sm text-stone-600">
                              {room.bathroom ? 'Private bathroom' : 'Shared bathroom'}
                            </div>
                          </div>
                          {!available && (
                            <span className="text-xs text-red-600 font-medium">Booked</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Check-in</label>
                <input
                  type="date"
                  value={newBooking.startDate}
                  onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Check-out</label>
                <input
                  type="date"
                  value={newBooking.endDate}
                  onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setView('calendar')}
              className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={validateAndProceed}
              disabled={!newBooking.building || !newBooking.roomId || !newBooking.startDate || !newBooking.endDate}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
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
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
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
                <span className="font-medium">{room?.name} ({room?.beds})</span>
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
                Meals (for {newBooking.guests} guest{newBooking.guests > 1 ? 's' : ''})
              </label>
              <div className="space-y-2">
                {Object.entries(mealTimes).map(([meal, time]) => (
                  <label key={meal} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBooking.meals[meal]}
                      onChange={(e) => setNewBooking({
                        ...newBooking,
                        meals: { ...newBooking.meals, [meal]: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm capitalize">
                        {meal === 'barSupper' ? 'Bar Supper' : meal}
                      </div>
                      <div className="text-xs text-stone-500">{time}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={newBooking.packedMeal}
                onChange={(e) => setNewBooking({ ...newBooking, packedMeal: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium">Request packed meal to go</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBookingStep(2)}
              className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Back
            </button>
            <button
              onClick={validateAndProceed}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      );
    }
  };

  // My Reservations View
  const MyReservationsView = () => {
    const userBookings = bookings.filter(b => b.member === currentUser);

    const cancelBooking = (bookingId) => {
      if (confirm('Are you sure you want to cancel this reservation?')) {
        setBookings(bookings.filter(b => b.id !== bookingId));
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-stone-800">My Reservations</h2>

        {userBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
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
                      onClick={() => cancelBooking(booking.id)}
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

                  {(booking.meals.breakfast || booking.meals.lunch || booking.meals.barSupper) && (
                    <div>
                      <div className="text-sm text-stone-600 mb-2">Meals:</div>
                      <div className="flex flex-wrap gap-2">
                        {booking.meals.breakfast && (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded">Breakfast</span>
                        )}
                        {booking.meals.lunch && (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded">Lunch</span>
                        )}
                        {booking.meals.barSupper && (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded">Bar Supper</span>
                        )}
                        {booking.packedMeal && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Packed Meal</span>
                        )}
                      </div>
                    </div>
                  )}

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
  const AdminInventoryView = () => {
    const [editingBuilding, setEditingBuilding] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);

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

  // Main Navigation
  const Navigation = () => {
    if (!currentUser) return null;

    return (
      <div className="bg-emerald-900 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="95" fill="none" stroke="#D97706" strokeWidth="3" opacity="0.8"/>
                  <circle cx="100" cy="100" r="88" fill="none" stroke="#D97706" strokeWidth="1.5" opacity="0.6"/>
                  <text x="100" y="115" textAnchor="middle" fontSize="60" fontFamily="Georgia, serif" fill="#FCD34D" fontWeight="300">TC</text>
                </svg>
              </div>
              <h1 className="text-xl font-light text-amber-200" style={{ fontFamily: 'Georgia, serif' }}>The Tuscarora Club</h1>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  view === 'calendar' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setView('my-reservations')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  view === 'my-reservations' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>My Reservations</span>
              </button>

              {currentUser === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    view === 'admin' ? 'bg-emerald-800 text-amber-200' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </button>
              )}

              <div className="border-l border-emerald-700 pl-6 flex items-center gap-3">
                <span className="text-sm text-stone-200">{currentUser}</span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setView('login');
                  }}
                  className="text-stone-200 hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'calendar' && <CalendarView />}
        {view === 'booking' && <BookingFlow />}
        {view === 'my-reservations' && <MyReservationsView />}
        {view === 'admin' && currentUser === 'admin' && <AdminInventoryView />}
      </div>
    </div>
  );
}

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ClubReservationSystem />);