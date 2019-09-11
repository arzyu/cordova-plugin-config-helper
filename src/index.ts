import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

import render from "es6-template-strings"
import ip from "ip";
import { getJson } from "@arzyu/get-json";

export = ({ opts }: any) => {
  type Config = {
    TEMPLATE: string;
    DEV_SERVER: string;
    INDEX: string;
  };

  const { projectRoot } = opts;
  const { id: pluginId } = opts.plugin;

  try {
    const pkgInfo = getJson(`${projectRoot}/package.json`);
    const config: Config = pkgInfo.cordova.plugins[pluginId];
    const url = process.env.NODE_ENV === "development"
      ? render(`${config["DEV_SERVER"]}/${config["INDEX"]}`, { host: ip.address() })
      : config["INDEX"];

    const data = { version: pkgInfo.version, url };
    const template = readFileSync(resolve(projectRoot, config.TEMPLATE))

    writeFileSync(resolve(projectRoot, "config.xml"), render(template, data));
  } catch (error) {
    console.error(`[${pluginId}]: ${error.stack}`);
  }
};
