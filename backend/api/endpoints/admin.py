from fastapi import APIRouter, HTTPException
import random
import string
from core.log_config import logger
from core.config import get_settings
import sys
from schemas.schemas import ResponseBody, CartItem
from typing import Optional
from store.shared_data import carts, orders
from store.shared_data import coupons


settings = get_settings()

router = APIRouter()

# Function to generate a random coupon code
def generate_coupon_code(length=10):
    """Generate a random coupon code of given length."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


# API to generate a coupon code
@router.get("/generate_coupon", response_model=ResponseBody)
async def generate_coupon():
    try:
        # Generate a unique coupon code (e.g., 10 characters long)
        coupon_code = generate_coupon_code(length=10)

        # Store the coupon code in the in-memory coupons list
        coupons.append(coupon_code)  

        print(orders)
        print(coupons)

        return ResponseBody(
            status='success',
            status_code='200',
            data={"coupon_code": coupon_code},
            message="Coupon generated successfully."
        )


    except Exception as e:
      a,b,c = sys.exc_info()
      line_no = c.tb_lineno
      print(f"Exception: {str(e)} --- {line_no}")
      logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
      raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")
    

@router.get("/stats", response_model=ResponseBody)
async def get_stats():
    try:

        # Initialize statistics variables
        total_items = 0
        total_amount = 0.0
        total_discount = 0.0
        all_orders = []
        coupon_codes = set()

               # Loop through each user and their orders
        for user_id, user_orders in orders.items():
            # Check that user_orders is a list
            if isinstance(user_orders, list):
                for order in user_orders:
                    print(order)
                    # Check if 'cart_items' is a list
                    if isinstance(order.get('cart_items'), list):
                        # Count total items purchased (sum of quantities from cart_items)
                        total_items += sum(item['quantity'] for item in order['cart_items'])

                        # Calculate the total amount spent on the order
                        total_amount += order['total_amount']

                        total_discount = order['discount_applied']

                        # Store the order details
                        all_orders.append(order)

                        # If a discount code exists, add it to the set of coupon codes
                        if order.get('discount_code'):
                            coupon_codes.add(order['discount_code'])
                    else:
                        # Log the issue if 'cart_items' is not a list
                        print(f"Error: 'cart_items' for order_id {order['order_id']} is not a list!")
            else:
                # Log the issue if user_orders is not a list
                print(f"Error: 'user_orders' for user_id {user_id} is not a list!")

        # Convert coupon codes set to a list of dictionaries
        coupon_list = [{"coupon_code": code, "discount": 10.0} for code in coupon_codes]  # Assuming 10% discount for all generated coupons

        # Return the statistics
        return ResponseBody(
            status='success',
            status_code='200',
            data={
                "total_items": total_items,
                "total_amount": total_amount,
                "total_discount": total_discount,
                "orders": all_orders,  # Optionally include orders if needed
                "coupons": coupon_list  # List of unique coupon codes
            },
            message="Statistics retrieved successfully."
        )


    except Exception as e:
      a,b,c = sys.exc_info()
      line_no = c.tb_lineno
      print(f"Exception: {str(e)} --- {line_no}")
      logger.error(f"Exception: {str(e)}, At Line No. : {line_no}")
      raise HTTPException(status_code=500, message="Error occurred while fetching data. Something went wrong")