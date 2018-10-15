import React, { Component } from "react";
import styled from 'styled-components'

import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';

var template = require('./meme_template.jpg')

const canvasWidth = 500
const canvasHeight = 300

const CreateWrapper = styled.div`
  width: 100%;
  margin: auto;
`

const CanvasWrapper = styled.div`
  
`

class MemeImage extends React.Component {
  state = {
    image: null,
    topTextX: null,
    topTextY: 20,
    bottomTextX: null,
    bottomTextY: canvasHeight - 60
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = "http://konvajs.github.io/assets/darth-vader.jpg";
    image.onload = () => {
      this.setState({
        image: image
      })
    }
  }

  handleDragEndTop = e => {
    this.setState({
      topTextX: e.target.x(),
      topTextY: e.target.y()
    })
  }

  handleDragEndBottom = e => {
    this.setState({
      bottomTextX: e.target.x(),
      bottomTextY: e.target.y()
    })
  }

  render() {
    return (
      <Layer>
        <Rect
          width={canvasWidth}
          height={this.state.image ? this.state.image.height : 0}
          fill={'#ababab'}
          shadowBlur={5}
          onClick={this.handleClick}
        />
        <Image
          image={this.state.image}
          height={this.state.image ? this.state.image.height : 0}
          x={this.state.image ? canvasWidth/2 - this.state.image.width/2 : 0}
          ref={node => {
            this.imageNode = node;
          }}
        />
        <Text 
          fill='white'
          x={this.state.topTextX}
          y={this.state.topTextY}
          wrap="char"
          align="center"
          text={this.props.topText} 
          fontSize={40}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          width={canvasWidth}
          draggable={true}
          onDragEnd={this.handleDragEndTop}
        />
        <Text 
          fill='white' 
          x={this.state.bottomTextX}
          y={this.state.bottomTextY}
          wrap="char"
          align="center"
          text={this.props.bottomText} 
          fontSize={40}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          width={canvasWidth}
          draggable={true}
          onDragEnd={this.handleDragEndBottom}
        />
      </Layer>
    )
  }
}


class Create extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageWidth: 0,
      imageHeight: 0,
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT'
    }
  }

  componentDidMount() {
    this.setState({imageWidth: window.innerWidth, imageHeight: canvasHeight})
  }

  handleTopChange = (event) => {
    this.setState({topText: event.target.value});
  }

  handleBottomChange = (event) => {
    this.setState({bottomText: event.target.value});
  }


  render() {
    return (
      <CreateWrapper style={{maxWidth: canvasWidth, height: canvasHeight, background: 'red'}}>
        <CanvasWrapper>
          <Stage
            width={window.innerWidth > canvasWidth ? canvasWidth : window.innerWidth} 
            height={canvasHeight}
          >
            <MemeImage
              topText={this.state.topText}
              bottomText={this.state.bottomText}
            />
          </Stage>
        </CanvasWrapper>

        <form>
          <label>
            Top text:
            <input type="text" name="topText" placeholder="Top text" onChange={this.handleTopChange} />
          </label>
          <label>
            Bottom text:
            <input type="text" name="bottomText" placeholder="Bottom text" onChange={this.handleBottomChange} />
          </label>
        </form>

      </CreateWrapper>
    );
  }
}

export default Create
