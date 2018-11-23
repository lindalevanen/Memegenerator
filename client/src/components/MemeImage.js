import React from 'react'
import { Layer, Text, Image } from 'react-konva'

/* The content of the react-konva canvas which consists of the meme image and its two textfields */

class MemeImage extends React.Component {
  layer = null
  image = null

  state = {
    image: null,
    topTextX: null,
    topTextY: 20,
    bottomTextX: null,
    bottomTextY: null
  }

  componentWillReceiveProps(newProps) {
    if(newProps.dataUrl !== this.props.dataUrl) {
      this.loadImage(newProps.dataUrl)
    }
    if(newProps.imageHeight !== this.props.imageHeight) {
      this.setState({bottomTextY: newProps.imageHeight - 60})
    }
  }

  componentDidMount() {
    const dif = this.props.canvasWidth / 2 - this.props.imageWidth / 2
    this.setState({
      topTextX: dif,
      bottomTextX: dif
    })
  }

  loadImage(url) {
    const image = new window.Image();
    image.src = url
    image.setAttribute('crossOrigin', 'anonymous');
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      const dif = this.props.canvasWidth / 2 - this.props.imageWidth / 2
      this.setState({
        image: image,
        topTextX: dif + 10,
        topTextY: 20,
        bottomTextX: dif + 10
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
            this.state.image ? this.props.canvasWidth / 2 - this.props.imageWidth / 2 : 0
          }
          preventDefault={false}
        />
        <Text 
          fill='white'
          x={this.state.topTextX}
          y={this.state.topTextY}
          wrap="word"
          align="center"
          width={this.props.imageWidth - 30}
          text={this.props.topText}
          fontSize={this.props.fontSize}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          draggable={true}
          onDragEnd={this.handleDragEndTop}
        />
        <Text 
          fill='white' 
          x={this.state.bottomTextX}
          y={this.state.bottomTextY}
          wrap="word"
          align="center"
          width={this.props.imageWidth - 30}
          text={this.props.bottomText}
          fontSize={this.props.fontSize}
          fontFamily='impact'
          stroke='black'
          strokeWidth={2}
          draggable={true}
          onDragEnd={this.handleDragEndBottom}
        />
      </Layer>
    )
  }
}

export default MemeImage