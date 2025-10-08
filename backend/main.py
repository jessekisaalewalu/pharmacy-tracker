from pharmacy_tracker_backend import create_app, db
from pharmacy_tracker_backend.database.models import Pharmacy
from flask import send_from_directory
import os

app = create_app()

# Serve static files
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return {'error': 'Not Found'}, 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return {'error': 'Internal Server Error'}, 500

# CLI commands for database management
@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print('Database initialized!')

@app.cli.command("drop-db")
def drop_db():
    """Drop the database."""
    db.drop_all()
    print('Database dropped!')

if __name__ == '__main__':
    app.run(debug=True)