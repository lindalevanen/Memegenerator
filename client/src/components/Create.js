import React from 'react'
import styled from 'styled-components'
import { Stage } from 'react-konva'

import MemeImage from './MemeImage'
import TemplateList from './TemplateList'
import FinishedMeme from './FinishedMeme'
import Colors from './../colors'

const canvasWidth = 500
const canvasHeight = 300
const marginX = 20

const CreateWrapper = styled.div`
  width: 100%;
  margin: auto;
  padding-top: 20px;
  margin-bottom: 50px;
`

const CanvasWrapper = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: black;

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

class Create extends React.Component {

  stageRef = null
  
  constructor(props) {
    super(props)
    this.state = {
      image: '',
      imageWidth: canvasWidth,
      imageHeight: canvasHeight,
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      templates: '',
      private: false,
      memeImageVisible: false,
      chooseTemplateOpen: false,
      finishedMemeOpen: false
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

  chooseImage = (json) => {
    this.setState({image: json, chooseTemplateOpen: false})
  }

  render() {
    // TODO: refactor these variables
    const width = window.innerWidth > canvasWidth + 2 * marginX ? canvasWidth : window.innerWidth - 2 * marginX
    const height = (this.state.imageWidth > width ? width : this.state.imageWidth) * this.state.imageHeight / this.state.imageWidth
    const ratio = width / canvasWidth

    return (
      <CreateWrapper style={{maxWidth: canvasWidth}}>
        <SetImageContainer 
          style={{width: width, height: !this.state.memeImageVisible ? height : '50px'}} 
          onClick={() => this.setState({chooseTemplateOpen: true})}
        >
          <p>{!this.state.memeImageVisible ? "Choose image" : "Choose another"}</p>
        </SetImageContainer>
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
              image={this.state.image}
              imageHeight={height}
              imageWidth={this.state.imageWidth > width ? width : this.state.imageWidth}
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
      
        <CreateMemeButton /* TODO: fix: onClick={this.createMeme}*/>
          <span>CREATE MEME (not yet implemented)</span>
        </CreateMemeButton>

        {this.state.chooseTemplateOpen &&
          <TemplateList
            width={width}
            closeList={() => this.setState({chooseTemplateOpen: false})}
            list={this.state.templates ? this.state.templates.memes : []}
            imageChosen={this.chooseImage}
          />
        }

        {this.state.finishedMemeOpen &&
          <FinishedMeme
            width={width}
            closeList={() => this.setState({finishedMemeOpen: false})}
          />
        }
      </CreateWrapper>
    )
  }
}

export default Create
