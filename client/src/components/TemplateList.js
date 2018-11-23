import React from 'react'
import styled from 'styled-components'
import GridList from '@material-ui/core/GridList';

/* A grid view that shows some popular memes from the imgflip API we use, passed as props to this component. */

const ListWrapper = styled.div`
  padding: 20px;
  padding-top: 0px;

  img {
    cursor: pointer;
  }
`
class TemplateList extends React.Component {
  parseMemeJson(json) {
    return (
      <img 
        key={json.id} 
        src={json.url} 
        alt='' 
        onClick={() => this.props.imageChosen(json)}
      />
    )
  }

  render() { 
    return (
      <ListWrapper>
        <GridList cols={this.props.width < 500 ? 2 : 3} height='auto'>
          {this.props.list.map(meme => this.parseMemeJson(meme))}
        </GridList>
      </ListWrapper>
    )
  }
}

export default TemplateList