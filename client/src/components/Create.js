import React from 'react'
import styled from 'styled-components'
import { Stage } from 'react-konva'

import MemeImage from './MemeImage'
import TemplateList from './TemplateList'
import FinishedMeme from './FinishedMeme'
import ModalWrapper from './ModalWrapper'
import Colors from './../colors'

import { Consumer } from './AppProvider';

//const b64toBlob = require('b64-to-blob');

const isLoggedIn = false

const fontSizeIcon = require('../images/font_icon.png')

const canvasWidth = 500
const canvasHeight = 200
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

  .chooseFile {
    background: ${Colors.main.bg};
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
  cursor: pointer;


  .half {
    flex: 1;
    border: 1px solid gray;
    height: 100%;
    align-content: center;
    max-width: 50%;
    display: table; 
    vertical-align: middle;

    input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .content {
      padding: 10px;
      display: table-cell;
      height: 100%;
      width: 100%;
      vertical-align: middle;
      cursor: pointer;
    }

    p {
      white-space: pre-line;
    }
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
      finishedMemeOpen: false,
      loadingFinishedMeme: true,
      url: ''
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
    const width = this.getCanvasWidth()
    this.setState({finalCanvasWidth: width})
  }

  componentDidMount() {
    this.fetchTemplates()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  getCanvasWidth() {
    const aWidth = window.screen.availWidth
    const iWidth = window.innerWidth
    const viewWidth = aWidth < iWidth ? aWidth : iWidth
    return (
      ( viewWidth > canvasWidth + 2 * marginX ) ? canvasWidth
      : ( viewWidth - 2 * marginX )
    )
  }

  handleResize = () => {
    const cWidth = this.getCanvasWidth()
    this.setState({finalCanvasWidth: cWidth});
    if(this.state.memeImageVisible) {
      const iWidth = this.state.finalImageWidth > cWidth ? cWidth : this.state.finalImageWidth
      const height = iWidth * this.state.finalHeight / this.state.finalImageWidth
      this.setState({finalImageWidth: iWidth, finalHeight: height});
    }
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
      var link = document.createElement("a")
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      //delete link;  // cant do this and idk if its bad to not do this...
  }

  downloadMeme = () => {
    var dataURL = this.stageRef.getStage().toDataURL();
    this.downloadURI(dataURL, 'meme.jpg');
  }

  createAnother = () => {
    this.setState({
      finishedMemeOpen: false,
    })
  }

  createMeme = (uid, isLogged) => {
    const dataURL = this.stageRef.getStage().toDataURL()
    const blob = this.dataURItoBlob(dataURL)
    var fd = new FormData()
    fd.append("image", blob)
    fd.append("priva", this.state.private)
    if(isLogged) {
      fd.append("userId", uid)  // TODO: add userid when we have that
    }

    this.setState({finishedMemeOpen: true})

    fetch('/createMeme', {
      method: 'POST',
      body: fd
    }).then(
      response => {
        if(response.status === 200) {
          return response.json()
        } else {
          throw Error(response)
        }
      }
    ).then(
      data => {
        this.setState({loadingFinishedMeme: false, url: data.message.url})
      }
    ).catch(
      error => {
        console.log(error.statusText) // Handle the error response object
        alert("Something went wrong...")
      } 
    );
  }

  // From: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  chooseImage = (json) => {
    this.setState({
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      chooseTemplateOpen: false
    })
    this.saveDataURL(json.url, json.width, json.height)
  }

  //TOOD: REFACTOR!
  saveDataURL = (url, width, height) => {
    // To create a canvas and get its dataurl to pass to MemeImage is a workaround for a Konva bug that won't
    // let us get Konva canvas (Stage) dataUrl if the image is from a cross-domain source.
    const canvas = document.createElement("canvas");
    const cWidth = this.getCanvasWidth()
    const iWidth = width > cWidth ? cWidth : width
    const cHeight = iWidth * height / width
    this.setState({finalImageWidth: iWidth, finalCanvasWidth: cWidth, finalHeight: cHeight})
    canvas.width = cWidth;
    canvas.height = cHeight;

    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.addEventListener("load", () => {
      canvas.getContext("2d").drawImage(img, 0, 0, cWidth, cHeight)
      this.setState({imageDataUrl: canvas.toDataURL(), url: ""})
    });
    img.setAttribute("src", url);
  }

  handleImage = (e) => {
    const canvas = document.createElement("canvas"); 
    var reader = new FileReader();

    reader.onload = (event) => {
      var img = new Image();
      img.onload = () => {
        const cWidth = this.getCanvasWidth()
        const iWidth = img.width > cWidth ? cWidth : img.width
        const cHeight = iWidth * img.height / img.width
        this.setState({finalImageWidth: iWidth, finalCanvasWidth: cWidth, finalHeight: cHeight})
        canvas.width = cWidth;
        canvas.height = cHeight;

        canvas.getContext("2d").drawImage(img, 0, 0, cWidth, cHeight)
        this.setState({imageDataUrl: canvas.toDataURL()})
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
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
            <div>
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
            </div>
            {/*<div>
              <p 
                onClick={() => 
                  this.state.fontSize > 10 ? 
                  this.setState({fontSize: this.state.fontSize - 2})
                  : null }
              > decrease </p>
              <p 
                onClick={() => 
                  this.state.fontSize < 60 ?
                  this.setState({fontSize: this.state.fontSize + 2})
                  : null }
              > increase </p>
            </div>*/}
          </EditContainer>
        }

        <SetImageContainer 
          style={{width: '100%', height: !this.state.memeImageVisible ? canvasHeight : '80px'}}
        >
          <div className="half" onClick={() => this.setState({chooseTemplateOpen: true})}>
            <p className="content">Choose image from {'\n'} template</p>
          </div>
          <div className="half">
            <label htmlFor="file" className="content"> Upload image </label>
            <input type="file" id="file" className="chooseFile" onChange={this.handleImage} />
          </div>
        </SetImageContainer>

        <MemeTextForm>
          <label>
            <input type="text" name="topText" placeholder="Top text" onChange={this.handleTopChange} />
          </label>
          <label>
            <input type="text" name="bottomText" placeholder="Bottom text" onChange={this.handleBottomChange} />
          </label>
          <label>
            <input type="checkbox" className="private" name="privateCheck" onChange={this.handlePrivateChange} />
            <span>Private</span>
          </label>
        </MemeTextForm>
        <Consumer>
        
        {({ state, ...context }) => (
          state.currentUser ?
        <CreateMemeButton
          disabled={!this.state.memeImageVisible}
          onClick={this.state.memeImageVisible ? () => this.createMeme(state.currentUser.uid, true) : null}
        >
          <span>CREATE MEME</span>
        </CreateMemeButton>
        :
        <CreateMemeButton
          disabled={!this.state.memeImageVisible}
          onClick={this.state.memeImageVisible ? () => this.createMeme("123", false) : null}
        >
          <span>CREATE MEME</span>
        </CreateMemeButton>
          )}
        </Consumer>

        {this.state.chooseTemplateOpen &&
          <ModalWrapper
            maxWidth={this.state.finalCanvasWidth + 100}
            closeList={() => this.setState({chooseTemplateOpen: false})}
            title="Choose template"
          >
            <TemplateList
              width={this.state.finalCanvasWidth}
              list={this.state.templates ? this.state.templates.memes : []}
              imageChosen={this.chooseImage}
            />
          </ModalWrapper>
        }

        {this.state.finishedMemeOpen &&
          <ModalWrapper
            maxWidth={this.state.finalCanvasWidth + 100}
            closeList={() => this.setState({finishedMemeOpen: false, url: ""})}
            title={this.state.url ? "Your finished meme!" : " "}
          >
            <FinishedMeme
              width={this.state.finalCanvasWidth}
              url={this.state.url}
              onCreateAnother={this.createAnother}
              onDownload={this.downloadMeme}
            />
          </ModalWrapper>
        }
      </CreateWrapper>
    )
  }
}

export default Create
