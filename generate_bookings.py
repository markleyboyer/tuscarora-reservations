import random
from datetime import datetime, timedelta

def generate_bookings():
    rooms = [
        ('Farm House', 'fh1', 'Farmhouse #1'),
        ('Farm House', 'fh2', 'Farmhouse #2'),
        ('Farm House', 'fh3', 'Farmhouse #3'),
        ('Farm House', 'fh4', 'Farmhouse #4'),
        ('Farm House', 'fh5', 'Farmhouse #5'),
        ('Farm House', 'fh6', 'Farmhouse #6'),
        ('Club House', 'ch1', 'Clubhouse #1'),
        ('Club House', 'ch2', 'Clubhouse #2'),
        ('Club House', 'ch3', 'Clubhouse #3'),
        ('Club House', 'ch4', 'Clubhouse #4'),
        ('Club House', 'ch5', 'Clubhouse #5'),
        ('Club House', 'ch6', 'Clubhouse #6'),
        ('Lazy Lodge', 'll1', 'Lazy Lodge #1'),
        ('Lazy Lodge', 'll2', 'Lazy Lodge #2'),
    ]
    members = [f'member{i}' for i in range(1, 11)]
    bookings = []
    
    # Track room availability
    room_calendar = {room[1]: [False] * 32 for room in rooms} # Simple 1-based indexing for Feb
    
    # We want some days almost full, some empty.
    # Empty days: Feb 1-3, Feb 14-15 (maybe)
    # Full days: Feb 6-9, Feb 20-23
    
    for room_building, room_id, room_name in rooms:
        current_day = 1
        while current_day < 28:
            # Skip some days to create "empty" periods or just randomly
            if random.random() < 0.3:
                current_day += 1
                continue
                
            stay_length = random.randint(2, 5)
            if current_day + stay_length > 28:
                break
                
            # Check if room is available
            can_book = True
            for d in range(current_day, current_day + stay_length):
                if room_calendar[room_id][d]:
                    can_book = False
                    break
            
            if can_book:
                start_date = f"2026-02-{current_day:02d}"
                end_date = f"2026-02-{current_day + stay_length:02d}"
                member = random.choice(members)
                
                # Mark calendar
                for d in range(current_day, current_day + stay_length):
                    room_calendar[room_id][d] = True
                
                bookings.append({
                    "id": f"b{len(bookings) + 1}",
                    "member": member,
                    "building": room_building,
                    "roomId": room_id,
                    "roomName": room_name,
                    "startDate": start_date,
                    "endDate": end_date,
                    "guests": random.randint(1, 4),
                    "meals": {
                        "breakfast": random.choice([True, False]),
                        "lunch": random.choice([True, False]),
                        "barSupper": random.choice([True, False])
                    },
                    "packedMeal": random.choice([True, False]),
                    "memberArrival": "14:00",
                    "guestArrival": "14:00",
                    "provisional": False
                })
                current_day += stay_length + random.randint(0, 2)
            else:
                current_day += 1
                
    return bookings

import json
print(json.dumps(generate_bookings(), indent=2))
