import React, { Component } from "react";
import "../App.css";

class Canvas extends Component {
  constructor(props) {
    super(props);

    // create a ref to store the canvas element
    this.canvasRef = React.createRef();

    this.state = {
      // set the initial size of the grid
      width: 1000,
      height: 600,
      c: 0,
      m00: 0,
      m01: 0,
      m10: 0,
      m11: 0,
    };

    this.x = 10; //horizontal 'radius' of box
    this.y = 10; //vertizal 'radius' of box
    this.scale = 25; //side length of box in pixels

    this.drawTransformedGrid = this.drawTransformedGrid.bind(this);
    this.matrixMult = this.matrixMult.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext("2d"); // get the 2D rendering context for the canvas
    this.drawGrid();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  //Scuffed ass shit temporary till LA library is found
  matrixMult(matrix, vector) {
    return [
      vector[0] * matrix[0][0] + vector[1] * matrix[0][1],
      vector[0] * matrix[1][0] + vector[1] * matrix[1][1],
    ];
  }

  //same as above
  drawTransformedGrid() {
    this.ctx.translate(this.state.width / 2, this.state.height / 2); //move origin to center of screen

    const { c } = this.state;
    const { m00 } = this.state;
    const { m01 } = this.state;
    const { m10 } = this.state;
    const { m11 } = this.state;

    let m = [
      [1 - c * 0.01 + 0.01 * c * m00, 0.01 * c * m01],
      [0.01 * c * m10, 1 - c * 0.01 + 0.01 * c * m11],
    ];
    for (var i = -this.x; i <= this.x; i++) {
      this.ctx.beginPath();
      for (var j = -this.x; j <= this.x; j++) {
        let vec = this.matrixMult(m, [i, j]);
        this.ctx.lineTo(this.scale * vec[0], -this.scale * vec[1]);
      }
      this.ctx.strokeStyle = "green";
      this.ctx.stroke();
    }

    for (var i = -this.x; i <= this.x; i++) {
      this.ctx.beginPath();
      for (var j = -this.x; j <= this.x; j++) {
        let vec = this.matrixMult(m, [j, i]);
        this.ctx.lineTo(this.scale * vec[0], -this.scale * vec[1]);
      }
      this.ctx.strokeStyle = "green";
      this.ctx.stroke();
    }

    this.ctx.translate(-this.state.width / 2, -this.state.height / 2); //move origin back to top right of screen because strictmode is a turbo bitch
  }

  drawGrid() {
    this.ctx.translate(this.state.width / 2, this.state.height / 2); //move origin to center of screen

    //Draw vertical grids
    for (let x = -this.x; x <= this.x; x++) {
      this.ctx.beginPath();
      this.ctx.lineTo(x * this.scale, -(this.y * this.scale));
      this.ctx.lineTo(x * this.scale, this.y * this.scale);
      if (x == 0) {
        this.ctx.strokeStyle = "red";
      } else {
        this.ctx.strokeStyle = "black";
      }
      this.ctx.stroke();
    }

    //draw horizontal grids
    for (let y = -this.y; y <= this.y; y++) {
      this.ctx.beginPath();
      this.ctx.lineTo(-(this.x * this.scale), y * this.scale);
      this.ctx.lineTo(this.x * this.scale, y * this.scale);
      if (y == 0) {
        this.ctx.strokeStyle = "red";
      } else {
        this.ctx.strokeStyle = "black";
      }
      this.ctx.stroke();
    }
    this.ctx.translate(-this.state.width / 2, -this.state.height / 2); //move origin back to top right of screen because strictmode is a turbo bitch
  }

  updateCanvas() {
    this.clear();
    const { c } = this.state;

    if (c != 0) {
      this.drawTransformedGrid(c);
    }
    this.drawGrid();
  }

  handleChange = (event) => {
    event.persist();
    const c = event.target.value;
    this.setState({ c });
  };

  m00Change = (event) => {
    event.persist();
    const m00 = event.target.value;
    this.setState({ m00 });
  };

  m01Change = (event) => {
    event.persist();
    const m01 = event.target.value;
    this.setState({ m01 });
  };

  m10Change = (event) => {
    event.persist();
    const m10 = event.target.value;
    this.setState({ m10 });
  };

  m11Change = (event) => {
    event.persist();
    const m11 = event.target.value;
    this.setState({ m11 });
  };

  clear() {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
  }

  render() {
    const { c } = this.state;
    return (
      <div className="centered-div">
        <canvas
          ref={this.canvasRef} // attach the ref to the canvas element
          width={this.state.width}
          height={this.state.height}
          onClick={() => console.log(this.state.m00)}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={c}
          onChange={this.handleChange}
        />
        <div id="input-container">
          <div id="input-column">
            <div>
              <input type="number" onChange={this.m00Change}></input>
              <input type="number" onChange={this.m01Change}></input>
            </div>
            <div>
              <input type="number" onChange={this.m10Change}></input>
              <input type="number" onChange={this.m11Change}></input>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Canvas;
