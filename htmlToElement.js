var React = require('react')
var ReactNative = require('react-native')
var htmlparser = require('./vendor/htmlparser2')
var entities = require('./vendor/entities')

var {
  Text,
} = ReactNative


var LINE_BREAK = ''
var PARAGRAPH_BREAK = ''
var BULLET = ''

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        var rendered = opts.customRenderer(node, index, list)
        if (rendered || rendered === null) return rendered
      }

      if (node.type == 'text') {
        return (
          <Text key={index} style={[{fontSize:AUTOFONT(50),lineHeight: parseInt(AUTOW(75))},parent ? opts.styles[parent.name] : null]}>
            {entities.decodeHTML(node.data)}
          </Text>
        )
      }

      if (node.type == 'tag') {
        var linkPressHandler = null
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href))
        }

        if (node.name == 'strong') {
          return (
              <Text key={index} style={{fontSize:AUTOFONT(50),fontWeight: '500',lineHeight: parseInt(AUTOW(75))}} onPress={linkPressHandler}>

                {domToElement(node.children, node)}

              </Text>
          )
        }

        if (node.name == 'span') {
          console.log('span',node.attribs.style);
          if (node.attribs.style) {
            if (node.attribs.style.indexOf('color:#') == 0) {
              let local = node.attribs.style.indexOf('#');
              let colorStr = node.attribs.style.slice(local,local+7);
              return (
                  <Text key={index} style={{fontSize:AUTOFONT(50),lineHeight: parseInt(AUTOW(75)),color:colorStr}} onPress={linkPressHandler}>
                    {domToElement(node.children, node)}
                  </Text>
              )
            }
          }
        }

        return (
          <Text key={index} style={{fontSize:AUTOFONT(50),lineHeight: parseInt(AUTOW(75))}} onPress={linkPressHandler}>
            {node.name == 'pre' ? LINE_BREAK : null}
            {node.name == 'li' ? BULLET : null}
            {domToElement(node.children, node)}
            {node.name == 'br' || node.name == 'li' ? LINE_BREAK : null}
            {node.name == 'p' && index < list.length - 1 ? PARAGRAPH_BREAK : null}
            {node.name == 'h1' || node.name == 'h2' || node.name == 'h3' || node.name == 'h4' || node.name == 'h5' ? PARAGRAPH_BREAK : null}
          </Text>
        )
      }
    })
  }

  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err)
    done(null, domToElement(dom))
  })
  var parser = new htmlparser.Parser(handler)
  parser.write(rawHtml)
  parser.done()
}

module.exports = htmlToElement
