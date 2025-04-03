from flask import Flask, jsonify, request

app = Flask(__name__)

# Cache control for smoother animations
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-transform, public, max-age=0'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

# Mock device states
devices = {
    "light": {"status": False, "brand": "philips"},
    "ac": {"status": False, "brand": "samsung"},
    "tv": {"status": False, "brand": "lg"},
    "airpurifier": {"status": False, "brand": "daikin"},
    "fridge": {"status": False, "brand": "whirlpool"},
    "cooler": {"status": False, "brand": "havells"},
    "sound": {"status": False, "brand": "sony"},
    "vacuum": {"status": False, "brand": "irobot"}
}

@app.route('/')
def dashboard():
    return app.send_static_file('premium-dashboard.html')

# Device control endpoints
@app.route('/api/<device>/<action>', methods=['POST'])
def control_device(device, action):
    if device not in devices:
        return jsonify({"error": "Device not found"}), 404
    
    if action == 'on':
        devices[device]["status"] = True
        return jsonify({"status": "ON", "device": device})
    elif action == 'off':
        devices[device]["status"] = False
        return jsonify({"status": "OFF", "device": device})
    else:
        return jsonify({"error": "Invalid action"}), 400

# Device status check
@app.route('/api/<device>/status')
def device_status(device):
    if device not in devices:
        return jsonify({"error": "Device not found"}), 404
    return jsonify({"status": "ON" if devices[device]["status"] else "OFF"})

# Get all devices status
@app.route('/api/devices')
def all_devices():
    return jsonify({
        dev: {"status": data["status"], "brand": data["brand"]} 
        for dev, data in devices.items()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)