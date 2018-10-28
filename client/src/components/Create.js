import React from 'react'
import styled from 'styled-components'
import { Stage } from 'react-konva'

import MemeImage from './MemeImage'
import TemplateList from './TemplateList'
import FinishedMeme from './FinishedMeme'
import Colors from './../colors'

const fontSizeIcon = require('../images/font_icon.png')

const canvasWidth = 500
const canvasHeight = 300
const marginX = 20

//TODO: move styles to a separate style file
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

const EditContainer = styled.div`
  background: ${Colors.popup.bg};
  margin-bottom: 10px;
  user-select: none;
  padding-left: 5px;
  box-shadow: 0px 1px 6px black;

  p {
    display: inline-block;
    font-weight: bolder;
    padding: 10px;
    vertical-align: middle;
    cursor: pointer;
  }

  img {
    height: 30px;
    vertical-align: middle;
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
  color: ${props => props.disabled ? 'gray' : 'white'};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};;
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
    //TODO: huge refactor, not all these values are even needed
    this.state = {
      image: '',
      imageDataUrl: '',
      imageWidth: canvasWidth,
      imageHeight: canvasHeight,
      finalImageWidth: canvasWidth,
      finalCanvasWidth: canvasWidth,
      finalHeight: canvasHeight,
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      templates: '',
      fontSize: 40,
      private: false,
      memeImageVisible: false,
      chooseTemplateOpen: false,
      finishedMemeOpen: false
    }
  }

  //TODO: We might want to move this to TemplateList...
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

  componentWillMount() {
    const width = window.innerWidth > canvasWidth + 2 * marginX ? canvasWidth : window.innerWidth - 2 * marginX
    this.setState({finalCanvasWidth: width})
  }

  componentDidMount() {
    this.fetchTemplates()
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('orientationchange', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.addEventListener('orientationchange', this.handleResize)
  }

  handleResize = () => {
    this.setState(this.state);
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

  chooseImage = (json) => {
    this.setState({image: json, chooseTemplateOpen: false})
    this.saveDataURL(json.url, json.width, json.height)
  }

  //TOOD: REFACTOR!
  saveDataURL = (url, w, h) => {
    var canvas = document.createElement("canvas");
    const cWidth = window.innerWidth > canvasWidth + 2 * marginX ? canvasWidth : window.innerWidth - 2 * marginX
    const iWidth = w > cWidth ? cWidth : w
    const height = iWidth * h / w
    this.setState({finalImageWidth: iWidth, finalCanvasWidth: cWidth, finalHeight: height})
    canvas.width = cWidth;
    canvas.height = height;

    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.addEventListener("load", () => {
      canvas.getContext("2d").drawImage(img, 0, 0, cWidth, height)
      this.setState({imageDataUrl: canvas.toDataURL()})
      //this.downloadURI(canvas.toDataURL(), 'meme.jpg');
    });

    img.setAttribute("src", url);
  }

  render() {
    //TODO: refactor, we really dont want all of the components to be defined here (MemeTextForm could be a class)
    return (
      <CreateWrapper style={{maxWidth: canvasWidth}}>
        <CanvasWrapper>
          <Stage
            ref={ref => (this.stageRef = ref)}
            width={this.state.finalCanvasWidth}
            height={this.state.memeImageVisible ? this.state.finalHeight : 0}
            visible={this.state.memeImageVisible}
          >
            <MemeImage
              dataUrl={this.state.imageDataUrl}
              topText={this.state.topText}
              bottomText={this.state.bottomText}
              fontSize={this.state.fontSize}
              image={this.state.image}
              imageHeight={this.state.finalHeight}
              imageWidth={this.state.finalImageWidth}
              canvasWidth={this.state.finalCanvasWidth}
              imageDimensionChange={this.onImageDimensionChange}
              setImageVisible={(visible) => this.setState({memeImageVisible: visible})}
            />
          </Stage>
        </CanvasWrapper>

        {this.state.memeImageVisible &&
          <EditContainer>
            <p 
              onClick={() => 
                this.state.fontSize > 10 ? 
                this.setState({fontSize: this.state.fontSize - 2})
                : null }
            > - </p>
            <img src={fontSizeIcon} alt='' />
            <p 
              onClick={() => 
                this.state.fontSize < 60 ?
                this.setState({fontSize: this.state.fontSize + 2})
                : null }
            > + </p>
          </EditContainer>
        }

        <SetImageContainer 
          style={{width: this.state.finalCanvasWidth, height: !this.state.memeImageVisible ? canvasHeight : '50px'}} 
          onClick={() => this.setState({chooseTemplateOpen: true})}
        >
          <p>{!this.state.memeImageVisible ? "Choose image" : "Choose another"}</p>
        </SetImageContainer>

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
      
        <CreateMemeButton
          disabled={!this.state.memeImageVisible}
          onClick={this.state.memeImageVisible ? this.createMeme : null}
        >
          <span>CREATE MEME</span>
        </CreateMemeButton>

        {this.state.chooseTemplateOpen &&
          <TemplateList
            width={this.state.finalCanvasWidth}
            closeList={() => this.setState({chooseTemplateOpen: false})}
            list={this.state.templates ? this.state.templates.memes : []}
            imageChosen={this.chooseImage}
          />
        }

        {this.state.finishedMemeOpen &&
          <FinishedMeme
            width={this.state.finalCanvasWidth}
            closeList={() => this.setState({finishedMemeOpen: false})}
          />
        }
      </CreateWrapper>
    )
  }
}

export default Create
