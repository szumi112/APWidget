import Widget from "./Widget";
import logo from "../../public/APlogo.png";
import "../styles/App.css";
import { widgetIds } from "../consts/widgetId";

function App() {
  return (
    <div className="app-container">
      <div className="image-container">
        <img src={logo} alt="Logo" />
      </div>
      <h1>Panel sterowania</h1>
      <div className="widget-container">
        {widgetIds.map((id) => (
          <Widget key={id} id={id} />
        ))}
      </div>
    </div>
  );
}

export default App;
