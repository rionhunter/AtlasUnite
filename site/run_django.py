#!/usr/bin/env python
import os
import sys
import subprocess
import signal
import time

def run_django():
    """Run Django development server"""
    os.chdir('backend')
    os.environ['DJANGO_SETTINGS_MODULE'] = 'atlas_unite.settings'
    
    print("Starting Django server on port 8000...")
    return subprocess.Popen([
        sys.executable, '-m', 'django', 'runserver', '0.0.0.0:8000'
    ])

def run_frontend():
    """Run frontend server"""
    os.chdir('..')  # Go back to root
    print("Starting frontend server...")
    return subprocess.Popen(['npm', 'run', 'dev:frontend'])

def signal_handler(sig, frame):
    print('\nShutting down servers...')
    sys.exit(0)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start Django server first
    django_process = run_django()
    
    # Wait a moment for Django to start, then start frontend
    time.sleep(2)
    frontend_process = run_frontend()
    
    print("Both servers are running!")
    print("Django API: http://localhost:8000")
    print("Frontend: http://localhost:5000")
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
            # Check if processes are still running
            if django_process.poll() is not None or frontend_process.poll() is not None:
                print("One of the servers stopped, shutting down...")
                break
    except KeyboardInterrupt:
        print('\nShutting down...')
        django_process.terminate()
        frontend_process.terminate()
        django_process.wait()
        frontend_process.wait()