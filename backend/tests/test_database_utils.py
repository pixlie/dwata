from starlette.testclient import TestClient

from server import app


def test_get_all_sources():
    client = TestClient(app=app)
    response = client.get("/api/source")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "columns" in data
    assert "rows" in data
    assert data["rows"] == [["dwata_meta", "database", "sqlite", {"is_system_db": True}]]


def test_get_source_settings_of_dwata_meta():
    client = TestClient(app=app)
    response = client.get("/api/schema/dwata_meta")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "columns" in data
    assert "rows" in data
    assert isinstance(data["rows"], list)
