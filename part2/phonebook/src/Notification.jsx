// src/Notification.jsx
const Notification = ({ message }) => {
  if (message === null) return null;

  const notificationStyle = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgray',
    fontSize: 20,
    border: `2px solid ${message.type === 'error' ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message.text}</div>;
};

export default Notification;
