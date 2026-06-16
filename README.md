# Network Security Dashboard

A full-stack web application for scanning hosts on a network, checking live status, and identifying open ports and running services — built to apply cybersecurity coursework in a practical, hands-on tool.

![Status](https://img.shields.io/badge/status-active-brightgreen)

## What it does

- Checks whether a target host is online using ICMP ping
- Scans common TCP ports (FTP, SSH, HTTP, HTTPS, RDP, MySQL, and more) to identify open services
- Displays results in a live-updating dashboard with status indicators

## Why I built this

I wanted a portfolio project that went beyond a typical CRUD app and actually applied what I learned in my Cybersecurity and Computer Networks coursework. This project let me work hands-on with sockets, network protocols, and full-stack architecture — connecting a Python backend that performs real scanning logic to a React frontend that visualizes the results clearly.

## Tech stack

**Frontend:** React, Vite, JavaScript, CSS  
**Backend:** Python, Flask, Flask-CORS  
**Core concepts used:** REST API design, TCP sockets, subprocess calls, async/await, React state management

## How it works

1. The user enters a target IP address in the React frontend.
2. The frontend sends a POST request to the Flask backend's `/api/scan/ping` endpoint to check if the host is alive.
3. The frontend then sends a POST request to `/api/scan/ports`, where the backend opens a raw socket connection to each common port and records whether it's open or closed.
4. Results are returned as JSON and rendered in a live table on the frontend.

## Running it locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors python-nmap
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Note on scope

This tool is designed for scanning hosts you own or have permission to test (e.g., `127.0.0.1` / localhost, or devices on your own home network). It is intentionally not deployed publicly, since port scanning external hosts without authorization raises both ethical and legal concerns — this project is meant to demonstrate networking and full-stack skills in a safe, contained environment.

## What I'd add next

- Scan history with timestamps
- Support for scanning an entire subnet (e.g., 192.168.1.0/24)
- Export results to CSV or PDF