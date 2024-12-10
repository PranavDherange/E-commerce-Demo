from fastapi import APIRouter, HTTPException
from core.log_config import logger
from core.config import get_settings
import sys
from schemas.schemas import ResponseBody, CartItem
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

      # Add the item to the user's cart
      carts[user_id].append({
          "product_name": item.product_name,
          "quantity": item.quantity,
          "price": item.price
      })

      return ResponseBody(
        status='success',
        status_code='200',
        data={"cart": carts[user_id]},
        message='Successfully sent data'
      )

    
    except Exception as e:
      a,b,c = sys.exc_info()
      line_no = c.tb_lineno
      print(f"Exception: {str(e)} --- {line_no}")
      logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
      raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")
    

@router.post("/{user_id}/checkout", response_model=ResponseBody)
async def checkout(user_id: int, discount_code: Optional[str] = None):
    try:
        
        # Check if the user's cart exists
        if user_id not in carts or not carts[user_id]:
            raise HTTPException(status_code=400, detail="Cart is empty. Add items to the cart first.")

        # Calculate the total amount for the items in the cart
        total_amount = sum(item['price'] * item['quantity'] for item in carts[user_id])

        # Discount logic
        discount = 0
        if discount_code:
            # Assuming we have a simple condition where every nth order (e.g., every 3rd order) gets a discount
            user_orders = orders.get(user_id, [])
            if len(user_orders) > 0 and (len(user_orders) + 1) % 3 == 0:  # Every 3rd order
                discount = total_amount * 0.10  # 10% discount
                total_amount -= discount  # Apply discount

        # Generate order details
        order = {
            "order_id": len(orders.get(user_id, [])) + 1,  # Order ID is based on the number of orders already placed by the user
            "user_id": user_id,
            "cart_items": carts[user_id],
            "total_amount": total_amount,
            "discount_code": discount_code if discount_code else None,
            "discount_applied": discount
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