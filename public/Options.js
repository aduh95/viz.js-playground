import { h, Component } from "preact";

class Options extends Component {
  handleChange = this.handleChange.bind(this);

  togglePreviewOnMobile(e) {
    document.documentElement.style.setProperty(
      "--preview",
      e.target.checked ? '"graph"' : ""
    );
    document.documentElement.style.setProperty(
      "--graph-preview",
      e.target.checked ? "block" : "none"
    );
    document.documentElement.style.setProperty(
      "--editor-preview",
      e.target.checked ? "none" : "block"
    );
  }

  handleChange({ target }) {
    const { name } = target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.props.onOptionChange(name, value);
  }

  render() {
    return (
      <div className="options">
        <label>
          <input
            name="isDark"
            type="checkbox"
            checked={this.props.isDark}
            onChange={this.handleChange}
          />{" "}
          Dark mode
        </label>
        <label className="mobile-only">
          <input
            name="isPreview"
            type="checkbox"
            value={this.props.isPreview}
            onChange={this.togglePreviewOnMobile}
          />{" "}
          Preview
        </label>
      </div>
    );
  }
}

export default Options;
