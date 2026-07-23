import urllib.request, json, time
print("Simulating frontend request...")
req = urllib.request.Request(
    'http://localhost:8000/api/auth/login',
    data=b'username=admin&password=admin',
    headers={'Content-Type': 'application/x-www-form-urlencoded'}
)
resp = urllib.request.urlopen(req)
token = json.loads(resp.read().decode())['access_token']
print("Got token")

req = urllib.request.Request(
    'http://localhost:8000/api/ai/chat',
    data=json.dumps({"content": "hello"}).encode(),
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
)
start = time.time()
resp = urllib.request.urlopen(req)
print(f"Time taken: {time.time() - start:.2f}s")
print(resp.read().decode())
