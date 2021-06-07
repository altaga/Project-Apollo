
import React from 'react';
import { VictoryLine, VictoryChart, VictoryTheme } from 'victory';

class LineGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data:this.props.data
    };
  }

  componentDidUpdate(){
    if(this.props.data !== this.state.data)
    {
      this.setState({
        data:this.props.data,
      })
    }
  }

  render() {
    let data = []
    for (let i = 0; i < this.state.data.length; i++) {
      data.push({ x: i, y: this.state.data[i] })
    }
    return (
      <div style={{width:"100%"}}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          style={{
            data: { 
              stroke: "#c43a31" ,
              strokeWidth:"10"
          },
            parent: { border: "1px solid #ccc" }
          }}
          data={data}
        />
      </VictoryChart>
      </div>
    );
  }
}

export default LineGraph;