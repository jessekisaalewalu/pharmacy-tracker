from pharmacy_tracker_backend import create_app
from waitress import serve

app = create_app()

if __name__ == '__main__':
    print("Starting Waitress WSGI server on http://0.0.0.0:8000...")
    serve(app, host='0.0.0.0', port=8000, threads=4, channel_timeout=30)