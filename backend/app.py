from flask import Flask, jsonify, request
from flask_cors import CORS
import socket
import subprocess
import platform

app = Flask(__name__)
CORS(app)

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({"status": "Backend is running!"})

@app.route('/api/scan/ports', methods=['POST'])
def scan_ports():
    data = request.get_json()
    host = data.get('host', 'localhost')
    
    common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5000, 8080, 8443]
    results = []

    for port in common_ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((host, port))
            status = "open" if result == 0 else "closed"
            sock.close()
        except Exception:
            status = "error"
        
        results.append({
            "port": port,
            "status": status,
            "service": get_service_name(port)
        })

    return jsonify({"host": host, "ports": results})

@app.route('/api/scan/ping', methods=['POST'])
def ping_host():
    data = request.get_json()
    host = data.get('host', 'localhost')
    
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    command = ['ping', param, '1', host]
    
    try:
        output = subprocess.run(command, capture_output=True, text=True, timeout=5)
        is_alive = output.returncode == 0
    except Exception:
        is_alive = False

    return jsonify({"host": host, "alive": is_alive})

def get_service_name(port):
    services = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
        53: "DNS", 80: "HTTP", 110: "POP3", 143: "IMAP",
        443: "HTTPS", 445: "SMB", 3306: "MySQL",
        3389: "RDP", 5000: "Flask", 8080: "HTTP-Alt", 8443: "HTTPS-Alt"
    }
    return services.get(port, "Unknown")

if __name__ == '__main__':
    app.run(debug=True, port=5000)