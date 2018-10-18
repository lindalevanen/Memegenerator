import React from 'react'
import styled from 'styled-components'

import Colors from './../colors'

const ViewContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.35);
`

const ChooseTemplateWrapper = styled.div`
  position: relative;
  clickable: false;
  z-index: 2;
  width: ${props => props.width + "px"};
  height: 800px;
  max-height: ${window.innerHeight - 40 + "px"};
  top: 20px;
  margin: auto;
  background: ${Colors.popup.bg};
  box-shadow: 3px 3px 6px black;

  p {
    float: right;
    padding: 20px;
    cursor: pointer;
    font-size: 20px;
    color: ${Colors.accent}
  }
`

class TemplateList extends React.Component {
  componentDidMount() {
    window.addEventListener('mousedown', this.handleClick)

    // TODO: fetch templates
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick)
  }

  handleClick = e => {
    const container = document.getElementById('template-content')  
    if (container && !container.contains(e.target)) { // i.e click outside the view
      this.props.closeList()
    }
  }


  render() { 
    return (
      <ViewContainer>
        <ChooseTemplateWrapper id='template-content' width={this.props.width}>
          <p onClick={this.props.closeList} >
            X 
          </p>


        </ChooseTemplateWrapper>
      </ViewContainer>
    )
  }
}

export default TemplateList