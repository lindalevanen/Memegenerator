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

const SetImageContainer = styled.div`
  background: ${Colors.header.bg};
  display: flex;
  align-items: center;
  text-align: center;
  color: white;
  border: 1px solid gray;
  cursor: pointer;

  p {
    width: 100%;
  }
`

const ChooseTemplateWrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 20px;
  margin: auto;
  width: ${props => props.width + "px" || canvasWidth + "px"};
  height: 800px;
  max-height: ${window.innerHeight - 40 + "px"};
  background: ${Colors.popup.bg};

  p {
    float: right;
    padding: 20px;
    cursor: pointer;
  }
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
    
  }

  loadImage() {
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
    const x = e.target.x()
    const y = e.target.y()
    if(y < this.props.imageHeight && y > 0 &&
       Math.abs(x) < this.props.imageWidth/2) {
      this.setState({
        topTextX: e.target.x(),
        topTextY: e.target.y()
      })
    } else {
      this.setState({
        topTextX: this.state.topTextX,
        topTextY: this.state.topTextY
      })
    }
  }

  handleDragEndBottom = e => {
    const x = e.target.x()
    const y = e.target.y()
    if(y < this.props.imageHeight && y > 0 &&
       Math.abs(x) < this.props.imageWidth/2) {
      this.setState({
        bottomTextX: e.target.x(),
        bottomTextY: e.target.y()
      })
    } else {
      this.setState({
        bottomTextX: this.state.bottomTextX,
        bottomTextY: this.state.bottomTextY
      })
    }
  }

  render() {
    console.log("x: "+this.state.topTextX)
    console.log("y: "+this.state.topTextY)
    return (
      <Layer
        >
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
          visible={this.props.visible}
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
      memeImageVisible: false,
      chooseTemplateOpen: false
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
    this.downloadURI(dataURL, 'meme.jpg');
  }

  onImageDimensionChange = (width, height) => {
    this.setState({ imageWidth: width, imageHeight: height})
  }

  chooseImage() {

  }

  render() {
    const width = window.innerWidth > canvasWidth + 2 * marginX ? canvasWidth : window.innerWidth - 2 * marginX
    const height = width * this.state.imageHeight / this.state.imageWidth
    const ratio = width / canvasWidth

    return (
      <CreateWrapper style={{maxWidth: canvasWidth}}>
        {!this.state.memeImageVisible &&
          <SetImageContainer 
            style={{width: width, height: height}} 
            onClick={() => this.setState({chooseTemplateOpen: true})}
          >
            <p>Choose image</p>
          </SetImageContainer>
        }
        <CanvasWrapper>
          <Stage
            ref={ref => (this.stageRef = ref)}
            width={width}
            height={this.state.memeImageVisible ? height : 0}
            scale={{x: ratio, y: ratio}}
            visible={this.state.memeImageVisible}
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

        {/* TODO: I THINK THIS SHOULD BE MADE INTO A COMPONENT (and not load templates on app start) */}
        {this.state.chooseTemplateOpen &&
          <ChooseTemplateWrapper width={width} height={height}>
            <p onClick={() => this.setState({chooseTemplateOpen: false})}>close</p>
          </ChooseTemplateWrapper>
        }
      </CreateWrapper>
    )
  }
}

export default Create
