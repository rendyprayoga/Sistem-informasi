import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./main.css"
import store from './store'
import RoutesApp from './Routes.jsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RoutesApp />
    </Provider>,
)
