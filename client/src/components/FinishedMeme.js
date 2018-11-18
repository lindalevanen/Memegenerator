import React from 'react'
import styled from 'styled-components'

import Colors from './../colors'
const copyIcon = require('../images/copy_icon.svg')

const FinishedMemeContainer = styled.div`
  .memeImage {
    background-color: black;
    height: 300px;
    display: block;
    max-height: 400px;
    margin: auto;
  }
`

const UrlField = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;

  align-text: middle;
  align-items: center;
  justify-content: center;

  .title {
    padding-right: 10px;
  }

  .copy {
    padding: 10px;
    cursor: pointer;
  }
  
  .url {
    padding: 10px;
    max-width: 85%;
    background-color: ${Colors.main.lightAccent};

    .text {
      min-width: 0;
      overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }
`

const HalfAndHalf = styled.div`
  div {
    width: 50%;
    height: 80px;
    align-text: middle;
    color: ${Colors.accent};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid ${Colors.main.lightAccent};
    cursor: pointer;
  }

  .first {
    border-right: 2px solid ${Colors.main.lightAccent};
  }
`

//TODO: the whole class
class FinishedMeme extends React.Component {

  copyToClipboard = () => {
    var textArea = document.createElement("textarea");
    textArea.value = this.props.url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  // possible share functionality: https://www.npmjs.com/package/react-share
  render() {
    return (
      <FinishedMemeContainer>

        <img className="memeImage" src={this.props.url} alt="meme" />

        <UrlField>
          <p className="title">url:</p> 
          <div className="url">
            <div className="text">
              {this.props.url ? this.props.url : "https://www.firebaseapp.com/34534ugj5jgijeoigjg3joejiojefoe4hogeo5ngoe4ngoe4inge/oi4jtoienrgeu4nf"}
            </div>
          </div>
          <img className="copy" src={copyIcon} alt="copy" onClick={this.copyToClipboard} />
        </UrlField>
        

        <HalfAndHalf>
          <div className="first" onClick={this.props.onCreateAnother}>
            Create another
          </div>
          <div className="second" onClick={this.props.onDownload}>
            Download
          </div>
        </HalfAndHalf>
      </FinishedMemeContainer>
    )
  }
}

export default FinishedMeme