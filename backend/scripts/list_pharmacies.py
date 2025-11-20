import sqlite3
import os
p = os.path.join(os.path.dirname(__file__), '..', 'app.db')
print('DB path:', p)
if not os.path.exists(p):
    print('DB does not exist')
    raise SystemExit(1)
conn = sqlite3.connect(p)
c = conn.cursor()
try:
    c.execute('SELECT id, name, address, phone_number, latitude, longitude FROM pharmacies LIMIT 20')
    rows = c.fetchall()
    print('Found', len(rows), 'rows')
    for r in rows:
        print(r)
except Exception as e:
    print('Error querying DB:', e)
finally:
    conn.close()
