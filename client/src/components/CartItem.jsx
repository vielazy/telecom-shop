const CartItem = ({ item, onRemove }) => {
  return (
    <div style={styles.item}>
      <span>{item.product.name}</span>
      <span>Số lượng: {item.quantity}</span>
      <span>{item.product.price.toLocaleString()} ₫</span>

      <button onClick={() => onRemove(item.product._id)}>Xoá</button>
    </div>
  );
};

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    padding: "8px 0",
  },
};

export default CartItem;
