import React from 'react'
import styled from 'styled-components'
import GridList from '@material-ui/core/GridList';

import Colors from './../colors'

const ViewContainer = styled.div`
  position: fixed;
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
  padding-top: 10px;
  background: ${Colors.popup.bg};
  box-shadow: 3px 3px 6px black;
  overflow: scroll;
`

const ListWrapper = styled.div`
  padding: 20px;
  padding-top: 0px;

  img {
    cursor: pointer;
  }
`

const Header = styled.div`
  width: 100%;

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

  parseMemeJson(json) {
    return (
      <img key={json.id} src={json.url} alt='' onClick={() => this.props.imageChosen(json)}/>
    )
  }

  render() { 
    console.log(this.props.width)
    return (
      <ViewContainer>
        <ChooseTemplateWrapper id='template-content' width={this.props.width}>
          <Header>
            <h3>Choose template</h3>
            <p onClick={this.props.closeList}>
              &#x2715;
            </p>
          </Header>
          <ListWrapper>
            <GridList cols={this.props.width < 500 ? 2 : 3} height='auto'>
              {this.props.list.map(meme => this.parseMemeJson(meme))}
            </GridList>
          </ListWrapper>
        </ChooseTemplateWrapper>
      </ViewContainer>
    )
  }
}

export default TemplateList