import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import type { OrderItem } from "@shared-types/database-types";

export const useOrderStore = defineStore("orders", () => {
  const shoppingCart = reactive<OrderItem[]>([]);

  watch(shoppingCart, saveShoppingCart, { deep: true });

  function loadShoppingCart() {
    Object.assign(shoppingCart, JSON.parse(localStorage.getItem("shoppingCart") ?? "[]"));
  }

  function saveShoppingCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }

  function findOrderItemIndex(newOrderItem: Omit<OrderItem, "amount">) {
    return shoppingCart.findIndex(orderItem =>
      orderItem.productId === newOrderItem.productId
      && orderItem.size === newOrderItem.size
      && orderItem.color === newOrderItem.color);
  }

  /**
   *
   * @param newOrderItem {@link OrderItem}
   * @return Whether the item was added or only its amount incremented
   */
  function addOrderItem(newOrderItem: OrderItem) {
    const existingItem = findOrderItemIndex(newOrderItem);

    if (existingItem > -1) {
      shoppingCart[existingItem].amount += newOrderItem.amount;
      return false;
    }

    shoppingCart.push(newOrderItem);
    return true;
  }

  /**
   *
   * @param orderItem {@link OrderItem} without its amount
   * @returns Whether the item was removed or only its amount decremented
   */
  function removeOrderItem(orderItem: OrderItem) {
    const existingItem = findOrderItemIndex(orderItem);

    if (!(existingItem > -1) || !(shoppingCart[existingItem].amount -= orderItem.amount)) {
      shoppingCart.splice(existingItem, 1);
      return true;
    }

    return false;
  }

  function clearShoppingCart() {
    shoppingCart.splice(0, shoppingCart.length);
  }

  return { shoppingCart, loadShoppingCart, findOrderItemIndex, addOrderItem, removeOrderItem, clearShoppingCart };
});
