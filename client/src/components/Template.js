import React, { Component } from "react";
import styled from "styled-components";

class Template extends Component {
  TEMPLATE_API_URL = "https://api.imgflip.com/get_memes";

  constructor(props) {
    super(props);
  }

  randomIndex = () => {};

  drawTemplate = () => {
    if (this.props.json) {
      let json = this.props.json;
      let url = json[Math.floor(Math.random() * json.length)].url;
      return <TemplateImg src={url} />;
    }
    return <div />;
  };

  render() {
    return this.drawTemplate();
  }
}

const TemplateImg = styled.img`
  padding: auto;
  margin: 10px;
  width: 400px;
  height: 400px;
`;

export default Template;
