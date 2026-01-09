const OnlineStatusChip = ({ isOnline }) => {
  return (
    <span
      className="online-chip"
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: isOnline ? "#22c55e" : "#9ca3af",
        display: "inline-block"
      }}
    />
  );
};

export default OnlineStatusChip;
