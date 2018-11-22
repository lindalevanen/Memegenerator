import React, { Component } from "react";
import moment from 'moment'
import styled from 'styled-components'

import Colors from './../colors'

import { Consumer } from './AppProvider';

const thumbsUp = require('../images/thumbs_up_icon.svg')
const thumbsDown = require('../images/thumbs_down_icon.svg')

const PostWrapper = styled.div`
  margin-bottom: 20px;

  .memeImage {
    background-color: black;
    width: 100%;
  }
`

const Footer = styled.div`
  background-color: ${Colors.popup.bg};
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  box-shadow: 0px 1px 6px black;

  .time {
    display: inline-block;
  }

  .voting {
    margin-left: auto;
    font-weight: bolder;
    display: inline-flex;
    align-items: center;

    p {
      display: inline-block;
      margin-left: 15px;
    }

    p.positive {
      color: #06FF85;
    }

    p.negative {
      color: #C23D1B;
    }

    .button {
      margin-left: 10px;
      display: inline-block;
      padding: 10px;
      cursor: pointer;
      user-select: none;
    }
  }
`

class MemePost extends Component {

  parseUploadTime = (timeInMS) => {
    const time = new Date(timeInMS);
    const formatted = moment(time).startOf('minute').fromNow();
    return formatted
  }

  render() {
    const { id, url, time, voteCount, voteMeme } = this.props

    const voteCountClass = 
      voteCount > 0 ? "positive" :
        voteCount < 0 ? "negative" : ""
    
    return (
      <PostWrapper>
        <img className="memeImage" src={url} alt="memeImage" />
        <Consumer>
              
        {({ state, ...context }) => (
          state.currentUser ?
        <Footer>
          <p className="time">{this.parseUploadTime(time)}</p>
          <div className="voting">
            <img className="button" src={thumbsUp} alt="thumbsUp" onClick={() => voteMeme(id, 1, state.currentUser.uid)} />
            <p className={voteCountClass}>{voteCount}</p>
            <img className="button" src={thumbsDown} alt="thumbsDown" onClick={() => voteMeme(id, -1, state.currentUser.uid)} />
          </div>
        </Footer>
        :
        <Footer>
          <p className="time">{this.parseUploadTime(time)}</p>
        </Footer>
        )}
        </Consumer>
      </PostWrapper>
    );
  }
}

export default MemePost
