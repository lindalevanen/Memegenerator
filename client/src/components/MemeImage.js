import React from 'react'
import { Layer, Text, Image } from 'react-konva'

const canvasWidth = 500
const canvasHeight = 300

class MemeImage extends React.Component {
  layer = null
  image = null

  state = {
    image: null,
    topTextX: null,
    topTextY: 20,
    bottomTextX: null,
    bottomTextY: canvasHeight - 60
  }

  componentWillReceiveProps(newProps) {
    if(newProps.dataUrl !== this.props.dataUrl) {
      this.loadImage(newProps.dataUrl)
    }
    if(newProps.imageHeight !== this.props.imageHeight) {
      this.setState({bottomTextY: newProps.imageHeight - 60})
    }
  }

  loadImage(url) {
    const image = new window.Image();
    image.src = url
    image.setAttribute('crossOrigin', 'anonymous');
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      this.setState({
        image: image,
        topTextX: null,
        topTextY: 20,
        bottomTextX: null
      })
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
    return (
      <Layer ref={node => { this.layer = node }}>
        <Image
          ref={node => { this.image = node }}
          image={this.state.image}
          width={this.props.imageWidth}
          height={this.props.imageHeight}
          x={
            this.state.image ? canvasWidth / 2 - this.props.imageWidth / 2 : 0
          }
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