import React from 'react'
import { Layer, Rect, Text, Image } from 'react-konva'

const meme = require('./memetemplate.jpg')

const canvasWidth = 500
const canvasHeight = 300

class MemeImage extends React.Component {
  state = {
    image: null,  // TODO: i think we should move the image data to parent component, and pass as props
    topTextX: null,
    topTextY: 20,
    bottomTextX: null,
    bottomTextY: canvasHeight - 60
  }

  loadImage() {
    const image = new window.Image();
    image.src = meme;
    image.onload = () => {
      this.setState({
        image: image
      })
      this.props.imageDimensionChange(image.width, image.height)
      this.setState({bottomTextY: image.height - 60})
      this.props.setImageVisible(true)
    }
  }

  handleDragEndTop = e => {
    const x = e.target.x()
    const y = e.target.y()
    if(y < this.props.imageHeight && y > 0 &&
       Math.abs(x) < this.props.imageWidth/2) {
      this.setState({
        topTextX: e.target.x(),
        topTextY: e.target.y()
      })
    } else {
      this.setState({
        topTextX: this.state.topTextX,
        topTextY: this.state.topTextY
      })
    }
  }

  handleDragEndBottom = e => {
    const x = e.target.x()
    const y = e.target.y()
    if(y < this.props.imageHeight && y > 0 &&
       Math.abs(x) < this.props.imageWidth/2) {
      this.setState({
        bottomTextX: e.target.x(),
        bottomTextY: e.target.y()
      })
    } else {
      this.setState({
        bottomTextX: this.state.bottomTextX,
        bottomTextY: this.state.bottomTextY
      })
    }
  }

  render() {
    console.log("x: "+this.state.topTextX)
    console.log("y: "+this.state.topTextY)
    return (
      <Layer
        >
        <Rect
          width={this.props.imageWidth}
          height={this.props.imageHeight}
          fill={'#000000'}
          shadowBlur={5}
          onClick={this.handleClick}
        />
        <Image
          image={this.state.image}
          width={this.props.imageWidth}
          height={this.props.imageHeight}
          x={
            this.state.image ? canvasWidth / 2 - this.state.image.width / 2 : 0
          }
          ref={node => {
            this.imageNode = node
          }}
          visible={this.props.visible}
        />
        <Text 
          fill='white'
          x={this.state.topTextX}
          y={this.state.topTextY}
          wrap="char"
          align="center"
          text={this.props.topText}
          fontSize={40}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          width={canvasWidth}
          draggable={true}
          onDragEnd={this.handleDragEndTop}
        />
        <Text 
          fill='white' 
          x={this.state.bottomTextX}
          y={this.state.bottomTextY}
          wrap="char"
          align="center"
          text={this.props.bottomText}
          fontSize={40}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          width={canvasWidth}
          draggable={true}
          onDragEnd={this.handleDragEndBottom}
        />
      </Layer>
    )
  }
}

export default MemeImage