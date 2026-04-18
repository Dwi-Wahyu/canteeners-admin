export type AddCartItemSchemaType = {
  cart_id: string;
  shop_id: string;
  product_id: string;
  price_at_add: number;
  quantity: number;
  selected_option_value_ids: string[];
};
