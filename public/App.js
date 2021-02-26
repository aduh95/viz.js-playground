import { h, Component } from "preact";
import Editor from "./Editor.js";
import Options from "./Options.js";
import Graph from "./Graph.js";

const STORAGE_ENTRY = "viz.js";
const defaultSrc = "digraph { 1 -> 2 }";

let beforeUnloadMessage = null;
function beforeUnload() {
  return beforeUnloadMessage;
}

export default class App extends Component {
  state = {
    src:
      this.getHashDiagram() ||
      localStorage.getItem(STORAGE_ENTRY) ||
      defaultSrc,
    isDark:
      this.props.prerender ||
      matchMedia("(prefers-color-scheme: dark)").matches,
  };

  handleOptionChange = this.handleOptionChange.bind(this);
  handleAceEditorChange = this.handleAceEditorChange.bind(this);

  hashChangeListener = this.hashChangeListener.bind(this);

  hashChangeListener(e) {
    const src = this.getHashDiagram();
    if (src !== this.state.src) {
      this.setState({ src });
    }
  }

  getHashDiagram() {
    if (this.props.prerender) return defaultSrc;
    return decodeURI(location.hash.replace(/^#/, ""));
  }

  handleOptionChange(name, value) {
    this.setState({ [name]: value });
  }

  handleAceEditorChange(src) {
    this.setState({ src });
    localStorage.setItem(STORAGE_ENTRY, src);
  }

  componentDidUpdate(prevProps, prevState) {
    const { src } = this.state;

    if (src !== prevState.src) {
      beforeUnloadMessage = `Your changes will not be saved.`;
    }
  }

  componentDidMount() {
    if (!this.props.prerender) {
      addEventListener("beforeunload", beforeUnload);
    }
    addEventListener("hashchange", this.hashChangeListener);
  }
  componentWillUnmount() {
    removeEventListener("hashchange", this.hashChangeListener);
    removeEventListener("beforeunload", beforeUnload);
  }

  render() {
    return (
      <div id={this.props.id}>
        <header>
          <b>@aduh95/viz.js</b> &mdash;
          <a href="https://www.npmjs.com/package/@aduh95/viz.js">
            <img
              alt="npm package"
              src="https://img.shields.io/npm/v/@aduh95/viz.js.svg"
            />
          </a>
          <a href="https://www.yarnpkg.com/package/@aduh95/viz.js">
            <img
              alt="node version"
              src="https://img.shields.io/node/v/@aduh95/viz.js.svg"
            />
          </a>
          <a href="https://github.com/aduh95/viz.js/blob/master/LICENSE.md">
            <img
              alt="license"
              src="https://img.shields.io/github/license/aduh95/viz.js.svg"
            />
          </a>
          <a href="https://github.com/aduh95/viz.js">
            <img
              alt="github package"
              src="https://img.shields.io/github/stars/aduh95/viz.js.svg?style=social"
            />
          </a>
        </header>

        <Editor
          value={this.state.src}
          onChange={this.handleAceEditorChange}
          isDark={this.state.isDark}
          prerender={this.props.prerender}
        />

        <Options
          isDark={this.state.isDark}
          onOptionChange={this.handleOptionChange}
        />
        <Graph
          src={this.state.src}
          isDark={this.state.isDark}
          prerender={this.props.prerender}
        />
      </div>
    );
  }
}
