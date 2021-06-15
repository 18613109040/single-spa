/*
 * :file description:
 * :name: /single-spa/src/App.tsx
 * :author: 胡东亮
 * :copyright: (c) 2021, Tungee
 * :date created: 2021-05-17 11:46:28
 * :last editor: 胡东亮
 * :date last edited: 2021-06-15 17:19:14
 */

import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    window.addEventListener('hashchange', (e) => {
      console.log('hashchange', e);
      const domEle = document.createElement('div');
      domEle.innerHTML = '<div>add body</div>';
      document.body.appendChild(domEle);
    });
  }, []);

  return (
    <div className="App">
      <div>hash history</div>
      <a href="#/app1">app1</a>
      <a href="#/app2">app3</a>
      <a href="#/app3">app3</a>
    </div>
  );
}

export default App;
