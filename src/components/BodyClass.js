import React from "react";

class BodyClass extends React.Component {
  componentDidMount() {
    this.props.className.split(" ").forEach(className => {
      document.body.classList.add(className);
    });
  }

  componentWillUnmount() {
    this.props.className.split(" ").forEach(className => {
      document.body.classList.remove(className);
    });
  }

  render() {
    return this.props.children;
  }
}

export default BodyClass
