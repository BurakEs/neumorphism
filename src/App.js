import React, { Component } from 'react'
import './App.css'



 class App extends Component {
  constructor() {
    super();
    const ScreenSize= window.innerWidth ;
   
   
    
    this.state = {
      screenSize:ScreenSize,
      active:"1",
      copied:false,
      background: '#ff5c5c',
      txtColor:'#000000',
      intensityNegative:'#662424',
      intensityPositive:'#ff9393',
      size:300,
      radius:50,
      distance:20,
      intensity:15,
      blur:60,
      positionX:20,
      positionY:20,
      positionXOpposite:-20,
      positionYOpposite:-20,
    }
  }
  componentDidMount() {
    this.checkScreen();
  }
  checkScreen=()=>{
    if(this.state.screenSize > this.state.size){
      this.setState({size : this.state.screenSize*0.2});
    }
  }
  
  intensityNega=(color)=>{
    const value = (this.state.intensity*0.01) ;
    console.log(value)
    var result = parseInt(color,16)  - (parseInt(color,16) * (value));

    return result === 0 ? 0 : result;
  };
  intensityPoz=(color)=>{
    const value = (this.state.intensity*0.01) + 1;

    var result = parseInt(color,16) * value;

    return result >= 255 ? 255 : result;
  };

  intensity = (hex) =>{
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var colorAvg = (parseInt(rgb[1],16) + parseInt(rgb[2],16) + parseInt(rgb[3],16));
    colorAvg=colorAvg >375 ? 0 : 255 ;

    var rN= parseInt(this.intensityNega(rgb[1]),10);
    var gN= parseInt(this.intensityNega(rgb[2]),10);
    var bN= parseInt(this.intensityNega(rgb[3]),10);
    
    var rP= parseInt(this.intensityPoz(rgb[1]),10);
    var gP= parseInt(this.intensityPoz(rgb[2]),10);
    var bP= parseInt(this.intensityPoz(rgb[3]),10);

    this.setState({       intensityNegative: "#" + ((1 << 24) + (rN<<16 )+ (gN<<8 )+ (bN)).toString(16).slice(1)     })
    this.setState({       intensityPositive: "#" + ((1 << 24) + (rP<<16) + (gP<< 8) + (bP)).toString(16).slice(1)    })
    this.setState({       txtColor: "#" + ((1 << 24) + (colorAvg<<16 )+ (colorAvg<<8 )+ (colorAvg)).toString(16).slice(1)     })
  };

  colorChange = (color) => {
    this.intensity(color.target.value);
    this.setState({ background: color.target.value })
  };
  rangeChange = (e) =>{
    this.setState({[e.target.id]: e.target.value})
    if([e.target.id] == "size"){
      this.setState({blur :Math.ceil(e.target.value/5)});
      this.setState({distance :Math.ceil(e.target.value/10)});
      this.distanceUpdate();

    }
    if([e.target.id] == "intensity"){
      this.intensity(this.state.background);
    }
    if([e.target.id] == "distance"){
      this.distanceUpdate();
    }

  }
  distanceUpdate =()=>{
    const domId = document.getElementById(this.state.active)
      this.setState({positionX:this.state.distance,positionY:this.state.distance,positionXOpposite:this.state.distance,
        positionYOpposite:this.state.distance,blur:(this.state.distance*2)})
      this.setState({[domId.getAttribute('light')]:~this.state.distance+1,[domId.getAttribute('light2')]:~this.state.distance+1})
  }

  lightChange =(e) =>{
    const clicked = e.target.id
    this.setState({active: clicked,positionX:this.state.distance,positionY:this.state.distance,positionXOpposite:this.state.distance,positionYOpposite:this.state.distance})
    this.setState({[e.target.getAttribute('light')]:~this.state.distance+1,[e.target.getAttribute('light2')]:~this.state.distance+1})
  }
  copied =(e)=>{
    const copyText = document.querySelector("pre").textContent;
    const textArea = document.createElement('textarea');
    textArea.textContent = copyText ;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy")
    this.setState({copied:true})
    setTimeout(()=>{
      this.setState({copied:false})
    },1000);
  }


  render() {
    return (
      <div className="App" style={{"--bgColor":this.state.background,"--color":this.state.txtColor,"--size":this.state.size+"px","--radius":this.state.radius+"px",
            "--blur":this.state.blur+"px","--intensityN": this.state.intensityNegative,
            "--intensityP":this.state.intensityPositive,"--positionX":this.state.positionX+"px",
            "--positionY":this.state.positionY+"px","--positionXOpposite":this.state.positionXOpposite+"px",
            "--positionYOpposite":this.state.positionYOpposite+"px","--screenSize":(this.state.screenSize/2)+"px"}} >
        <div className="Title">
          <h1>Neumorphism Clone</h1>
          <h2>Generate <span  style={{fontWeight:"bold"}}>Soft-UI</span> CSS Code</h2>        
        </div>

        <div className="Container"> 

          <div className="ResultBox">
            <div id="1" className={`Light TopL ${this.state.active === "1"? 'active': ''}`}  light="positionXOpposite" light2="positionYOpposite" onClick={this.lightChange}></div>
            <div id="2" className={`Light TopR ${this.state.active === "2"? 'active': ''}`} light="positionX" light2="positionYOpposite" onClick={this.lightChange}></div>
            <div id="3" className={`Light BottomL ${this.state.active === "3"? 'active': ''}`} light="positionXOpposite" light2="positionY" onClick={this.lightChange}></div>
            <div id="4" className={`Light BottomR ${this.state.active === "4"? 'active': ''}`} light="positionX" light2="positionY" onClick={this.lightChange}></div>
            <div className="Result Neumorphism" >
            </div>
          </div>

          <div className="Config Neumorphism">
            <div className="row">
                <label >Bir renk seç</label>
                <input id="color" name="color" type="color"  value={ this.state.background } onChange={ this.colorChange }  />
            </div>
            <div className="row">
              <label>Boyut:</label>
              <input id="size" name="size" type="range" value={this.state.size}  max={this.state.screenSize <640 ? this.state.screenSize/2 : 400} min="10" step="1"  onChange={this.rangeChange} />
            </div>
            <div className="row">
              <label>Radius:</label>
              <input id="radius" name="radius" type="range" value={this.state.radius}  max={Math.ceil(this.state.size/2)} min="0" step="1"  onChange={this.rangeChange} />
            </div>
            <div className="row">
              <label>Distance:</label>
              <input id="distance" name="distance" type="range" value={this.state.distance}  max="50" min={this.state.size < 50 ? Math.ceil(this.state.size/10) : 5 } step="1"  onChange={this.rangeChange} />
            </div>
            <div className="row">
              <label>Intensity:</label>
              <input id="intensity" name="intensity" type="range" value={this.state.intensity}  max="60" min="1" step="1"  onChange={this.rangeChange} />
            </div>
            <div className="row">
              <label>Blur:</label>
              <input id="blur" name="blur" type="range" value={this.state.blur}  max="100" min="0" step="1"  onChange={this.rangeChange} />
            </div>
            <div className="codeBlock">
              <button className={`copy ${this.state.copied === true ? 'copied': ''}`}  onClick={this.copied}>
               <span style={this.state.copied ? {display:"none"} : {display:"block"}}>Copy</span> 
              <span style={!this.state.copied ? {display:"none"} : {display:"block"}} className="copiedTxt">Copied to Clipboard</span>
              </button>
              <pre>
                <code>
                <xmp><span className="cssTag">border-radius:</span><span className="cssValue"> {this.state.radius+"px"}</span><span className="cssTag">;</span></xmp>
                <xmp><span className="cssTag">background:</span><span className="cssValue"> {this.state.background}</span><span className="cssTag">;</span></xmp>
                <xmp><span className="cssTag">box-shadow:</span><span className="cssValue"> {this.state.positionX+"px "+this.state.positionY+"px "+this.state.blur+"px "+this.state.intensityNegative}</span><span className="cssTag">,</span></xmp>
                <xmp><span className="cssTag">           </span><span className="cssValue"> {this.state.positionXOpposite+"px "+this.state.positionYOpposite+"px "+this.state.blur+"px "+this.state.intensityPositive}</span><span className="cssTag">;</span></xmp>
                </code>
              </pre>
            </div>


          </div>

        </div>

      </div>
    )
  }
}

export default App;