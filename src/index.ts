import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

import { js2xml, xml2js, ElementCompact } from "xml-js";
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

    const template = readFileSync(resolve(projectRoot, config.TEMPLATE), { encoding: "utf8" });
    const xmlObj: ElementCompact = xml2js(template, { compact: true });

    if (!xmlObj["widget"] || !xmlObj["widget"]._attributes["version"] || !xmlObj["widget"]["content"]) {
      throw new Error(`Invalid ${config.TEMPLATE}, need '<widget version="\${version}" ...>' and "<content src="\${url}" />`)
    }

    xmlObj["widget"]._attributes["version"] = pkgInfo.version;
    xmlObj["widget"]["content"]._attributes["src"] = url;

    const xmlText = js2xml(xmlObj, { compact: true, spaces: 2 });

    writeFileSync(resolve(projectRoot, "config.xml"), xmlText);
  } catch (error) {
    console.error(`[${pluginId}]: ${error.stack}`);
  }
};
