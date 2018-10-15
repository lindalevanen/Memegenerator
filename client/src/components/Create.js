import React, { Component } from 'react'
import styled from 'styled-components'

import { Stage, Layer, Rect, Text, Image } from 'react-konva'
import Konva from 'konva'

const meme = require('./memetemplate.jpg')

const canvasWidth = 500
const canvasHeight = 300

const CreateWrapper = styled.div`
  width: 100%;
  margin: auto;
`

const CanvasWrapper = styled.div``

const MemeTextForm = styled.form`
  margin-top: 20px;

  input {
    height: 40px;
    width: 100%;
    font-size: 100%;
    padding-left: 10px;
  }

  label {
    display: block; 
    margin-bottom: 10px;
  }
`

const CreateMemeButton = styled.div`
  width: 100%;
  background: gray;
  text-align: center;
  margin-top: 40px;
  padding: 20px;
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
    image.src = meme;
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
          x={
            this.state.image ? canvasWidth / 2 - this.state.image.width / 2 : 0
          }
          ref={node => {
            this.imageNode = node
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
  stageRef = null
  constructor(props) {
    super(props)
    this.state = {
      imageWidth: 0,
      imageHeight: 0,
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      templates: ''
    }
  }

  TEMPLATE_API_URL = 'https://api.imgflip.com/get_memes'

  fetchTemplates = async () => {
    try {
      const response = await fetch(this.TEMPLATE_API_URL)
      const body = await response.json()
      if (body.success) {
        this.setState({ templates: await body.data })
      }
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    this.setState({ imageWidth: window.innerWidth, imageHeight: canvasHeight })
    this.fetchTemplates()
  }

  handleTopChange = event => {
    this.setState({ topText: event.target.value })
  }

  handleBottomChange = event => {
    this.setState({ bottomText: event.target.value })
  }

  // function from https://stackoverflow.com/a/15832662/512042
  downloadURI = (uri, name) => {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      //delete link;  // cant do this and idk if its bad to not do this...
  }

  createMeme = () => {
    var dataURL = this.stageRef.getStage().toDataURL();
    console.log(dataURL)
    this.downloadURI(dataURL, 'stage.png');
  }

  render() {
    return (
      <CreateWrapper style={{maxWidth: canvasWidth, height: canvasHeight}}>
        <CanvasWrapper>
          <Stage
            ref={ref => (this.stageRef = ref)}
            width={window.innerWidth > canvasWidth ? canvasWidth : window.innerWidth} 
            height={canvasHeight}
          >
            <MemeImage
              topText={this.state.topText}
              bottomText={this.state.bottomText}
            />
          </Stage>
        </CanvasWrapper>

        <MemeTextForm>
          <label>
            <p>Top text</p>
            <input type="text" name="topText" placeholder="Top text" onChange={this.handleTopChange} />
          </label>
          <label>
            <p>Bottom text:</p>
            <input type="text" name="bottomText" placeholder="Bottom text" onChange={this.handleBottomChange} />
          </label>
        </MemeTextForm>

        <CreateMemeButton onClick={this.createMeme}>
          <span>CREATE MEME</span>
        </CreateMemeButton>
      </CreateWrapper>
    )
  }
}

export default Create
