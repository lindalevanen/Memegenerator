import React, { Component } from "react";
import styled from 'styled-components'

import MemePost from './MemePost'

const MemeList = styled.div`
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding-top: 20px;
  margin-bottom: 50px;
`

class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memes: ""
    }
  }

  componentDidMount() {
    this.fetchMemes()
      .then(res => this.setState({ memes: res }))
      .catch(err => console.log(err));
  }

  fetchMemes = async () => {
    const response = await fetch("/memeList");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.data;
  }

  upvoteMeme = (key) => {
    this.sendVote(key, 1)
    if(this.state.memes[key]) {
      const modifiedMeme = {
        ...this.state.memes[key], 
        voteCount: this.state.memes[key].voteCount + 1 
      }
      this.setState({
        memes: {
          ...this.state.memes, 
          [key]: modifiedMeme
        }
      })
    }
  }

  downvoteMeme = (key) => {
    this.sendVote(key, -1)
    if(this.state.memes[key]) {
      const modifiedMeme = {
        ...this.state.memes[key], 
        voteCount: this.state.memes[key].voteCount - 1
      }
      this.setState({
        memes: {
          ...this.state.memes, 
          [key]: modifiedMeme
        }
      })
    } 
  }

  sendVote = (key, amount) => {
    fetch('/votePost', {
      method: 'POST',
      body: {key: key, amount: amount}
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
        alert("Something went wrong when voting... "+ error.statusText)
      } 
    );
  } 

  parseMemes = (memes) => {
    return (
      Object.keys(memes).reverse().map((key) => {
        return (
          <MemePost
            key={key}
            id={key}
            url={memes[key].imageUrl}
            time={memes[key].uploadTime}
            voteCount={memes[key].voteCount}
            onThumbsUp={this.upvoteMeme}
            onThumbsDown={this.downvoteMeme}
          />
        )
      })
    )
  }

  render() {
    return (
      <MemeList>
        {this.parseMemes(this.state.memes)}
      </MemeList>
    );
  }
}

export default Browse
