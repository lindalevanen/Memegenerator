import React from 'react'
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 

import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';
import Colors from './../colors'

/* A view to show the finished meme and a functionality to copy the url to clipboard */

const copyIcon = require('../images/copy_icon.svg')

const MemeImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  .image {
    z-index: 10;
    max-height: 400px;
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
    width: 100%;
    max-width: 85%;
    text-align: center;
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

const override = css`
  position: absolute;
`;

class FinishedMeme extends React.Component {

  copyUrlToClipboard = () => {
    var textArea = document.createElement("textarea");
    textArea.value = this.props.url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      if(successful) {
        toast('Url copied to clipboard!')
      } else {
        toast('Something went wrong when copying the url...')
      }
    } catch (err) {
      toast(err)
    }

    document.body.removeChild(textArea);
  }

  render() {
    return (
      <div>
        <MemeImageWrapper>
          {this.props.url && <img className="image" src={this.props.url} alt="meme" /> }
          <BeatLoader
            className={override}
            sizeUnit={"px"}
            size={10}
            color={Colors.accent}
            loading={true}
          />
        </MemeImageWrapper>

        <UrlField>
          <p className="title">url:</p> 
          <div className="url">
            <div className="text">
              {this.props.url ? this.props.url : "..."}
            </div>
          </div>
          <img className="copy" src={copyIcon} alt="copy" onClick={this.copyUrlToClipboard} />
        </UrlField>

        <HalfAndHalf>
          <div className="first" onClick={this.props.onCreateAnother}>
            Create another
          </div>
          <div className="second" onClick={this.props.onDownload}>
            Download
          </div>
        </HalfAndHalf>

        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          removeCloseButton={true}
        />
      </div>
    )
  }
}

export default FinishedMeme