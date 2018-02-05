import React from 'react';
import { insertScript, removeScript, debounce } from './utils';

const queueResetCount = debounce(
  () => {
    if (window.DISQUSWIDGETS) window.DISQUSWIDGETS.getCount({ reset: true });
  },
  300,
  false
); // eslint-disable-line no-magic-numbers

export class CommentCount extends React.Component {
  componentDidMount() {
    this.doc = window.document;
    this.loadInstance();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.shortname !== nextProps.shortname) return true;

    const nextConfig = nextProps.config;
    const config = this.props.config;
    if (
      nextConfig.url === config.url ||
      nextConfig.identifier === config.identifier
    )
      return false;
    return true;
  }

  componentWillUpdate(nextProps) {
    if (this.props.shortname !== nextProps.shortname) this.cleanInstance();
  }

  componentDidUpdate() {
    this.loadInstance();
  }

  loadInstance() {
    if (this.doc.getElementById('dsq-count-scr')) queueResetCount();
    else
      insertScript(
        `https://${this.props.shortname}.disqus.com/count.js`,
        'dsq-count-scr',
        this.doc.body
      );
  }

  cleanInstance() {
    removeScript('dsq-count-scr', this.doc.body);

    // count.js only reassigns this window object if it's undefined.
    window.DISQUSWIDGETS = undefined;
  }

  render() {
    return (
      <span
        className="disqus-comment-count"
        data-disqus-identifier={this.props.config.identifier}
        data-disqus-url={this.props.config.url}
      />
    );
  }
}
