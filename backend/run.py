#!/usr/bin/env python
import os
from pharmacy_tracker_backend import create_app, db

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4000))
    app.run(debug=True, host='0.0.0.0', port=port)
