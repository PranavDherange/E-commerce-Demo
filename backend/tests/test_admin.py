import pytest
import sys
import os
from datetime import date
from fastapi.testclient import TestClient
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_fetch_coupon_test_valid():

    response = client.get(f"v1/admin/generate_coupon")
    print("Response: " ,response.content)
    assert response.json()["status_code"] == 200
    assert "Coupon generated successfully." in response.json()['message']

def test_fetch_stats_test_valid():

    response = client.get(f"v1/admin/stats")
    print("Response: " ,response.content)
    assert response.json()["status_code"] == 200
    assert "Statistics retrieved successfully." in response.json()['message']