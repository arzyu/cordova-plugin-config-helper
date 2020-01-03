# cordova-plugin-config-helper

Generate config.xml before cordova prepare.

Features:

 * sync `version` from `package.json` to config.xml
 * set content url for `<content src="..." />`, it works perfectly with webpack-dev-server

## Installation

```bash
cordova plugin add cordova-plugin-config-helper
```

## Usage

`package.json`:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "NODE_ENV=development cordova run android",
    "build": "cordova build android"
  },
  "cordova": {
    "plugins": {
      "cordova-plugin-config-helper": {
        "TEMPLATE": "config.tpl.xml",
        "DEV_HOST": "",
        "DEV_PORT": "3000",
        "INDEX": "index.html"
      }
    }
  }
}
```

`config.tpl.xml`:

```xml
<widget id="com.sample.app" version="${version}" ...>
  <content src="${url}" />
  ...
</widget>
```

 * `npm start`, generate `config.xml` for development
 * `npm run build`, generate `config.xml` for production

Tips: You should add `config.xml` to `.gitignore`.
