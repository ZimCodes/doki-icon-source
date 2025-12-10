import { XMLParser } from "fast-xml-parser";
import {writeFile,readFile} from "node:fs/promises";
import { cloneDeep } from "lodash";
import { create } from "xmlbuilder2";

const parser = new XMLParser({
  preserveOrder: true,
  ignoreAttributes: false
});

function constructSVG(root: any, children: any[]) {
  if (!children) {
    return;
  }

  for (const child of children) {
    /*
    {
    circle: [],
    ':@': {
      '@_cx': '11.56',
      '@_cy': '12.05',
      '@_r': '7.8',
      '@_fill': '#6e85f8'
    }
  }
    * */
    const [nameKey, attrKey] = Object.keys(child);
    const childNode = root.ele(nameKey, child[attrKey] || {});
    constructSVG(childNode, child[nameKey]);
  }
}

function buildXml(workingCopy: any): string {
  /* {
    svg: [ [Object], [Object], [Object] ],
    ':@': {
      '@_id': 'c',
      '@_xmlns': 'http://www.w3.org/2000/svg',
      '@_viewBox': '0 0 24 24'
    }
  }
  * */
  const svgLayer = workingCopy[1];

  const root = create().ele("svg");
  Object.entries(svgLayer[":@"]).forEach(([attributeKey, attributeValue]: [string, string]) => {
    root.att(attributeKey, attributeValue);
  });

  constructSVG(root, svgLayer.svg);

  return root.end({ prettyPrint: true });
}

Promise.resolve()
  .then(async () => {
    const svgPath =
      "C:\Users\notha\IdeaProjects\doki\iconSource\icons\exported\breakpoint.svg";
    // "/Users/alexsimons/workspace/doki-theme-icons/icons/exported/breakpoint.svg";
    const generatedFilePath =
      "C:\Users\notha\IdeaProjects\doki\iconSource\icons\generated\breakpoint.svg";
    // "/Users/alexsimons/workspace/doki-theme-icons/icons/generated/breakpoint.svg";
    let xmlString = await readFile(svgPath, { encoding: "utf-8" });
    const svgToJS = parser.parse(
      xmlString
    );
    const workingCopy = cloneDeep(svgToJS);

    xmlString = buildXml(workingCopy);

    await writeFile(generatedFilePath, xmlString, {
      encoding: "utf-8",
    });
  })
  .then(() => {
    console.log("Icon Generation Complete!");
  });
