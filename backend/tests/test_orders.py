import pytest
import sys
import os
from datetime import date
from fastapi.testclient import TestClient
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_add_items_test_valid():
    user_id= 1

    data = {
    "product_name": "macbook pro max",
    "quantity": 1,
    "price": 199.99
}

    # Test: Request api with invalid json data
    response = client.post(f"v1/orders/{user_id}/add_item", json=data)
    print("Response: " ,response.content)
    assert response.status_code == 200
    assert "Successfully added item to cart" in response.json()['message']

def test_add_items_test_invalid():
    user_id= -1

    data = {
    "product_name": "macbook pro max",
    "quantity": 1,
    "price": 199.99
}

    # Test: Request api with invalid json data
    response = client.post(f"v1/orders/{user_id}/add_item", json=data)
    print("Response: " ,response.content)
    assert response.json()["status_code"] == 400
    assert "Invalid user ID" in response.json()['message']

def test_checkout_test_valid():
    user_id= 1

    data = {"user_id":"1","total_amount":2519.982,"discount_code":"2762J283UB","discount_applied":279.998}


    # Test: Request api with invalid json data
    response = client.post(f"v1/orders/{user_id}/checkout", json=data)
    print("Response: " ,response.content)
    assert response.status_code == 200
    assert "Order placed successfully" in response.json()['message']