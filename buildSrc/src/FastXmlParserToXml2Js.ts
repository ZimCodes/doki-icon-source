export function stripAttribute(attr:string) : string {
  if (attr.startsWith("@_")) {
    return attr.slice(2);
  }
  return attr;
}
export function stripAttributeObj(attrObj: any) {
  const stripAttrObj: { [key: string]: any } = {};
  for (const [k, v] of Object.entries(attrObj)) {
    const newKey = stripAttribute(k);
    stripAttrObj[newKey] = v;
  }
  return stripAttrObj;
}
export function convertJSObj(fastXMLObj:any) : any {
  let xml2jsObj: {[key: string]:any} = {svg:{}};
  xml2jsObj.svg = setObj(fastXMLObj);
  return xml2jsObj;
}
function setObj(fastXMLObj:any) {
   const objKeys = Object.keys(fastXMLObj);
   const attrKey = ':@';
   const tagKey = objKeys.find((k) => k !== ':@') || 'g';
   const resultObj:{[ key:string ]:any}  = {
     "#name": tagKey,
     $:{},
     $$: !!fastXMLObj[tagKey] ? new Array(fastXMLObj[tagKey].length) : []
   };
  if (fastXMLObj[attrKey]) {
    for (const [attr, val] of Object.entries(fastXMLObj[attrKey])) {
      const stripAttr = stripAttribute(attr);
      resultObj["$"][stripAttr] = val;
    }
  }
  if (fastXMLObj[tagKey]) {
    for (let i = 0; i < fastXMLObj[tagKey].length; i++) {
      resultObj["$$"][i] = setObj(fastXMLObj[tagKey][i]);
    }
  }
  return resultObj;
}