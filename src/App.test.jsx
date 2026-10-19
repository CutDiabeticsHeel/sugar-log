import { render, screen  } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from "react-redux";

import { store } from "./store/store";
import Menu from './components/Menu'
import Questions from './components/questions'

test('меню отрендерилось', async () => {
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  )

  expect(screen.getByText('Главная')).toBeInTheDocument()
})

test('блок вопросов отрендерился', async () => {
  render(
    <Provider store={store}>
      <Questions />
    </Provider>
  )
  const el = await screen.findByTestId('questions-section')
  expect(el).toBeInTheDocument()
  const helloEl = await screen.getByText("Вопросы для следующего приема")
  expect(helloEl).toBeInTheDocument()
});