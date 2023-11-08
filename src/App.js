import './App.css';
import * as React from 'react';
import Controller from './controller';

const controller = new Controller();

function App() {
  const [tracing, updateTracing] = React.useState(false);

  const handleTracing = () => {

    if (tracing) {
      updateTracing(false);
      controller.stop();
    } else {
      updateTracing(true);
      controller.start();
    }
  }

  const example = () => {
    controller.example();
  }

  const share = async () => {
    const shareData = {
      title: "Geo path",
      text: "Geo path",
      url: "https://geo-path.pages.dev/",
    };

    await navigator.share(shareData);
  }

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={handleTracing}>{tracing ? 'Stop tracing' : 'Start tracing'}</button>
        <button onClick={share}>Share</button>
        <button onClick={example}>Example</button>
      </div>
      <div className="altitude">Altitude: <span className="value"></span></div>
    </div>
  );
}

export default App;
