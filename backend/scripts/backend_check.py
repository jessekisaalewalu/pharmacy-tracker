#!/usr/bin/env python
"""
Quick backend self-check script. Uses Flask test client to call key endpoints
and prints responses. Run from the `backend` folder with the virtualenv active.
"""
import json
import sys
from pharmacy_tracker_backend import create_app


def main():
    app = create_app()
    client = app.test_client()

    endpoints = [
        ('GET', '/health', None),
        ('GET', '/api/pharmacies', None),
    ]

    all_ok = True

    for method, path, payload in endpoints:
        try:
            if method == 'GET':
                resp = client.get(path)
            elif method == 'POST':
                resp = client.post(path, json=payload)
            else:
                continue

            print(f'[{path}] status={resp.status_code}')
            # Try to pretty-print JSON
            try:
                j = resp.get_json()
                print(json.dumps(j, indent=2, ensure_ascii=False))
            except Exception:
                print(resp.data.decode('utf-8')[:1000])

            if resp.status_code >= 400:
                all_ok = False

        except Exception as e:
            print(f'Error calling {path}:', e)
            all_ok = False

    if not all_ok:
        sys.exit(2)
    print('Backend check completed')


if __name__ == '__main__':
    main()
