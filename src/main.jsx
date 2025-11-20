import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'

import App from './App'
import { store } from './services/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <Container>
                <App />
            </Container>
        </BrowserRouter>
    </Provider>
)
