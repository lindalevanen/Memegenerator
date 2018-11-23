import React from 'react'
import styled from 'styled-components'

import Colors from './../colors'

 /* A wrapper container for the popup modal that's used around TemplateList and FinishedMeme */

const ViewContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.35);
`

const ViewContent = styled.div`
  position: relative;
  clickable: false;
  z-index: 2;
  width: 100%;
  max-width: ${props => props.maxWidth + "px"};
  height: auto;
  max-height: ${window.innerHeight - 40 + "px"};
  min-height: 400px;
  top: 20px;
  margin: auto;
  padding-top: 10px;
  background: ${Colors.popup.bg};
  box-shadow: 3px 3px 6px black;
  overflow-y: auto;
`

const Header = styled.div`
  width: 100%;
  min-height: 60px;

  h3 {
    color: white;
    padding: 20px;
    margin-left: 5px;
    font-weight: normal;
    display: inline-block;
  }

  p {
    float: right;
    padding: 10px;
    margin-right: 10px;
    margin-top: 5px;
    cursor: pointer;
    font-size: 20px;
    color: ${Colors.accent}
    font-family: &#215;
  }
`

class ModalWrapper extends React.Component {
  componentDidMount() {
    window.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick)
  }

  handleClick = e => {
    const container = document.getElementById('modal-content')  
    if (container && !container.contains(e.target)) { // i.e click outside the view
      this.props.closeList()
    }
  }

  render() { 
    return (
      <ViewContainer>
        <ViewContent id='modal-content' maxWidth={this.props.maxWidth}>
          <Header>
            <h3>{this.props.title}</h3>
            <p onClick={this.props.closeList}>
              &#x2715;  {/* <- this is a cross-kinda icon */}
            </p>
          </Header>
          {this.props.children}
        </ViewContent>
      </ViewContainer>
    )
  }
}

export default ModalWrapper