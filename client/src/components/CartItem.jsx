const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { product, quantity } = item;

  return (
    <div style={styles.item}>
      
      <img src={product.image} alt={product.name} style={styles.image} />

      <div style={styles.info}>
        <div style={styles.name}>{product.name}</div>

        <div style={styles.quantity}>
          <button
            style={{
              ...styles.qtyBtn,
              opacity: quantity === 1 ? 0.4 : 1,
              cursor: quantity === 1 ? "not-allowed" : "pointer",
            }}
            disabled={quantity === 1}
            onClick={onDecrease}
          >
            −
          </button>

          <span style={styles.qtyNumber}>{quantity}</span>

          <button style={styles.qtyBtn} onClick={onIncrease}>
            +
          </button>
        </div>
      </div>

      
      <div style={styles.right}>
        <div style={styles.price}>
          {(product.price * quantity).toLocaleString()} ₫
        </div>

        <button style={styles.removeBtn} onClick={onRemove}>
          Xoá
        </button>
      </div>
    </div>
  );
};

const styles = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  image: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 500,
    marginBottom: 8,
  },
  quantity: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: 4,
  },
  qtyNumber: {
    minWidth: 20,
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
  price: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#d32f2f",
    cursor: "pointer",
  },
};

export default CartItem;
