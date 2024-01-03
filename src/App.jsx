import Main from "@/pages/"
import { BrowserRouter } from 'react-router-dom';
import Provider from "@/provider";
export default function App() {
  return (
    <BrowserRouter>
      <Provider>
        <Main />
      </Provider>
    </BrowserRouter>
  );
}
