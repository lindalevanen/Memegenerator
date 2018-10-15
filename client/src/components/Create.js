import React, { Component } from "react";
import styled from 'styled-components'

import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';

var template = require('./meme_template.jpg')

const canvasWidth = 500
const canvasHeight = 300

const CreateWrapper = styled.div`
  //TODO
`

const CanvasWrapper = styled.div`
  width: 100%;
  margin: auto;
`

class MemeImage extends React.Component {
  state = {
    image: new window.Image()
  };
  handleClick = () => {
    //TODO
    this.state.image.src = 'http://konvajs.github.io/assets/darth-vader.jpg';
    this.state.image.onload = () => {
      // calling set state here will do nothing
      // because properties of Konva.Image are not changed
      // so we need to update layer manually
      this.imageNode.getLayer().batchDraw();
    };
  };
  render() {
    return (
      <Layer>
        <Rect
          width={canvasWidth}
          height={canvasHeight}
          fill={'#ababab'}
          shadowBlur={5}
          onClick={this.handleClick}
        />
        <Image
          image={this.state.image}
          height={canvasHeight}
          ref={node => {
            this.imageNode = node;
          }}
        />
        <Text 
          fill='white' 
          x={canvasWidth / 2 - 50} 
          y={20} text="Lolleropallero" 
          fontSize={20}
        />
        <Text 
          fill='white' 
          x={canvasWidth / 2 - 50} 
          y={canvasHeight - 50} 
          text="Lollerspollers" 
          fontSize={20}
        />
      </Layer>
    );
  }
}


class Create extends Component {
  render() {
    return (
      <CreateWrapper>
        <CanvasWrapper style={{maxWidth: canvasWidth, height: canvasHeight}}>
          <Stage 
            width={window.innerWidth > canvasWidth ? canvasWidth : window.innerWidth} 
            height={canvasHeight}
          >
            <MemeImage />
          </Stage>
        </CanvasWrapper>
      </CreateWrapper>
    );
  }
}

export default Create
