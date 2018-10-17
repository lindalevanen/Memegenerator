import React, { Component } from 'react'
import styled from 'styled-components'
import { Stage, Layer, Rect, Text, Image } from 'react-konva'

import Colors from './../colors'

const meme = require('./memetemplate.jpg')

const canvasWidth = 500
const canvasHeight = 300
const marginX = 20;

const CreateWrapper = styled.div`
  width: 100%;
  margin: auto;
  padding-top: 20px;
`

const CanvasWrapper = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;

  p {
    display: inline;
    color: white;
    vertical-align: middle;
    line-height: ${canvasHeight};
  }
`

const MemeTextForm = styled.form`
  margin-top: 20px;

  input {
    height: 40px;
    width: 100%;
    font-size: 100%;
    background: ${Colors.header.bg};
    color: white;
    padding-left: 10px;
    border: 0;
  }

  .private {
    width: auto;
    height: auto;
    margin-top: 20px;
    margin-left: 10px;
  }

  label {
    display: block; 
    margin-bottom: 10px;

    span {
      color: white;
      padding-left: 20px;
      font-weight: lighter;
    }
  }
`

const CreateMemeButton = styled.div`
  width: 100%;
  background: ${Colors.header.bg};
  color: white;
  cursor: pointer;
  font-weight: lighter;
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
      this.props.imageDimensionChange(image.width, image.height)
      this.setState({bottomTextY: image.height - 60})
      this.props.setImageVisible(true)
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
          width={this.props.imageWidth}
          height={this.props.imageHeight}
          fill={'#000000'}
          shadowBlur={5}
          onClick={this.handleClick}
        />
        <Image
          image={this.state.image}
          width={this.props.imageWidth}
          height={this.props.imageHeight}
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
      imageWidth: canvasWidth,
      imageHeight: canvasHeight,
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      templates: '',
      private: false,
      memeImageVisible: false
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
    //this.setState({ imageWidth: window.innerWidth, imageHeight: canvasHeight })
    this.fetchTemplates()
    window.addEventListener("resize", () => this.setState({x: "lol"}))
  }

  handleTopChange = event => {
    this.setState({ topText: event.target.value })
  }

  handleBottomChange = event => {
    this.setState({ bottomText: event.target.value })
  }

  handlePrivateChange = event => {
    this.setState({ private: !this.state.private })
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
    this.downloadURI(dataURL, 'meme.png');
  }

  onImageDimensionChange = (width, height) => {
    this.setState({ imageWidth: width, imageHeight: height})
  }

  render() {
    const width = window.innerWidth > canvasWidth + 2 * marginX ? canvasWidth : window.innerWidth - 2 * marginX
    const height = width * this.state.imageHeight / this.state.imageWidth
    const ratio = width / canvasWidth

    return (
      <CreateWrapper style={{maxWidth: canvasWidth}}>
        <CanvasWrapper>
          <Stage
            ref={ref => (this.stageRef = ref)}
            width={width}
            height={height}
            scale={{x: ratio, y: ratio}}
            visible={true}
          >
            <MemeImage
              topText={this.state.topText}
              bottomText={this.state.bottomText}
              imageHeight={this.state.imageHeight}
              imageWidth={this.state.imageWidth}
              imageDimensionChange={this.onImageDimensionChange}
              setImageVisible={(visible) => this.setState({memeImageVisible: visible})}
            />
          </Stage>
        </CanvasWrapper>

        <MemeTextForm>
          <label>
            <input type="text" name="topText" placeholder="Top text" onChange={this.handleTopChange} />
          </label>
          <label>
            <input type="text" name="bottomText" placeholder="Bottom text" onChange={this.handleBottomChange} />
          </label>
          <label>
            <input className="private" type="checkbox" name="privateCheck" onChange={this.handlePrivateChange} />
            <span>Private</span>
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
