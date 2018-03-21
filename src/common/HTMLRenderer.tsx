import * as React from "react";
import { View, Text, Image, TextStyle } from "react-native";
import * as he from "he";
import { parseHTML } from "../lib/html-parse/HTMLParser";

type Props = {
  html: string | null;
};

type HTMLTag = {
  tagName?: string | null;
  childNodes?: HTMLTag[];
  rawText?: string;
};

function renderText(text): React.ReactNode {
  const decodedText = he.decode(text);
  return <Text>{decodedText}</Text>;
}

function renderChildrenOrText(children: HTMLTag[], text?: string): React.ReactNode {
  if (children && children.length > 0) {
    return children.map(renderHTMLTag);
  } else {
    return renderText(text);
  }
}

function renderInline(props: HTMLTag, style: TextStyle = {}): React.ReactNode {
  return <Text>{renderChildrenOrText(props.childNodes, props.rawText)}</Text>;
}

function renderBlock(props: HTMLTag): React.ReactNode {
  return <View>{renderChildrenOrText(props.childNodes, props.rawText)}</View>;
}

const renderEm = (props: HTMLTag) => renderInline(props, { fontStyle: "italic" });

const tagMap = {
  div: renderInline,
  figure: renderBlock,
  figcaption: renderBlock,
  p: renderInline,
  a: renderInline,
  span: renderInline,
  em: renderEm,
  blockquote: renderBlock,
};

function getComponentFromTagName(tag: HTMLTag, props: {}): React.ReactNode | null {
  const renderFn = tagMap[tag.tagName];

  if (renderFn) {
    return renderFn(tag);
  } else {
    console.log("Not sure what to do with ", tag);
    return <View />;
  }
}

function renderHTMLTag(tag: HTMLTag, key: number): React.ReactNode {
  if (!tag.tagName) {
    return renderChildrenOrText(tag.childNodes, tag.rawText);
  }

  if (tag.tagName === "img") {
    console.log("img", tag.rawAttributes);
    return <Image key={key} source={{ uri: tag.attributes.src, height: 100, width: 100 }} />;
  }

  const component = getComponentFromTagName(tag, { htmlNode: tag.tagName, key });

  console.log({ component });

  return component;
}

export default class HTMLRenderer extends React.Component<Props> {
  render() {
    const { html, ...props } = this.props;
    if (!html) {
      return null;
    }
    const ast = parseHTML(html);
    return <View {...props}>{renderHTMLTag(ast, 0)}</View>;
  }
}
