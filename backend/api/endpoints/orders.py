from fastapi import APIRouter, HTTPException
from core.log_config import logger
from core.config import get_settings
import sys
from schemas.schemas import ResponseBody, CartItem, Order
from typing import Optional
from store.shared_data import carts, orders


settings = get_settings()

router = APIRouter()

@router.get("/test", response_model=ResponseBody)
async def test():
    try:
      return ResponseBody(
        status='success',
        status_code='200',
        data={"message":"hello world"},
        message='Successfully sent data'
      )
    except Exception as e:
        a,b,c = sys.exc_info()
        line_no = c.tb_lineno
        print(f"Exception: {str(e)} --- {line_no}")
        logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
        raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")
    

@router.post("/{user_id}/add_item", response_model=ResponseBody)
async def add_item_to_cart(user_id: int, item: CartItem):
    try:
        # Check if the user already has a cart
        if user_id not in carts:
            carts[user_id] = []  # Create a new cart for the user if it doesn't exist

        # Check if the item already exists in the user's cart
        existing_item_index = next((index for index, cart_item in enumerate(carts[user_id]) if cart_item['product_name'] == item.product_name), None)

        if existing_item_index is not None:
            # If item exists, update the quantity
            carts[user_id][existing_item_index]['quantity'] += item.quantity
        else:
            # If item doesn't exist, add it to the cart
            carts[user_id].append({
                "product_name": item.product_name,
                "quantity": item.quantity,
                "price": item.price
            })

        return ResponseBody(
            status='success',
            status_code='200',
            data={"cart": carts[user_id]},
            message='Successfully added item to cart'
        )

    
    except Exception as e:
      a,b,c = sys.exc_info()
      line_no = c.tb_lineno
      print(f"Exception: {str(e)} --- {line_no}")
      logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
      raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")
    

@router.post("/{user_id}/checkout", response_model=ResponseBody)
async def checkout(user_id: int, order: Order):
    try:
        
        # Check if the user's cart exists
        if user_id not in carts or not carts[user_id]:
            return ResponseBody(
            status='failed',
            status_code='400',
            data={"message": "cart is empty"},
            message='Successfully sent data'
          )

        # Calculate the total amount for the items in the cart
        total_amount = sum(item['price'] * item['quantity'] for item in carts[user_id])

        # Generate order details
        order = {
            "order_id": len(orders.get(user_id, [])) + 1,  # Order ID is based on the number of orders already placed by the user
            "user_id": user_id,
            "cart_items": carts[user_id],
            "total_amount": order.total_amount,
            "discount_code": order.discount_code if order.discount_code else None,
            "discount_applied": order.discount_applied if order.discount_applied else 0.0 
        }

        # Store the order in the user's order history
        if user_id not in orders:
            orders[user_id] = []  # If the user doesn't have any orders, initialize the list

        orders[user_id].append(order)  # Add the new order to the user's order list

        # Clear the user's cart after checkout (order completed)
        carts[user_id] = []

        return ResponseBody(
          status='success',
          status_code='200',
          data={"orders": orders[user_id]},
          message='Successfully sent data'
        )


    except Exception as e:
      a,b,c = sys.exc_info()
      line_no = c.tb_lineno
      print(f"Exception: {str(e)} --- {line_no}")
      logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
      raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")


@router.get("/{user_id}/orders", response_model=ResponseBody)
async def get_orders(user_id: int):
    try:
        # Check if the user has any orders
        if user_id not in orders or not orders[user_id]:
              return ResponseBody(
              status="not found",
              status_code="404",
              data={"message": "orders not found"},
              message="message sent successfully."
          )    

        # Retrieve the orders for the given user
        user_orders = orders[user_id]

        return ResponseBody(
            status="success",
            status_code="200",
            data={"orders": user_orders},
            message="Orders fetched successfully"
        )
    except Exception as e:
        a, b, c = sys.exc_info()
        line_no = c.tb_lineno
        print(f"Exception: {str(e)} --- {line_no}")
        raise HTTPException(status_code=500, detail="Error occurred while fetching data. Something went wrong")