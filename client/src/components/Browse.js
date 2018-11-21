import React, { Component } from "react";
import styled from 'styled-components'

import MemePost from './MemePost'
import Colors from './../colors'

const MemeList = styled.div`
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding-top: 80px;
  margin-bottom: 50px;
`

const Header = styled.div`
  height: 60px;
  width: 100%;
  z-index: 10;
  position: fixed;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${Colors.popup.bg};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 6px black;

  select {
    padding: 3px 20px 2px 20px;
    appearance: none;
    margin-left: 10px;
    color: white;
    background-color: ${Colors.popup.bg};
    font-size: 15px;
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid white;
    cursor: pointer;
    text-align-last:center;
  }
`

const Button = styled.div`
  height: 60px;
  width: 30%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.header.bg};
  color: ${Colors.accent};
  cursor: pointer;
  margin-bottom: 50px;
`

class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memes: [],
      voted: {},
      orderType: "new"
    }
  }

  componentDidMount() {
    this.getMemes(this.state.orderType)
  }
  
  getMemes = (order) => {
    this.fetchMemes(order)
      .then(res => {
        this.setState({ memes: res })
      }).catch(err => console.log(err));
  }

  fetchMemes = async (order) => {
    const response = await fetch("/memeList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: order
      })
    })
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.data;
  }

  voteMeme = (key, amount) => {
    this.sendVote(key, amount)
  }

  sendVote = (key, amount) => {
    fetch('/voteMeme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key, 
        amount: amount, 
        uid: 123
      })
    }).then(
      response => {
        if(response.status === 200) {
          return response.json()
        } else {
          throw Error(response)
        }
      }
    ).then(
      res => {
        const updatedMemes = this.state.memes
        const memeIndex = this.state.memes.findIndex((obj => obj.id === key));

        if(memeIndex) {
          updatedMemes[memeIndex].voteCount += res.voteChange
          this.setState({
            memes: updatedMemes
          })
        }
      }
    ).catch(
      error => {
        console.log(error) // Handle the error response object
        alert("Something went wrong when voting... "+ error.toString)
      } 
    );
  }

  orderList = (e) => {
    const type = e.target.value
    this.setState({orderType: type})
    this.getMemes(type)
  }

  loadMore = () => {
    const lastMeme = this.state.memes[this.state.memes.length-1]
    let lastVal = null
    switch (this.state.orderType) {
      case "new":
      case "old":
        lastVal = lastMeme.uploadTime
        break;
      case "best":
        lastVal = lastMeme.voteCount
        break;
      default: break;
    }
    fetch('/moreMemes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: this.state.orderType,
        lastPostId: lastMeme.id,
        lastPostVal: lastVal
      })
    }).then(
      response => {
        if(response.status === 200) {
          return response.json()
        } else {
          throw Error(response)
        }
      }
    ).then(
      res => {
        
        this.setState({
          memes: this.state.memes.concat(res.data)
        })
      }
    ).catch(
      error => {
        console.log(error) // Handle the error response object
        alert("Something went wrong when voting... "+ error.message)
      } 
    );
  }

  parseMemes = (memes) => {
    return (
      memes.map((meme) => {
        return (
          <MemePost
            key={meme.id}
            id={meme.id}
            url={meme.imageUrl}
            time={meme.uploadTime}
            voteCount={meme.voteCount}
            voteMeme={this.voteMeme}
          />
        )
      })
    )
  }

  render() {
    console.log(this.state.memes)
    return (
      <div>
        <Header>
          <label>
            Sort by:
            <select value={this.state.orderType} onChange={this.orderList}>
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
              <option value="best">Best</option>
            </select>
          </label>
        </Header>
        <MemeList>
          {this.state.memes && this.parseMemes(this.state.memes)}
        </MemeList>
        {this.state.memes && <Button onClick={this.loadMore}>Load more</Button> }
      </div>
    );
  }
}

export default Browse
