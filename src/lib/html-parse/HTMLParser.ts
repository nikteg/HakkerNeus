import * as HTMLParser from "fast-html-parser";

export function parseHTML(html: string) {
  const res = HTMLParser.parse(html, {
    lowerCaseTagName: true,
    pre: true,
  });

  return res.childNodes[0];
}
