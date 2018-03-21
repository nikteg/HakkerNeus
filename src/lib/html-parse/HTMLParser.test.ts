import { parseHTML } from "./HTMLParser";

describe("parse", () => {
  it("should parse pre block", () => {
    const preCodeBlock =
      "<pre>\n assets/js/water_cooler.js\n <code>\n let WaterCooler = { init(socket) { let channel = socket.channel(&apos;water_cooler:lobby&apos;, {}) channel.join() this.listenForChats(channel) }, listenForChats(channel) { document.getElementById(&apos;chat-form&apos;).addEventListener(&apos;submit&apos;, function(e){ e.preventDefault() let userName = document.getElementById(&apos;user-name&apos;).value let userMsg = document.getElementById(&apos;user-msg&apos;).value channel.push(&apos;shout&apos;, {name: userName, body: userMsg}) document.getElementById(&apos;user-name&apos;).value = &apos;&apos; document.getElementById(&apos;user-msg&apos;).value = &apos;&apos; }) channel.on(&apos;shout&apos;, payload =&gt; { let chatBox = document.querySelector(&apos;#chat-box&apos;) let msgBlock = document.createElement(&apos;p&apos;) msgBlock.insertAdjacentHTML(&apos;beforeend&apos;, `<b>${payload.name}:</b> ${payload.body}`) chatBox.appendChild(msgBlock) }) }\n } export default WaterCooler\n </code>\n </pre>";
    const parsed = parseHTML(preCodeBlock);
    expect(parsed.tagName).toEqual("pre");
    expect(parsed.childNodes).toHaveLength(1);
    expect(parsed.childNodes[0]).toHaveProperty("rawText");
    expect(parsed.childNodes[0]).not.toHaveProperty("tagName");
  });

  it("should lowercase tagnames", () => {
    const html = "<UL><LI>item 1</LI><LI>item 2</LI></UL>";
    const parsed = parseHTML(html);
    expect(parsed.tagName).toEqual("ul");
    expect(parsed.childNodes).toHaveLength(2);
    expect(parsed.childNodes[0]).toHaveProperty("tagName", "li");
    expect(parsed.childNodes[1]).toHaveProperty("tagName", "li");
  });
});
