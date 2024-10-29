const orders = [];

export default class OrderService {
  static addOrder(order) {
    orders.push(order);
  }
}
