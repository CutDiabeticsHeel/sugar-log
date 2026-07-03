import React, { useState } from 'react';

function App() {
  // Инициализируем состояние счетчика
  const [count, setCount] = useState(1);

  // Функция увеличения значения
  function handleClick() {
    setCount(count * 2);
  }

  return (
    <div>
      <h1>Счетчик: {count}</h1>
      <button onClick={handleClick}>Увеличить</button>
    </div>
  );
}

export default App;