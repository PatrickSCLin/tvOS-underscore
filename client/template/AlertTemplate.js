var Alert_Template = 
`<?xml version="1.0" encoding="UTF-8" ?>
<document>
  <alertTemplate>
    <title><%=title%></title>
    <description><%=description%></description>
  </alertTemplate>
</document>`;

var createAlert = function(title, description) {

    var template = _.template(Alert_Template);

    var parser = new DOMParser();

    var doc = parser.parseFromString(template({ title: title, description: description}), "application/xml");

    return doc;
}