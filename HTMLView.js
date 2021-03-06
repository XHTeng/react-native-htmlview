var React = require('react')
var ReactNative = require('react-native')
var htmlToElement = require('./htmlToElement')
var {
    Linking,
    StyleSheet,
    Text,
    View,
    Image
} = ReactNative

import FitImage from 'react-native-fit-image';

var HTMLView = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
    stylesheet: React.PropTypes.object,
    onLinkPress: React.PropTypes.func,
    onError: React.PropTypes.func,
    renderNode: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onLinkPress: Linking.openURL,
      onError: console.error.bind(console),
    }
  },

  getInitialState() {
    return {
      element: null,
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  },

  componentDidMount() {
    this.mounted = true
    this.startHtmlRender(this.props.value)
  },

  componentWillUnmount() {
    this.mounted = false
  },

  startHtmlRender(value) {
    if (!value) return this.setState({element: null})

    var opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    }

    htmlToElement(this.props.isShowArticle,value, opts, (err, element) => {
      if (err) return this.props.onError(err)

      if (this.mounted) this.setState({element})
    })
  },

  render() {
    if (this.state.element) {
      return <View>
        {this.state.element}
      </View>
    }
    return <View>

    </View>
  },
})

var boldStyle = {fontWeight: '500',fontSize:AUTOFONT(50),lineHeight: parseInt(AUTOW(75))}
var italicStyle = {fontStyle: 'italic'}
var codeStyle = {fontFamily: 'Menlo'}

var baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    color: '#333333',
    fontSize:AUTOFONT(50),
    lineHeight: parseInt(AUTOW(75))
  },
})

module.exports = HTMLView
