/*
 * :file description:
 * :name: /single-spa/src/App.tsx
 * :author: 胡东亮
 * :copyright: (c) 2021, Tungee
 * :date created: 2021-05-17 11:46:28
 * :last editor: 胡东亮
 * :date last edited: 2021-06-16 14:49:04
 */

import { useEffect } from 'react';
import './App.css';

type AppType = {
  bootstrap?: () => Promise<any>;
  mount?: () => Promise<any>;
  unmount?: () => Promise<any>;
};
type RegisterAppConfig = {
  name: string;
  loadApp: () => AppType;
  activeWhen: (location: Location) => boolean;
  customProps: Record<string, any>;
};

type AppConfig = RegisterAppConfig;
let apps: AppConfig[] = [];
let appsToLoad: AppConfig[] = [];
let domEl: HTMLDivElement | null = null;
function App() {
  // 注册
  const registerApplication = (config: RegisterAppConfig) => {
    apps.push(config);
  };
  // 启动
  const start = () => {
    apps.forEach((app) => {
      const appShouldBeActive = app.activeWhen(window.location);
      if (appShouldBeActive) {
        appsToLoad.push(app);
      }
    });
    appsToLoad.map(async (load: AppConfig) => {
      await load.loadApp().bootstrap!();
      await load.loadApp().mount!();
    });
  };
  // 监听 hashChange 事件
  const hashChange = () => {
    window.addEventListener('hashchange', async (e) => {
      if (e.newURL !== e.oldURL) {
        appsToLoad.map(async (load: AppConfig) => {
          await load.loadApp().unmount!();
        });
        appsToLoad = [];
        start();
      }
    });
  };

  useEffect(() => {
    hashChange();
    registerApplication({
      name: 'app1',
      loadApp: () => {
        return {
          bootstrap: async () => {
            console.log('应用启动 app1');
            domEl = document.createElement('div');
            domEl.id = 'app1';
            document.body.appendChild(domEl);
          },
          mount: async () => {
            console.log('应用挂载 app1');
            domEl!.innerHTML = `App 1 is mounted! <a href=#/app2>Go to app2</a>`;
          },
          unmount: async () => {
            console.log('应用卸载 app1');
            domEl!.innerHTML = '';
          },
        };
      },
      activeWhen: (location: Location) => location?.hash.startsWith('#/app1'),
      customProps: {},
    });
    registerApplication({
      name: 'app2',
      loadApp: () => {
        return {
          bootstrap: async () => {
            console.log('应用启动 app2');
            domEl = document.createElement('div');
            domEl.id = 'app2';
            document.body.appendChild(domEl);
          },
          mount: async () => {
            console.log('应用挂载 app2');
            domEl!.innerHTML = `App 1 is mounted! <a href=#/app1>Go to app1</a>`;
          },
          unmount: async () => {
            console.log('应用卸载 app2');
            domEl!.innerHTML = '';
          },
        };
      },
      activeWhen: (location: Location) => location?.hash.startsWith('#/app2'),
      customProps: {},
    });
    start();
    return () => {
      apps = [];
    };
  }, []);

  return (
    <div className="App">
      <div>hash history</div>
    </div>
  );
}

export default App;
