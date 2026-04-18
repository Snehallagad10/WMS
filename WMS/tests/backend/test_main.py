from fastapi.testclient import TestClient
from backend.app.main import app


client = TestClient(app)


def test_read_root():
    r = client.get('/')
    assert r.status_code == 200
    assert r.json().get('message') == 'WMS backend is running'
